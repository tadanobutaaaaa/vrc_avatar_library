package backend

import (
	"fmt"
	"os/exec"
	"os"
	"time"
)

func PostServer() {
	fmt.Println("正常にPostFastAPI.goが動作しました")
	cmd := exec.Command("uvicorn", "main:app", "--reload")
	cmd.Stderr = os.Stderr
	err := cmd.Start()
	if err != nil {
		fmt.Println("コマンドの開始中にエラーが発生しました:", err)
	}

	time.Sleep(3 * time.Second)
	fmt.Println("FastAPIのサーバーが起動しました。")
}