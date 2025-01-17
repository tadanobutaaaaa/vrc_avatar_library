import React from 'react'
import { BookText, Settings, Folder, CircleHelp } from 'lucide-react';
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";
import { Heading, Center, Box, Text, VStack, Image, Link, Flex } from "@chakra-ui/react"
import Header from '../components/Header';
function App(){
    return (
        <>
            <Header />
            <Center mt="20px">
                <BookText size="40px"/>
                <Heading size="4xl" ml="5px">使い方</Heading>
            </Center>
            <VStack mt="30px" mb="50px" gap="40px">
                <Box>
                    <Center>
                        <Heading>1.Chrome拡張機能をインストールする</Heading>
                    </Center>
                    <Center mt="15px">
                        <Image 
                            src="/images/chromeExtension.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
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
                </Box>
                <Box>
                    <Center>
                        <Heading>2.設定を確認する</Heading>
                    </Center>
                    <Center mt="15px">
                        <Image
                            src="/images/settingFolderPath.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
                        <Text ml="15px">
                            <Flex>
                                アプリの右上の<Settings />設定アイコンからBoothで買った商品が<br />
                            </Flex>
                            保存されるフォルダを指定してください。<br />
                            <br />
                            初期設定ではダウンロードフォルダが設定されています。<br />
                            <strong>この設定が正しくないとプログラムが動かないのでご注意ください。</strong>
                        </Text>
                    </Center>
                </Box>
                <Box>
                    <Center>
                        <Heading>3.Boothのライブラリページに移動する</Heading>
                    </Center>
                    <Center mt="15px">
                        <Image
                            src="/images/boothLibrary.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
                        <Text ml="15px">
                            <Link
                                onClick={() => {BrowserOpenURL("https://chromewebstore.google.com/detail/vrc-avatar-library/fhjadoafaejfgjcpafnoaopkpbbjganm?authuser=0&hl=ja")}}
                                variant="underline"
                                colorPalette={"blue"}
                                _hover={{ color: "teal" }}
                                fontWeight="bold"
                            >Booth</Link>にアクセスし右上のアイコンからライブラリを選択します。<br />   
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
                </Box>
                <Box>
                    <Center>
                        <Heading>4.フォルダにサムネイルがついているかの確認</Heading>
                    </Center>
                    <Center mt="15px">
                        <Image
                            src="/images/folderSize.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
                        <Text ml="15px">
                            <Flex>
                                アプリの右上の<Folder />フォルダアイコンをクリックし、<br />
                            </Flex>
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
                </Box>
                <Box>
                    <Center>
                        <Heading>バグの発見、機能の要望などがある場合</Heading>
                    </Center>
                    <Center mt="15px">
                        <Image
                            src="/images/googleForms.png"
                            h="230px"
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderStyle="solid"
                            borderRadius="md"
                        ></Image>
                        <Text ml="15px">
                            <Flex>
                            アプリ右上の<CircleHelp />ヘルプアイコンをクリックし、<br />
                            </Flex>
                            グーグルフォームへの記載をお願いします。<br />
                            <br />
                            個人開発であるため、対応するまでに時間がかかる場合があります。<br />
                            ご了承ください。<br />
                            <br />
                            <strong>※記載いただいた内容は匿名で送信されますのでご安心ください。</strong>
                        </Text>
                    </Center>
                </Box>
            </VStack>
        </>
    );
}

export default App
