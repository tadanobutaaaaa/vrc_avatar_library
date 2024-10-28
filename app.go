package main

import (
	"context"
	"vrc_avater_library/backend"
	"os"
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
// startup is called when the app starts. The context is saved
// so we can call the runtime methods