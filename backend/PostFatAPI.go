package backend

import (
	//"bytes"
	"fmt"
	//"net/http"
	//"io"
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
	/*
	url := "http://127.0.0.1:8000/" + apiName //指定されたブラウザによって変える

	data := Match()
	var jsonData = []byte(data)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}
	req.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	fmt.Println("response Status:", res.Status)
	fmt.Println("response Headers:", res.Header)
	body, _ := io.ReadAll(res.Body)
	fmt.Println("response Body", string(body))
	err = cmd.Wait()
	if err != nil{
		fmt.Println("サーバーの実行中にエラーが発生しました:", err)
	}
	
	return string(body)
	*/
}