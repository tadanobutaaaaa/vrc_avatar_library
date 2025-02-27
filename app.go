package main

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

type ConfigSearchFolder struct {
	SearchFolder string `json:"searchFolder"`
}

type ConfigMoveFolder struct {
	MoveFolder string `json:"moveFolder"`
}

type Config struct {
	SearchFolder string `json:"searchFolder"`
	MoveFolder   string `json:"moveFolder"`
}

// App struct
type App struct {
	ctx context.Context
}

var (
	currentDirectory, _ = os.Getwd()
	configJson = filepath.Join(currentDirectory, "Config", "config.json")
	UserHomeDir, _ = os.UserHomeDir()
	AvatarsPath = filepath.Join(currentDirectory)
)

// config.jsonの値を取得する関数
func checkConfigAvatarsPath() (string, string, string) {
	file, err := os.Open(configJson)
	if err != nil {
		fmt.Println("設定ファイルが見つかりませんでした:", err)
	}
	defer file.Close()

	var config Config
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		fmt.Println("設定ファイルの読み込みに失敗しました:", err)
	}

	avatarsPath := filepath.Join(config.MoveFolder, "Avatars")
	imagesPath := filepath.Join(config.MoveFolder, "Images")
	configSearchPath := config.SearchFolder

	return avatarsPath, imagesPath ,configSearchPath
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// 少しだけ最前面に表示（100ミリ秒後に解除）
	go func() {
		time.Sleep(100 * time.Millisecond) // 100ミリ秒後
		runtime.WindowSetAlwaysOnTop(a.ctx, false) // 最前面解除
	}()

	go a.MakeConfig()
	go GithubAPI(a)
	go GoServer(a)
}

func (a *App) SelectFolder(keyName string) string {
	result, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "フォルダを選択",
	})
	if err != nil {
		fmt.Println("フォルダを選択する際にエラーが発生しました: ", err)
	}

	if result == "" {
		return "Error"
	}

	file, err := os.ReadFile(configJson)
	if err != nil {
		fmt.Println("ファイルを開けませんでした:", err)
	}

	var configData map[string]interface{}
	err = json.Unmarshal(file, &configData)
	if err != nil {
		fmt.Println("JSONのデコードに失敗しました:", err)
	}

	configData[keyName] = result

	// JSONをエンコード
	newJSON, err := json.MarshalIndent(configData, "", "  ")
	if err != nil {
		fmt.Println("JSONのエンコードに失敗しました:", err)
	}

	fmt.Println("configData: ", configData)

	err = os.WriteFile(configJson, newJSON, 0644)
	if err != nil {
		fmt.Println("ファイルに書き込めませんでした:", err)
	}

	fmt.Println("検索フォルダをファイルに書き込みました。")
	return result
}

func (a *App) GetSearchFolder() string {
	file, err := os.Open(configJson)
	if err != nil {
		fmt.Println("設定ファイルが見つかりませんでした:", err)
	}
	defer file.Close()

	var config ConfigSearchFolder
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		fmt.Println("設定ファイルの読み込みに失敗しました:", err)
	}

	return config.SearchFolder
}

func (a *App) GetMoveFolder() string {
	file, err := os.Open(configJson)
	if err != nil {
		fmt.Println("設定ファイルが見つかりませんでした:", err)
	}
	defer file.Close()

	var config ConfigMoveFolder
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		fmt.Println("設定ファイルの読み込みに失敗しました:", err)
	}

	return config.MoveFolder
}

func (a *App) OpenFolder() string {
	avatarsFolderPath, _, _ := checkConfigAvatarsPath()
	info, err := os.Stat(avatarsFolderPath)
	if os.IsNotExist(err) || err != nil || !info.IsDir() {
        return "Error"
    }
	return avatarsFolderPath
}

func (a *App) MakeConfig() {
	if _, err := os.Stat("Config"); os.IsNotExist(err) {
		if err := os.Mkdir("Config", 0750); err != nil {
			return
		}
	}
	if _, err := os.Stat(configJson); os.IsNotExist(err) {
		DownloadPath := filepath.Join(UserHomeDir, "Downloads")

		initialConfig := Config{
			SearchFolder: DownloadPath,
			MoveFolder:   AvatarsPath,
		}

		file, err := os.Create(configJson)
		if err != nil {
			fmt.Println("設定ファイルを作成できませんでした: ",err)
		}
		defer file.Close()

		encoder := json.NewEncoder(file)
		encoder.SetIndent("", "  ") // 見やすいようにインデントを設定
		if err := encoder.Encode(initialConfig); err != nil {
			fmt.Printf("JSON エンコードエラー: %v\n", err)
			return
		}
	} else {
		file, err := os.ReadFile(configJson)
        if err != nil {
            fmt.Println("設定ファイルを開けませんでした:", err)
            return
        }

        var configData map[string]interface{}
        err = json.Unmarshal(file, &configData)
        if err != nil {
            fmt.Println("JSONのデコードに失敗しました:", err)
            return
        }

        // MoveFolder要素が存在しない場合は追加
        if _, ok := configData["moveFolder"]; !ok {
            configData["moveFolder"] = AvatarsPath
        }

        // JSONをエンコード
        newJSON, err := json.MarshalIndent(configData, "", "  ")
        if err != nil {
            fmt.Println("JSONのエンコードに失敗しました:", err)
            return
        }

        err = os.WriteFile(configJson, newJSON, 0644)
        if err != nil {
            fmt.Println("ファイルに書き込めませんでした:", err)
            return
        }
	}
}

func (a *App) WriteURLAndUpdate() error {
	if err := WriteDownloadURLToFile(); err != nil {
		fmt.Println("ダウンロードURLの書き込みに失敗しました:", err)
		return err
	}
	if err := ExecuteUpdater(a); err != nil {
		fmt.Println("アップデータの実行に失敗しました:", err)
		return err
	}
	return nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods