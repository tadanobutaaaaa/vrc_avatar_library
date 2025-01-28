package main

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"os"
	"fmt"
	"time"
	"context"
	"path/filepath"
	"encoding/json"
)

type Config struct {
	SearchFolder string `json:"searchFolder"`
}

// App struct
type App struct {
	ctx context.Context
}

var (
	currentDirectory, _ = os.Getwd()
	configJson = filepath.Join(currentDirectory, "Config", "config.json")
	UserHomeDir, _ = os.UserHomeDir()
	AvatarsPath = filepath.Join(UserHomeDir, "AppData", "Local", "VRC-Avatar-Library", "Avatars")
	ImagesPath = filepath.Join(UserHomeDir, "AppData", "Local", "VRC-Avatar-Library", "Images")
)

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// 最初にアプリを最前面に設定
	runtime.WindowSetAlwaysOnTop(a.ctx, true)

	// 少しだけ最前面に表示（例えば100ミリ秒後に解除）
	go func() {
		time.Sleep(100 * time.Millisecond) // 100ミリ秒後
		runtime.WindowSetAlwaysOnTop(a.ctx, false) // 最前面解除
	}()

	go a.MakeConfig()
	go GithubAPI(a)
	go GoServer()
}

func (a *App) SelectFolder() string {
	result, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "フォルダを選択",
	})
	if err != nil {
		fmt.Println("フォルダを選択する際にエラーが発生しました: ",err)
	}	

	if result == "" {
		return "Error"
	}

	initialConfig := Config{
		SearchFolder: result,
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
	}

	fmt.Println(result)
	return result
}

func (a *App) GetSearchFolder() string {
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

	return config.SearchFolder
}

func (a *App) OpenFolder() string {
	info, err := os.Stat(AvatarsPath)
	if os.IsNotExist(err) || err != nil || !info.IsDir() {
        return "Error"
    }
	return AvatarsPath
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