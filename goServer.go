package main

import (
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
	"time"

	ico "github.com/Kodeworks/golang-image-ico"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"golang.org/x/image/draw"
	"gopkg.in/ini.v1"
)

type Root map[string][]map[string]Booth

type Booth struct {
	Id   string `json:"id"`
	Src  string `json:"src"`
}

type Setting struct {
	SearchFolder string `json:"searchFolder"`
}

var (
	mutex   sync.Mutex
	clients = make(map[*websocket.Conn]bool)
)

func sendWebsocket(status bool, complement int, processedCount int) {
	isProcessing := map[string]interface{}{"status": status, "count": complement, "processedCount": processedCount}
	jsonMessage, err := json.Marshal(isProcessing)
	if err != nil {
		log.Println("Error marshalling message:", err)
	} else {
		mutex.Lock()
		for client := range clients {
			if err := client.WriteMessage(websocket.TextMessage, jsonMessage); err != nil {
				log.Println("Error writing message:", err)
				client.Close()
				delete(clients, client)
			}
		}
		mutex.Unlock()
	}
}

//TODO: アップデートの実装をどうにかする

func GoServer() {
	r := gin.Default()
	r.SetTrustedProxies(nil)

	wsupgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			// すべてのオリジンを許可
			return true
		},
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"https://accounts.booth.pm",
			"http://wails.localhost",
			"http://wails.localhost:34115",
		},
		AllowMethods: []string{
			"POST",
			"OPTIONS",
			"GET",
		},
		AllowHeaders: []string{
			"Content-Type",
		},
		AllowOriginFunc: func(origin string) bool {
			return origin == "chrome-extension://hdfbpdpcecklifkgfdjegflfigfmjfib"
		},
	}))

	count := 0
	processedCount := 0

	r.GET("/ws", func(c *gin.Context) {
		ws, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Println(err)
			return
		}

		defer ws.Close()

		mutex.Lock()
		clients[ws] = true
		mutex.Unlock()

		for {
			_, _, err := ws.ReadMessage()
			if err != nil {
				mutex.Lock()
				delete(clients, ws)
				mutex.Unlock()
				break
			}
		}
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": true,
		})
	})

	r.POST("/send/fileImages", func(c *gin.Context) {
		var jsonData Root

        if err := c.ShouldBindJSON(&jsonData); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{
                "error": err.Error(),
            })
            return
        }
		
		file, err := os.Open(configJson)
		if err != nil {
			fmt.Println("設定ファイルが見つかりませんでした:", err)
		}
		defer file.Close()

		var config Setting
		decoder := json.NewDecoder(file)
		if err := decoder.Decode(&config); err != nil {
			fmt.Println("設定ファイルの読み込みに失敗しました:", err)
		}

		searchFolder := config.SearchFolder
		entries, err := os.ReadDir(searchFolder)

		 // 条件に合うエントリの件数をカウント
		for _, entry := range entries {
			for key := range jsonData {
				for _, jsonEntry := range jsonData[key] {
					for name := range jsonEntry {
						if entry.IsDir() && strings.Contains(name, entry.Name()) {
							count++
						}
					}
				}
			}
		}

		sendWebsocket(true, count, 0)
	
		//FIXME: サムネイル付与時間の修正(反映まで時間がかかる)

		for _, entry := range entries {
			for key := range jsonData {
				for _, jsonEntry := range jsonData[key] {
					for name, booth := range jsonEntry {
						if entry.IsDir() && strings.Contains(name, entry.Name()) {
							//サムネイル画像が保存されているフォルダがあるか確認する
							inAvatarsFolder := filepath.Join(AvatarsPath, booth.Id)
							if _, err := os.Stat(filepath.Join(inAvatarsFolder, entry.Name())); err == nil {
								// フォルダが既に存在する場合は処理を飛ばす
								processedCount++
								continue
							}

							if _, err := os.Stat(inAvatarsFolder); os.IsNotExist(err) {
								os.Mkdir(inAvatarsFolder, 0750)

								url := booth.Src
								resp, err := http.Get(url)
								if err != nil {
									return
								}
								defer resp.Body.Close()

								//サムネイル画像を保存する
								jpgThumbnail := filepath.Join(ImagesPath, booth.Id+".jpg")

								out, err := os.Create(jpgThumbnail)
								if err != nil {
									return
								}
								defer out.Close()
								io.Copy(out, resp.Body)

								icoThumbnail := filepath.Join(AvatarsPath, booth.Id)
								icoThumbnail = filepath.Join(icoThumbnail, booth.Id+".ico")

								//icoファイルを作成する
								file, err := os.Open(jpgThumbnail)
								if err != nil {
									return
								}
								defer file.Close()

								img, _, err := image.Decode(file)
								if err != nil {
									return
								}

								resizedImg := image.NewRGBA(image.Rect(0, 0, 256, 256))
								draw.NearestNeighbor.Scale(resizedImg, resizedImg.Bounds(), img, img.Bounds(), draw.Over, nil)

								icoFile, err := os.Create(icoThumbnail)
								if err != nil {
									return
								}

								err = ico.Encode(icoFile, resizedImg)
								if err != nil {
									return
								}

								//iniファイルに書き込む
								desktopIniPath := filepath.Join(inAvatarsFolder, "desktop.ini")

								cfg := ini.Empty()
								cfg.Section(".ShellClassInfo").Key("IconResource").SetValue(fmt.Sprintf("\"%s.ico\",0", booth.Id))
								if err := cfg.SaveTo(desktopIniPath); err != nil {
									return
								}

								cmd := exec.Command("attrib", "+h", desktopIniPath)
								cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
								if err := cmd.Run(); err != nil {
									return
								}

								cmd = exec.Command("attrib", "+s", inAvatarsFolder)
								cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
								if err := cmd.Run(); err != nil {
									return
								}

								cmd = exec.Command("attrib", "+h", icoThumbnail)
								cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
								if err := cmd.Run(); err != nil {
									return
								}
							}

							if err := os.Rename(filepath.Join(searchFolder, entry.Name()), filepath.Join(inAvatarsFolder, entry.Name())); err != nil {
								return
							}

							//サーバーへの負荷対策
							processedCount++
							sendWebsocket(true, count, processedCount)

							time.Sleep(1 * time.Second)
						}
					}
				}
			}
		}

		time.Sleep(1 * time.Second)
		sendWebsocket(false, count, count)
		
		count = 0
		processedCount = 0

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
	})

	r.Run(":8080")
}