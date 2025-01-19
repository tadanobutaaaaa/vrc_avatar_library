import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function goWebSocket(page, status = true) {
    const navigate = useNavigate()

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws")

        socket.onopen = () => {
            console.log("WebSocket接続が確立されました");
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)
            if (data.status === status) {
                socket.close()
                navigate(page)
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

export default goWebSocket