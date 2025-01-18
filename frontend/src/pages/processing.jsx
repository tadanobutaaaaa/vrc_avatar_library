import React, { useEffect } from 'react';
import Header from '../components/Header';
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ProgressBar, ProgressRoot, ProgressLabel } from "@/components/ui/progress"

function Processing(){
    const navigate = useNavigate()

    useEffect(() => {
            const socket = new WebSocket("ws://localhost:8080/ws")
    
            socket.onopen = () => {
                console.log("WebSocket接続が確立されました")
            }
    
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log(data)
                if (data.status === false) {
                    socket.close()
                    navigate("/result")
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

    return (
        <>
            <Header />
            <Center h="600px">
                <ProgressRoot w="300px" value={null}>
                    <ProgressLabel info="フォルダにサムネイルを付与しています" mb="2">
                        処理中...
                    </ProgressLabel>
                    <ProgressBar />
                </ProgressRoot>
            </Center>
            
        </>
    );
}

export default Processing