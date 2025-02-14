import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import { SelectFolder, GetSearchFolder, SelectMoveFolder, GetMoveFolder } from '../../wailsjs/go/main/App';
import { FolderSearch, Folder } from 'lucide-react';
import { IconButton, Flex, Text, Box } from "@chakra-ui/react"; 
import { Search } from 'lucide-react';
import { useColorModeValue } from "@/components/ui/color-mode"
import goWebSocket from "../hooks/goWebSocket";


function SetupProcess() {
    goWebSocket("/processing")

    const [searchFolder, setSearchFolder] = useState("")
    const [moveFolder, setMoveFolder] = useState("")

    const bgColor = useColorModeValue("gray.100", "gray.400")

    useEffect(() => {
        const fetchSearchFolder = async () => {
            await GetSearchFolder().then((res) => {
                setSearchFolder(res)
            })
        }
        const fetchMoveFolder = async () => {
            await GetMoveFolder().then((res) => {
                setMoveFolder(res)
            })
        }
        fetchSearchFolder()
        fetchMoveFolder()
    }, [])

    const SelectFolderProcess = () => {
        SelectFolder().then((res) => {
            if (res !== "Error") {
                setSearchFolder(res)
            }
        })
    }

    const SelectMoveFolderProcess = () => {
        SelectMoveFolder().then((res) => {
            if (res !== "Error") {
                setMoveFolder(res)
            }
        })
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
                        <Text textStyle="2xl" fontWeight="bold">移動先のフォルダ</Text>
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
                        商品があるドライブと同じドライブを選んでください。<br/>
                        違うドライブを選ぶと、正しく移動できません。
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