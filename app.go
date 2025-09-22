package main

import (
	"github.com/gocolly/colly"
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"time"
)

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
func checkConfigAvatarsPath() []string {
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

	return []string{avatarsPath, imagesPath, configSearchPath}
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

func (a* App) WriteJsonFile(keyName string, valueName interface{}) interface{} {
	file, err := os.ReadFile(configJson)
	if err != nil {
		fmt.Println("ファイルを開けませんでした:", err)
	}

	var configData map[string]interface{}
	err = json.Unmarshal(file, &configData)
	if err != nil {
		fmt.Println("JSONのデコードに失敗しました:", err)
	}

	configData[keyName] = valueName

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
	return valueName
}

func (a *App) SelectFolder(keyName string, notWrite bool) interface{} {
	result, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "フォルダを選択",
	})

	if result == "" || err != nil{
		fmt.Println("フォルダを選択する際にエラーが発生しました: ", err)
		return "Error"
	}

	if notWrite{
		return result
	}

	return a.WriteJsonFile(keyName, result)
}

func (a *App) GetFolder(keyName string) string {
    file, err := os.Open(configJson)
    if err != nil {
        fmt.Println("設定ファイルが見つかりませんでした:", err)
        return ""
    }
    defer file.Close()

    var config Config
    decoder := json.NewDecoder(file)
    if err := decoder.Decode(&config); err != nil {
        fmt.Println("設定ファイルの読み込みに失敗しました:", err)
        return ""
    }

    switch keyName {
    case "searchFolder":
        return config.SearchFolder
    case "moveFolder":
        return config.MoveFolder
    default:
        return ""
    }
}

func (a *App) OpenFolder() string {
	paths := checkConfigAvatarsPath()
	avatarsFolderPath := paths[0]
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

func (a *App) SelfProcessing(url string, name string) bool {
	pattern := `^https://([a-zA-Z0-9-]+\.)?booth\.pm(?:/ja)?/items/(\d+)$`
	re, _ := regexp.Compile(pattern)

	if !re.MatchString(url) {
		// URLが正しい形式ではない場合は処理を中断し、フロントエンド側でエラーメッセージを表示させる
		runtime.EventsEmit(a.ctx, "toaster", "error", "URLの形式が正しくありません", "正しいURLを入力してください。")
	}

	matches := re.FindStringSubmatch(url)
	boothId := matches[2]

	c := colly.NewCollector()
	var imageURL string

	c.OnError(func(_ *colly.Response, err error) {
		fmt.Println("エラーが発生しました:", err)
		//TODO: エラーメッセージをフロントエンドに送信するなどの処理を追加する
	})

	c.OnHTML("img.market-item-detail-item-image", func(e *colly.HTMLElement) {
		if imageURL == "" {  // 最初の画像のみ取得
			imageURL = e.Attr("src")
			fmt.Println("画像URL:", imageURL)
    	}
	})

	c.Visit(url)

    if imageURL == "" {
		runtime.EventsEmit(a.ctx, "toaster", "error", "画像URLが取得できませんでした", "URLが正しいか確認してください。")
        return false
    }

	//この後にスクレイピングで取得した画像URLを使って画像をダウンロードする処理を追加する
	_, avatarsPath, imagesPath := isFolder(a)
	inAvatarsFolder := filepath.Join(avatarsPath, boothId)

	if _, err := os.Stat(filepath.Join(inAvatarsFolder, filepath.Base(name))); err == nil{
		runtime.EventsEmit(a.ctx, "toaster", "warning", "ファイルが既に存在します", "")
        return false
	}

	if _, err := os.Stat(inAvatarsFolder); os.IsNotExist(err) {
		if err := os.Mkdir(inAvatarsFolder, 0750); err != nil {
			fmt.Println("ディレクトリの作成に失敗しました:", err)
			runtime.EventsEmit(a.ctx, "toaster", "error", "フォルダ作成エラー", err.Error())
            return false
		}
		//サムネイル画像を作成する
		createIcoThumbnail(imageURL, boothId, imagesPath, inAvatarsFolder)
	}
	startLocation := name
	endLocation := filepath.Join(inAvatarsFolder, filepath.Base(name))

	if err := os.Rename(startLocation, endLocation); err != nil {
		fmt.Println("ファイルの移動に失敗しました:", err)
		runtime.EventsEmit(a.ctx, "toaster", "error", "ファイルの移動に失敗しました", "")
	}
	time.Sleep(1 * time.Second)

	runtime.EventsEmit(a.ctx, "toaster", "success", "サムネイルを付与できました", "設定された保存先フォルダに保存されました。")
    return true
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods