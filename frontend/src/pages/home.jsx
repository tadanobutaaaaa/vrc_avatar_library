import React from 'react';
import { BookText, Settings, Folder, CircleHelp } from 'lucide-react';
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";
import { Heading, Center, Box, Text, Image, Link, Flex, Icon }from "@chakra-ui/react";
import Header from '../components/Header';
import { Alert } from "@/components/ui/alert"
import goWebSocket from '../hooks/goWebSocket';


function Home(){
    goWebSocket("/processing")

    //TODO:デザインの修正

    return (
        <>
            <Header />
            <Center mt="20px">
                <BookText size="40px"/>
                <Heading size="4xl" ml="5px">使い方</Heading>
            </Center>
            <Flex mt="30px" mb="50px" gap="40px" justifyContent="flex-start" flexDirection="column">
            <Box>
                <Center>
                    <Heading>1.Chrome拡張機能をインストールする</Heading>
                </Center>
                <Flex ml="100px" mt="15px">
                    <Image 
                        src="/images/chromeExtension.png"
                        h="230px"
                        borderWidth="1px"
                        borderColor="gray.300"
                        borderStyle="solid"
                        borderRadius="md"
                    ></Image>
                    <Center>
                        <Text ml="15px">
                        <Link 
                            onClick={() => {BrowserOpenURL("https://chromewebstore.google.com/detail/vrc-avatar-library/fhjadoafaejfgjcpafnoaopkpbbjganm?authuser=0&hl=ja")}}
                            variant="underline"
                            colorPalette={"blue"}
                            _hover={{ color: "teal" }}
                            fontWeight="bold"
                        >Chromeウェブストア</Link>
                        にアクセスし、右上の「Chromeに追加」ボタン<br />
                        をクリックしてインストールしてください。<br />
                        <br />
                        対応ブラウザは<strong>Google Chrome</strong>はもちろんのこと、<br />
                        <strong>Microsoft Edge</strong>、<strong>Brave</strong>などのChromium系でも使用可能です。<br />
                        <br />
                        <strong>※Firefoxには対応していませんのでご注意ください。</strong>
                        </Text>
                    </Center>
                </Flex>
            </Box>
                <Box>
                    <Center>
                        <Heading>2.検索フォルダの設定を確認する</Heading>
                    </Center>
                    <Flex ml="100px" mt="15px">
                        <Image
                            src="/images/settingFolderPath.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
                        <Center ml="15px">
                            <Text>
                            アプリの右上の<Icon ml="3px" mb="4px" mr="1px" fontSize="20px"><Settings /></Icon>設定アイコンからBoothで買った商品が<br />
                            保存されるフォルダを指定してください。<br />
                            <br />
                            初期設定ではダウンロードフォルダが設定されています。<br />
                            <strong>この設定が正しくないとプログラムが動かないのでご注意ください。</strong>
                            </Text>
                        </Center>
                    </Flex>
                    <Center mt="15px">
                        <Alert title="以下に該当する場合は処理から外れます。" status="error" w="70%">
                            <Box as="ul" listStyleType="circle">
                                <li>解凍してないフォルダ(.zipファイル)の状態のまま処理を開始した</li>
                                <li>パソコンに存在するフォルダのバージョンとBoothのライブラリのバージョンが一致しない</li>
                            </Box>
                        </Alert>
                    </Center>
                    
                </Box>
                <Box>
                    <Center>
                        <Heading>3.Boothのライブラリページに移動する</Heading>
                    </Center>
                    <Flex ml="100px" mt="15px">
                        <Image
                            src="/images/boothLibrary.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
                        <Center>
                            <Text ml="15px">
                                まず、
                                <Link
                                    onClick={() => {BrowserOpenURL("https://accounts.booth.pm/library")}}
                                    variant="underline"
                                    colorPalette={"blue"}
                                    _hover={{ color: "teal" }}
                                    fontWeight="bold"
                                >Booth</Link>にアクセスしてください。<br />   
                                サムネイルを付与したい商品を選択し、「処理開始」ボタン <br />
                                を押してください。<br />
                                <br />
                                <strong>最初は全てにチェックを付けたままの状態で処理を開始することを<br />
                                おすすめします。</strong> <br />
                                <br />
                                <strong>※このようなボタンがない場合は拡張機能がダウンロードされているか<br />
                                再度ご確認ください。</strong>
                            </Text>
                        </Center>
                    </Flex>
                </Box>
                <Box>
                    <Center>
                        <Heading>4.フォルダにサムネイルがついているかの確認</Heading>
                    </Center>
                    <Flex ml="100px" mt="15px">
                        <Image
                            src="/images/folderSize.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
                        <Center ml="15px">
                            <Text>
                            アプリの右上の<Icon ml="3px" mb="3px" fontSize="20px"><Folder /></Icon>フォルダアイコンをクリックし、<br />
                            フォルダが存在しているか確認をしてください。<br />
                            <br />
                            フォルダの存在を確認できたら、エクスプローラーの表示<br />
                            という項目をクリックし、表示サイズを変更してください。<br />
                            おすすめは「<strong>特大アイコン</strong>」または、「<strong>大アイコン</strong>」です。<br />
                            <br />
                            <strong>※サムネイルが表示されない場合は、反映が遅れているだけですので<br />
                            しばらく待ってから確認してください。</strong>
                            </Text>
                        </Center>
                    </Flex>
                </Box>
                <Box>
                    <Center>
                        <Heading>バグの発見、機能の要望などがある場合</Heading>
                    </Center>
                    <Flex ml="100px" mt="15px">
                        <Image
                            src="/images/googleForms.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
                        <Center ml="15px">
                            <Text>
                                アプリ右上の<Icon ml="3px" mb="2px" mr="3px" fontSize="20px"><CircleHelp /></Icon>ヘルプアイコンをクリックし、<br />
                                グーグルフォームへの記載をお願いします。<br />
                                <br />
                                個人開発であるため、対応するまでに時間がかかる場合があります。<br />
                                ご了承ください。<br />
                                <br />
                                <strong>※記載いただいた内容は匿名で送信されますのでご安心ください。</strong>
                            </Text>
                        </Center>
                    </Flex>
                </Box>
            </Flex>
        </>
    );
}

export default Home
