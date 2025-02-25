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
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Root map[string][]map[string]Booth

type Booth struct {
	Id   string `json:"id"`
	ItemSrc string `json:"itemSrc"`
	ShopId string `json:"shopId"`
	ShopName string `json:"shopName"`
	ShopSrc string `json:"shopSrc"`
}

var (
	mutex   sync.Mutex
	clients = make(map[*websocket.Conn]bool)
)

func creatIcoThumbnail(url string, name string, jpgPath string, icoPath string) {
	if (strings.HasPrefix(url, "https://booth.pximg.net//")) {
		resp, err := http.Get(url)
		if err != nil {
			return
		}
		defer resp.Body.Close()

		//サムネイル画像を保存する
		jpgThumbnail := filepath.Join(jpgPath, name + ".jpg")

		out, err := os.Create(jpgThumbnail)
		if err != nil {
			return
		}
		defer out.Close()
		io.Copy(out, resp.Body)

		icoThumbnail := filepath.Join(icoPath, name + ".ico")
		icoName := name + ".ico"

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
		writeDesktopIni(icoPath, icoName, icoThumbnail)
	}
}

func writeDesktopIni(desktopIniFolderPath string, icoName string, icoPath string) {
	//iniファイルに書き込む
	desktopIniPath := filepath.Join(desktopIniFolderPath, "desktop.ini")

	cfg := ini.Empty()
	cfg.Section(".ShellClassInfo").Key("IconResource").SetValue(icoName + ",0")
	if err := cfg.SaveTo(desktopIniPath); err != nil {
		return
	}

	cmd := exec.Command("attrib", "+h", desktopIniPath)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Run(); err != nil {
		return
	}

	cmd = exec.Command("attrib", "+s", desktopIniFolderPath)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Run(); err != nil {
		return
	}

	cmd = exec.Command("attrib", "+h", icoPath)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Run(); err != nil {
		return
	}
}

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

func GoServer(a *App) {
	r := gin.Default()
	r.SetTrustedProxies(nil)

	wsupgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	//CORSの設定
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

	//処理をしているかの確認用 & 進捗状況を送信する
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

	//chrome拡張機能からアプリが動いているか確認する用
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"version": currentVersion,
		})
	})

	//chrome拡張機能からのリクエストを受け取る
	r.POST("/send/fileImages", func(c *gin.Context) {
		var jsonData Root

        if err := c.ShouldBindJSON(&jsonData); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{
                "error": err.Error(),
            })
            return
        }

		// 受け取ったJSONデータを出力
		jsonBytes, err := json.MarshalIndent(jsonData, "", "  ")
		if err != nil {
			log.Println("JSONのエンコードに失敗しました:", err)
		} else {
			log.Println("受け取ったJSONデータ:", string(jsonBytes))
		}

		fmt.Println("送信されたデータ:", jsonData)
		
		avatarsPath, imagesPath ,configSearchPath := checkConfigAvatarsPath()

		//Avatarsフォルダが存在しない場合は作成する
		if _, err := os.Stat(avatarsPath); os.IsNotExist(err) {
			if err := os.Mkdir(avatarsPath, 0750); err != nil {
				return
			}
		}

		imagesAvatarsPath := filepath.Join(imagesPath, "Avatars")
		imagesShopPath := filepath.Join(imagesPath, "Shop")

		//Imagesフォルダが存在しない場合は作成する
		if _, err := os.Stat(imagesPath); os.IsNotExist(err) {
			if err := os.Mkdir(imagesPath, 0750); err != nil {
				return
			}
		}
		if _, err := os.Stat(imagesAvatarsPath); os.IsNotExist(err) {
			if err := os.Mkdir(imagesAvatarsPath, 0750); err != nil {
				return
			}
			if err := os.Mkdir(imagesShopPath, 0750); err != nil {
				return
			}
		}

		//検索フォルダと移動フォルダが異なる場合は処理を中断する
		if filepath.VolumeName(configSearchPath) != filepath.VolumeName(avatarsPath) {
			fmt.Println("ドライブが異なるため、処理を中断します。")
			runtime.EventsEmit(a.ctx, "error", "Rename")
			return 
		}

		entries, err := os.ReadDir(configSearchPath)

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

		//サムネイル画像の付与
		for _, entry := range entries {
			for key := range jsonData {
				for _, jsonEntry := range jsonData[key] {
					for name, booth := range jsonEntry {
						if entry.IsDir() && strings.Contains(name, entry.Name()) {
							fmt.Println("サムネイル画像を作成しています:", entry.Name())
							//サムネイル画像が保存されているフォルダがあるか確認する
							inAvatarsShopFolder := filepath.Join(avatarsPath, booth.ShopName ,booth.Id)
							ShopFolder := filepath.Join(avatarsPath, booth.ShopName)
							if _, err := os.Stat(filepath.Join(inAvatarsShopFolder, entry.Name())); err == nil {
								// フォルダが既に存在する場合は処理を飛ばす
								processedCount++
								continue
							}

							if _, err := os.Stat(ShopFolder); os.IsNotExist(err) {
								if err := os.MkdirAll(ShopFolder, 0750); err != nil {
									log.Println("ディレクトリの作成に失敗しました:", err)
									return
								}
								//サムネイル画像を作成する
								creatIcoThumbnail(booth.ShopSrc, booth.ShopId, imagesShopPath, ShopFolder)
							}

							if _, err := os.Stat(inAvatarsShopFolder); os.IsNotExist(err) {
								if err := os.Mkdir(inAvatarsShopFolder, 0750); err != nil {
									log.Println("ディレクトリの作成に失敗しました2:", err)
									return
								}
								//サムネイル画像を作成する
								creatIcoThumbnail(booth.ItemSrc, booth.Id, imagesAvatarsPath, inAvatarsShopFolder)
							}

							if err := os.Rename(filepath.Join(configSearchPath, entry.Name()), filepath.Join(inAvatarsShopFolder, entry.Name())); err != nil {
								fmt.Println("ファイルの移動に失敗しました:", err)
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