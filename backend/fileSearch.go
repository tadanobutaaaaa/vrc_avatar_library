package backend

import (
	"fmt"
	"os"
	"path/filepath"
	"os/user"
	"log"
	"encoding/json"
	"regexp"
	"strings"
)

type Data struct {
	Path string `json:"path"`
	FullPath string `json:"fullPath"`
}

func UserName() string {
	user, err := user.Current()
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
	return user.HomeDir
}

func CleanFileName(s string) string {
	re := regexp.MustCompile(`(_ver|ver|_)\d+(\.\d+)*|\.unitypackage$`)
	cleaned := re.ReplaceAllString(s, "")
	cleaned = strings.Replace(cleaned, "_", " " , -1)
	return cleaned
}

func GetFilePath(fullPath string) string {
	splitPath := strings.SplitN(fullPath, "Downloads", 2)
	afterDownloads := strings.TrimLeft(splitPath[1], string(filepath.Separator))
	folders := strings.Split(afterDownloads, string(filepath.Separator))
	return filepath.Join(splitPath[0], "Downloads", folders[0])
}

func Match() string{
	datas := []Data{}

	paths := []string{}
	fullPaths := []string{}

	userHome := UserName()
	download := filepath.Join(userHome, "Downloads")
	err := filepath.WalkDir(download, func(path string, info os.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && filepath.Ext(path) == ".unitypackage" {
			basePath := CleanFileName(filepath.Base(path))
			paths = append(paths, basePath)
			fullPaths = append(fullPaths, GetFilePath(path))
		}
		return nil

	})

	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}

	for i := 0; i < len(paths); i++ {
		data := Data{
			Path: paths[i],
			FullPath: fullPaths[i],
		}
		datas = append(datas, data)
	}
	
	jsonData, err := json.Marshal(datas)
	if err != nil {
		fmt.Println("JSON変換に失敗しました: ", err)
		return ""
	}
	return string(jsonData)
}