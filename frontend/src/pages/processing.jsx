import React, { useState } from 'react';
import useWebSocket from '../hooks/goWebSocket';
import Header from '../components/Header';
import { Center, HStack } from "@chakra-ui/react";
import { ProgressBar, ProgressRoot, ProgressLabel, ProgressValueText } from "@/components/ui/progress"


function Processing(){
    const [processedCount, setProcessedCount] = useState(0)

    const handleMessage = (percentage) => {
        setProcessedCount(percentage)
    }

    useWebSocket("/result", false, handleMessage)

    return (
        <>
            <Header status={true} />
            <Center h="600px">
                <ProgressRoot w="300px" value={processedCount} animated>
                    <ProgressLabel info="フォルダにサムネイルを付与しています" mb="2">
                        処理中...
                    </ProgressLabel>
                    <HStack gap="5">
                        <ProgressBar flex="1" />
                        <ProgressValueText>{processedCount}%</ProgressValueText>
                    </HStack>
                </ProgressRoot>
            </Center>
        </>
    );
}

export default Processing