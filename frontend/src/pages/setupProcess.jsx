import React, { useState } from "react";
import Header from '../components/Header';
import { SelectFolder } from '../../wailsjs/go/main/App';
import { FolderSearch } from 'lucide-react';
import { IconButton, Flex, Text, Box, Code } from "@chakra-ui/react"; 

function App() {
    const [searchFolder, setSearchFolder] = useState(`C:\\Users\\youya\\Downloads`)
    const SelectFolderProcess = async () => {
        SelectFolder().then((res) => {
            if (res !== "Error") {
                setSearchFolder(res)
            }
        })
    }


    return (
        <>
            <Header />
            <Box ml="50px" mt="50px">
                <Box background="#9DC8C8" w="85%" p="20px" borderRadius="md">
                    <Text textStyle="2xl" mu="10px" mb="5px" fontWeight="semibold">検索フォルダ</Text>
                    <Flex gap="6px" alignItems="center">
                        <Text>現在のフォルダ:</Text><Code>{searchFolder}</Code>
                        <IconButton 
                                onClick={() => {SelectFolderProcess()}}
                                variant="ghost"
                                aria-label='Toggle color mode'
                            >
                            <FolderSearch />
                        </IconButton>
                    </Flex>
                </Box>
            </Box>
        </>
    )
}

export default App