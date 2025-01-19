import React from 'react';
import goWebSocket from '../hooks/goWebSocket';
import Header from '../components/Header';
import { Center } from "@chakra-ui/react";
import { ProgressBar, ProgressRoot, ProgressLabel } from "@/components/ui/progress"


function Processing(){
    goWebSocket("/result", false)

    return (
        <>
            <Header status={true} />
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