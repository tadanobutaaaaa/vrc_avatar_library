package main

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"time"
	"io"
	"github.com/joho/godotenv"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) FileManager() {
	fmt.Println("正常にPostFastAPI.goが動作しました")
	cmd := exec.Command("./main.exe")
	cmd.Stderr = os.Stderr
	err := cmd.Start()
	if err != nil {
		fmt.Println("コマンドの開始中にエラーが発生しました:", err)
	}

	time.Sleep(3 * time.Second)
	fmt.Println("FastAPIのサーバーが起動しました。")
}

func (a *App) WriteEnv(APIkey string) {
	os.WriteFile(".env", []byte("GOOGLE_API_KEY=" + APIkey), 0664)
}

func (a *App) SearchAPIkey() bool {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Printf("読み込みできませんでした: %v", err)
		return false
	}
	env := os.Getenv("GOOGLE_API_KEY")
	APIkeyExists := env != ""
	fmt.Println(APIkeyExists)
	return true
}

func (a *App) ShutdownFastAPI() {
	url := "http://localhost:8000/shutdown"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer([]byte{}))
	if err != nil {
		fmt.Println(nil)
		return
	}
	req.Header.Set("Content-Type", "application/json; charset=UTF-8")
    client := &http.Client{}
    res, err := client.Do(req)
    if err != nil {
        fmt.Println("リクエスト送信中にエラー:", err)
        return
    }
    defer res.Body.Close()

    body, err := io.ReadAll(res.Body)
    if err != nil {
        fmt.Println("レスポンスボディ読み込み中にエラー:", err)
        return
    }

    fmt.Println("response Status:", res.Status)
    fmt.Println("response Body:", string(body))
}
// startup is called when the app starts. The context is saved
// so we can call the runtime methods