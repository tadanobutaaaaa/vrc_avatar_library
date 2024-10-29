package main

import (
	"context"
	"vrc_avater_library/backend"
	"os"
	"github.com/joho/godotenv"
	"fmt"
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
	backend.PostServer()
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