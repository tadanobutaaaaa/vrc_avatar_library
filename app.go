package main

import (
	"context"
	"vrc_avater_library/backend"
	//"fmt"
)

// App struct
type App struct {
	ctx context.Context
	BrowserName string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) FileManager() {
	// fmt.Println(apiName, "app.goからの送信です")
	backend.PostServer()
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods