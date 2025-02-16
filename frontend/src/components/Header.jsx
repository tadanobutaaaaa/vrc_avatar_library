import { Flex, HStack, Box, Heading, IconButton } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster";
import { CircleHelp, CircleUserRound, Settings, House, Folder } from 'lucide-react';
import { BrowserOpenURL, EventsOn, EventsOff } from "../../wailsjs/runtime/runtime";
import { OpenFolder } from "../../wailsjs/go/main/App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Page from './colorModeButton';
import React, { useEffect } from 'react';

function Header ({ status = false }) {
    const handleError = () => {
        toaster.create({
            title: "ドライブを跨いだ処理が開始されたためエラーが発生しました",
            description: "設定画面の「保存先のフォルダ」から設定を変更してください。",
            duration: 10000,
            type: "error",
        })
    }

    useEffect(() => {
        EventsOn("error", handleError)

        // コンポーネントがアンマウントされるときにイベントリスナーを解除
        return () => {
            EventsOff("error", handleError)
        }
    }, [])

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
        <Flex alignItems="center" justifyContent="center" bg="teal.400" p={5} position="relative">
            <Box textAlign="center">
                {
                    status ? (
                        <Heading size="2xl">VRC Avatar Library</Heading>
                    ) : (
                        <Link to="/">
                            <Heading size="2xl">VRC Avatar Library</Heading>
                        </Link>
                    )
                }
            </Box>
            <HStack position="absolute" left={5}>
                <IconButton
                    onClick={() => navigate("/") }
                    variant="ghost"
                    aria-label='Open home'
                    disabled={status}
                >
                    <House/>
                </IconButton>
            </HStack>

            <HStack position="absolute" right={5}>
                <IconButton
                    onClick={() => navigate("/manual")}
                    variant="ghost"
                    aria-label='Open self-introduction'
                    disabled={status}
                >
                    <CircleUserRound />
                </IconButton>
                <IconButton 
                    onClick={() => {BrowserOpenURL("https://docs.google.com/forms/d/e/1FAIpQLSeo5KjaIfDgXkJ_2va2N9iDJV2kmRXVwQpklYECFi0E4jHnDA/viewform")}}
                    variant="ghost"
                    aria-label='Open Google Form'
                    disabled={status}
                >
                    <CircleHelp/>
                </IconButton>
                <IconButton 
                    onClick={() => {checkAvatarsPath()}}
                    variant="ghost"
                    aria-label='Open Explorer'
                    disabled={status}
                >
                    <Folder/>
                </IconButton>
                <IconButton
                    onClick={() => navigate("/setupProcess")}
                    variant="ghost"
                    aria-label='Open settings'
                    disabled={status}
                >
                    <Settings/>
                </IconButton>
                <Page />
            </HStack>
        </Flex>
    )
}

export default Header