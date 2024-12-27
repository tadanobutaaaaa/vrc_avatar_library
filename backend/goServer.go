package main

import (
	//"github.com/gin-contrib/cors"
	"bytes"

	"github.com/gin-gonic/gin"
	//"github.com/PuerkitoBio/goquery"

	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type Root map[string][]map[string]Booth

type Booth struct {
    Id   string `json:"id"`
    Src  string `json:"src"`
}

func main() {
    r := gin.Default()

    if _, err := os.Stat("Avaters"); os.IsNotExist(err) {
        os.Mkdir("Avaters", 0750)
    }
    if _, err := os.Stat("Images"); os.IsNotExist(err) {
        os.Mkdir("Images", 0750)
    }

    home, err := os.UserHomeDir()
    if err != nil {
        log.Fatal(err)
    }
    DownloadPath := filepath.Join(home, "Downloads")
    currentPath, _ := os.Getwd()
    currentAvatersPath := filepath.Join(currentPath, "Avaters")
    currentImagesPath := filepath.Join(currentPath, "Images")

    fmt.Println("CurrentPath: ", currentPath)
    fmt.Println("DownloadPath: ", DownloadPath)
    /*
    r.Use(cors.New(cors.Config{
        AllowOrigins: []string{
            //plasmo(Google拡張機能)からのみリクエストを受け付けれるようにする
            //どのurlからリクエストを送るか特定する
            //例 "https://example.com"
        },
        AllowMethods: []string{
            "POST",
        },
    }))
    */

    r.POST("/send/fileImages", func(c *gin.Context) {
        //保存する用のフォルダがない場合、フォルダを作成する
        

        var jsonData Root

        if err := c.ShouldBindJSON(&jsonData); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{
                "error": err.Error(),
            })
            return
        }

        

        entries, err := os.ReadDir(DownloadPath)
        if err != nil {
            log.Fatal(err)
        }
        
        for _, entry := range entries {
            for key := range jsonData {
                for _, jsonEntry := range jsonData[key] {
                    for name, booth := range jsonEntry {
                        if entry.IsDir() && strings.Contains(name, entry.Name()) {
                            //サムネイル画像が保存されているフォルダがあるか確認する
                            isThumbnailFoldar := filepath.Join(currentImagesPath, booth.Id)
                            _, err := os.Stat(isThumbnailFoldar)

                            //サムネイル画像が存在しない場合は、ダウンロードする
                            if err != nil {
                                inAvatersFolder := filepath.Join(currentAvatersPath, booth.Id)
                                os.Mkdir(inAvatersFolder, 0750)

                                url := booth.Src
                                resp, err := http.Get(url)
                                if err != nil {
                                    fmt.Println("上手くダウンロードができませんでした")
                                    return
                                }
                                defer resp.Body.Close()

                                var buffer bytes.Buffer
                                buffer.ReadFrom(resp.Body)

                                data1 := bytes.NewReader(buffer.Bytes())
                                data2 := bytes.NewReader(buffer.Bytes())

                                jpgThumbnail := filepath.Join(currentImagesPath, booth.Id + ".jpg")
                                out, err := os.Create(jpgThumbnail)
                                if err != nil {
                                    fmt.Println("上手く保存ができませんでした")
                                    return
                                }
                                defer out.Close()

                                icoThumbnail := filepath.Join(inAvatersFolder, booth.Id + ".ico")
                                out2, err := os.Create(icoThumbnail)
                                if err != nil {
                                    fmt.Println("上手く保存ができませんでした")
                                    return
                                }
                                defer out2.Close()

                                io.Copy(out, data1)
                                io.Copy(out2, data2)
                                fmt.Printf("名前: %s, ID: %s, SRC: %s\n", name, booth.Id, booth.Src)

                                //アバター画像が保存されているフォルダがあるか確認する
                            }
                        }
                    }
                }
            }
        }

        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{
                "error": err.Error(),
            })
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "response": jsonData,
        })
    })

    r.Run()
}