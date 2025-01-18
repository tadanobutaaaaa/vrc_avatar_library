import React, { useEffect } from 'react';
import Header from '../components/Header';
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ProgressBar, ProgressRoot, ProgressLabel } from "@/components/ui/progress"

function Processing(){
    const navigate = useNavigate()

    useEffect(() => {
            const interval = setInterval(() => {
                fetch("http://localhost:8080/progress", {
                    mode: "cors",
                    method: "GET",
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data.status)
                        if (data.status === false) {
                            clearInterval(interval)
                            navigate("/result")
                            return
                        }
                    })
                    .catch((error) => {
                        console.error("処理が開始していません:", error)
                    })
            }, 2000)
            return () => clearInterval(interval)
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