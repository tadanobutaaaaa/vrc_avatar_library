import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function useWebSocket(page, status = true, onMessage = null, onHandle = null) {
    const navigate = useNavigate()

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws")

        socket.onopen = () => {
            console.log("WebSocket接続が確立されました");
        }

        socket.onmessage = (event) => {
            console.log("受信メッセージ:", event.data)
            try {
                const data = JSON.parse(event.data)
                console.log("Parsed data:", data)

                if (!('status' in data) || !('count' in data) || !('processedCount' in data)) {
                    console.warn("必要なデータが不足しています:", data)
                    return
                }

                if (data.status === status) {
                    socket.close()
                    navigate(page)
                } else if (status === false) {
                    const count = Number(data.count)
                    const processedCount = Number(data.processedCount)
                    
                    console.log("処理済みの数:", processedCount)
                    console.log("全体の数:", count)
                    
                    if (!isNaN(count) && count !== 0) {
                        const percentage = Math.floor((processedCount / count) * 100)
                        console.log("計算されたパーセンテージ:", percentage)
                        if (onMessage && typeof onMessage === 'function') {
                            onMessage(percentage)
                        }
                        if (onHandle && typeof onHandle === 'function') {
                            onHandle(count - processedCount)
                        }
                    } else {
                        console.log("パーセンテージを0に設定")
                        if (onMessage && typeof onMessage === 'function') {
                            onMessage(0)
                        }
                        if (onHandle && typeof onHandle === 'function') {
                            onHandle(0)
                        }
                    }
                }
            } catch (e) {
                console.error("メッセージ解析エラー:", e)
            }
        }

        socket.onerror = (error) => {
            console.error("WebSocketエラー:", error)
        }

        socket.onclose = (event) => {
            console.log("WebSocket接続が閉じられました:", event)
        }

        return () => {
            socket.close()
        }
    }, [])
}

export default useWebSocket