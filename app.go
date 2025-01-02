package main

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"fmt"
	"context"
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
	GoServer()
}
func (a *App) SelectFolder() {
	result, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "フォルダを選択",
	})
	if err != nil {
		fmt.Println("フォルダを選択する際にエラーが発生しました: ",err)
	}	
	fmt.Println(result)
}
// startup is called when the app starts. The context is saved
// so we can call the runtime methods