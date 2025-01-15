package main

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"os"
	"fmt"
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

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	if _, err := os.Stat("Config"); os.IsNotExist(err) {
		if err := os.Mkdir("Config", 0750); err != nil {
			return
		}
	}
	if _, err := os.Stat("./Config/config.json"); os.IsNotExist(err) {
		home, err := os.UserHomeDir()
		if (err != nil) {
			fmt.Println("ユーザーホームディレクトリを取得できませんでした: ",err)
		}
		DownloadPath := filepath.Join(home, "Downloads")

		initialConfig := Config{
			SearchFolder: DownloadPath,
		}

		file, err := os.Create("./Config/config.json")
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
	a.ctx = ctx
	GoServer()
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

	file, err := os.Create("./Config/config.json")
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

// 新しい関数を追加
func (a *App) GetSearchFolder() string {
	file, err := os.Open("./Config/config.json")
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

// startup is called when the app starts. The context is saved
// so we can call the runtime methods