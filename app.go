package main

import (
	"context"
	"time"
	"os"
	"github.com/joho/godotenv"
	"fmt"
	"os/exec"
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
// startup is called when the app starts. The context is saved
// so we can call the runtime methods