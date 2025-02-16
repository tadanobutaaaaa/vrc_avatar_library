package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	currentVersion = "v1.1.1" // 現在のバージョン
	repoOwner      = "tadanobutaaaaa" // リポジトリのオーナー
	repoName       = "vrc_avatar_library" // リポジトリの名前
)

type Release struct {
	TagName string `json:"tag_name"`
	Assets  []struct {
		Name string `json:"name"`
		URL  string `json:"browser_download_url"`
	} `json:"assets"`
	HtmlURL string `json:"html_url"`
}

var downloadURL string

func GithubAPI(a *App) {
	latestRelease, err := getLatestRelease()
	if (err != nil) {
		fmt.Println("エラー:", err)
		return
	}

	latestVersion := strings.TrimPrefix(latestRelease.TagName, "v")
	current := strings.TrimPrefix(currentVersion, "v")

	if latestVersion != current {
		fmt.Println("新しいバージョンを見つけました:", latestVersion)

		if len(latestRelease.Assets) == 0 {
			fmt.Println("アセットが存在しません。")
			return
		}

		for _, asset := range latestRelease.Assets {
			if asset.Name == "VRC-Avatar-Library.exe" {
				downloadURL = asset.URL
				break
			}
		}

		if downloadURL == "" {
			fmt.Println("目的のアセットが見つかりませんでした。")
			return
		}

		data := map[string]interface{}{
			"version": latestVersion,
			"url":     latestRelease.HtmlURL,
		}

		time.Sleep(1 * time.Second)
		runtime.EventsEmit(a.ctx, "updateAvailable", data)
	} else {
		fmt.Println("アプリは最新です。")
	}
}

func getLatestRelease() (*Release, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/latest", repoOwner, repoName)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var release Release
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		return nil, err
	}
	return &release, nil
}

func WriteDownloadURLToFile() error {
	file, err := os.ReadFile(configJson)
	if err != nil {
		fmt.Println("ファイルを開けませんでした:", err)
		return err
	}

	var configData map[string]interface{}
	err = json.Unmarshal(file, &configData)
	if err != nil {
		fmt.Println("JSONのデコードに失敗しました:", err)
		return nil
	}

	configData["downloadUrl"] = downloadURL

	// JSONをエンコード
	newJSON, err := json.MarshalIndent(configData, "", "  ")
	if err != nil {
		fmt.Println("JSONのエンコードに失敗しました:", err)
		return err
	}

	fmt.Println("configData: ", configData)

	err = os.WriteFile(configJson, newJSON, 0644)
	if err != nil {
		fmt.Println("ファイルに書き込めませんでした:", err)
		return nil
	}

	fmt.Println("ダウンロードURLをファイルに書き込みました。")
	return nil
}

func ExecuteUpdater(a *App) error {
	updaterPath := filepath.Join(currentDirectory, "vrc_avatar_library_updater.exe")
	cmd := exec.Command(updaterPath)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: false}
	err := cmd.Start()
	if err != nil {
		fmt.Println("アップデータの実行に失敗しました:", err)
		return err
	}
	fmt.Println("アップデータを実行しました。")
	os.Exit(0)
	return nil
}	