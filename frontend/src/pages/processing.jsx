import React, { useState } from 'react';
import Header from '../components/Header';
import useWebSocket from '../hooks/goWebSocket';
import { Center, HStack, Text, Flex } from "@chakra-ui/react";
import { ProgressBar, ProgressRoot, ProgressLabel, ProgressValueText } from "@/components/ui/progress"

function Processing(){
    const [processedPercent, setProcessedPercent] = useState(0)
    const [unProcessedCount, setUnProcessedCount] = useState(0)

    const handleMessage = (percentage) => {
        setProcessedPercent(percentage)
    }

    const handle = (count) => {
        setUnProcessedCount(count)
    }

    useWebSocket("/result", false, handleMessage, handle)

    return (
        <>
            <Header status={true} />
            <Center h="600px">
                <ProgressRoot w="300px" value={processedPercent} animated>
                    <ProgressLabel info="フォルダにサムネイルを付与しています" mb="2">
                        処理中...
                    </ProgressLabel>
                    <HStack gap="5">
                        <ProgressBar flex="1" />
                        <ProgressValueText>{processedPercent}%</ProgressValueText>
                    </HStack>
                    <Flex justify="flex-end" mr="39px" mt="6px">
                        <Text mr="4px">残り個数:</Text>
                        <Text><strong>{unProcessedCount}</strong></Text>
                        <Text>個</Text>
                    </Flex> 
                </ProgressRoot>
            </Center>
        </>
    );
}

export default Processing