import React from 'react';
import Header from '../components/Header';

import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { OpenFolder } from "../../wailsjs/go/main/App";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";


function Result(){
    const navigate = useNavigate()

    const checkAvatarsPath = () => {
            OpenFolder().then((res) => {
                if (res === "Error") {
                    return (
                        toaster.create({
                            title: "Avatarsフォルダが見つかりませんでした",
                            description: "Chrome拡張機能から処理を開始させてフォルダを生成してください",
                            duration: 4000,
                            type: "warning",
                        })
                    )
                } else {
                    return(
                        BrowserOpenURL(res)
                    )
                }
            })
        }

    return (
        <>
            <Header />
            <Box
                textAlign="center"
                minH="85vh"
                display="flex"
                alignItems="center"
                justifyContent="center"

            >
                <Box>
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        処理が完了しました！
                    </Heading>
                    <Text color="gray.500" mb={6}>
                        ご利用ありがとうございます。次の操作を選択してください。
                    </Text>
                    <Stack direction="row" spacing={4} justify="center">
                        <Button onClick={() => {navigate("/")}}>ホームに戻る</Button>
                        <Button onClick={() => {checkAvatarsPath()}}>フォルダを見る</Button>
                    </Stack>
                </Box>
            </Box>
        </>
    );
}

export default Result