import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import { SelectFolder, GetFolder, WriteJsonFile } from '../../wailsjs/go/main/App';
import { FolderSearch, Folder, Search } from 'lucide-react';
import { IconButton, Flex, Text, Box } from "@chakra-ui/react"; 
import { useColorModeValue } from "@/components/ui/color-mode"
import goWebSocket from "../hooks/goWebSocket";


function SetupProcess() {
    goWebSocket("/processing")

    const [searchFolder, setSearchFolder] = useState("")
    const [moveFolder, setMoveFolder] = useState("")

    const bgColor = useColorModeValue("gray.100", "gray.400")

    useEffect(() => {
        const writeJsonSearchFolder = async () => {
            await GetFolder("searchFolder").then((res) => {
                setSearchFolder(res)
            })
        }
        const writeJsonMoveFolder = async () => {
            await GetFolder("moveFolder").then((res) => {
                setMoveFolder(res)
            })
        }
        writeJsonMoveFolder()
        writeJsonSearchFolder()
    }, [])

    const SelectFolderProcess = () => {
        SelectFolder("searchFolder").then((res) => {
            if (res !== "Error") {
                setSearchFolder(res)
            }
        })
    }

    const SelectMoveFolderProcess = () => {
        SelectFolder("moveFolder").then((res) => {
            if (res !== "Error") {
                setMoveFolder(res)
            }
        })
    }

    const handleCheckedChange = (checked) => {
        WriteJsonFile("isShopFolder", checked)
        setIsChecked(checked)
    }

    return (
        <>
            <Header />
            <Box ml="50px" mt="50px">
                <Box background="#c0c0c0" w="85%" p="20px" borderRadius="md">
                    <Flex alignItems="center" gap="6px" mb="5px">
                        <Search />
                        <Text textStyle="2xl" fontWeight="bold">検索フォルダ</Text>
                    </Flex>
                    <Flex gap="4px" alignItems="center">
                        <Flex maxW="800px">
                            <Text 
                                textStyle="md" 
                                bgColor={bgColor}
                                borderRadius="sm"
                                py="3px"
                                px="6px"
                                truncate>{searchFolder}</Text>
                        </Flex>
                        <IconButton 
                            onClick={() => {SelectFolderProcess()}}
                            variant="ghost"
                            aria-label='Toggle color mode'
                            >
                            <FolderSearch />
                        </IconButton>
                    </Flex>
                    <Text fontWeight="semibold" mt="5px">Boothでダウンロードした商品が入っているフォルダを選択してください</Text>
                </Box>
            </Box>
            <Box ml="50px" mt="30px">
                <Box background="#c0c0c0" w="85%" p="20px" borderRadius="md">
                    <Flex alignItems="center" gap="6px" mb="5px">
                        <Folder />
                        <Text textStyle="2xl" fontWeight="bold">保存先のフォルダ</Text>
                    </Flex>
                    <Flex gap="4px" alignItems="center">
                        <Flex maxW="800px">
                            <Text 
                                textStyle="md" 
                                bgColor={bgColor}
                                borderRadius="sm"
                                py="3px"
                                px="6px"
                                truncate>{moveFolder}</Text>
                        </Flex>
                        <IconButton 
                            onClick={() => {SelectMoveFolderProcess()}}
                            variant="ghost"
                            aria-label='Toggle color mode'
                            >
                            <FolderSearch />
                        </IconButton>
                    </Flex>
                    <Text fontWeight="semibold" mt="5px">
                        「検索フォルダ」と同じドライブを選択してください。<br/>
                        <Text as="span" color="red.600">O</Text> Cドライブ → Cドライブ, Dドライブ → Dドライブ <br />
                        <Text as="span" color="red.600">X</Text> Cドライブ → Dドライブ
                    </Text>
                    <Text fontWeight="semibold" color="red.600" mt="4px">
                        ※このシステムでは、ドライブをまたいでの移動ができません。
                    </Text>
                </Box>
            </Box>
        </>
    )
}
export default SetupProcess