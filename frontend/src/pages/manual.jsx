import React from 'react';
import Header from '../components/Header';

import { FaXTwitter, FaGithub } from "react-icons/fa6";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";
import { Card, Image, Center, Flex, Box, IconButton, Icon } from "@chakra-ui/react"; 

function App() {

    const QiitaIcon = () => {
        return(
            <Icon>
                <Image src="/svg/qiita-icon.svg" boxSize="22px" />
            </Icon>
        )
    }

    const BoothIcon = () => {
        return(
            <Icon>
                <Image src="/svg/booth-icon.svg" boxSize="22px" />
            </Icon>
        )
    }

    return (
        <>
            <Header />
            <Center mt="50px">
                <Card.Root >
                    <Card.Body>
                        <Flex justifyContent="center">
                            <Box>
                                <Image 
                                    src="/images/icon.jpg" 
                                    boxSize="260px"
                                    borderRadius="full"
                                    border="1px solid gray"
                                    mt="20px"
                                />
                                <Card.Title mt="10px">ただのぶたぁ(tadanobutaaaaa)</Card.Title>
                                    <Center mt="5px">
                                        <IconButton
                                            onClick={() => {BrowserOpenURL("https://x.com/P_tdn2")}}
                                            variant="ghost"
                                            aria-label='Open X(Twitter)'
                                        >
                                            <FaXTwitter />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {BrowserOpenURL("https://github.com/tadanobutaaaaa")}}
                                            variant="ghost"
                                            aria-label='Open GitHub'
                                        >
                                            <FaGithub />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {BrowserOpenURL("https://qiita.com/tadanobutaaaaa")}}
                                            variant="ghost"
                                            aria-label='Open Qiita'
                                        >
                                            <QiitaIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {BrowserOpenURL("https://tadanobutaaaaa.booth.pm/")}}
                                            variant="ghost"
                                            aria-label='Open Booth'
                                        >
                                            <BoothIcon />
                                        </IconButton>
                                    </Center>                            
                                </Box>
                            <Center>
                                <Card.Description ml="30px" mt="10px">
                                    プログラミングとVRChatが好きなただの学生です。<br />
                                    去年からプログラミングの学習を本格化し、<br />
                                    8月からこのツールの開発を進めてきました。<br />
                                    初の個人開発ということで、長い期間を要し<br />
                                    なんとかして完成させることができました。<br />
                                    <br />
                                    このツールは、パソコンのフォルダを整理することを目指し、<br />
                                    妥協せずに詰めたい要素を盛り込んでいます。<br />
                                    開発中にはたくさんのエラーや壁に直面しましたが<br />
                                    その都度解決方法を学び、成長できたと感じています。<br />
                                    <br />
                                    今後もVRChatをはじめ、さまざまな形で貢献できるよう、<br />
                                    新しいコンテンツ作りに挑戦していきます。<br />
                                    最後に、デバックを手伝ってくださった方々、<br />
                                    応援してくださった皆様に心より感謝申し上げます。<br />
                                    <br />
                                    <strong>2025/01/16</strong>
                                </Card.Description>
                            </Center>
                        </Flex>
                    </Card.Body>
                </Card.Root>
            </Center>
        </>
    );
}

export default App
