import React, { useState } from 'react';
import { WriteURLAndUpdate } from '../../wailsjs/go/main/App';
import { BookText, Settings, Folder, CircleHelp, FolderCog, FolderSearch } from 'lucide-react';
import { BrowserOpenURL, EventsOn } from "../../wailsjs/runtime/runtime";
import { SelectFolder } from '../../wailsjs/go/main/App';
import { Heading, Center, Box, Text, Image, Link, Flex, Icon, Tabs, Field, Fieldset, Input, Stack, IconButton }from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"
import Header from '../components/Header';
import { Alert } from "@/components/ui/alert"
import goWebSocket from '../hooks/goWebSocket';
import { Button } from "@/components/ui/button"
import { useColorModeValue } from "@/components/ui/color-mode"
import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from "@/components/ui/dialog"

function manual() {
    return (
        <>
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
                                左上のリロードボタンをクリックしてください。</strong>
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
    )
}

function selfProcess() {
    const [processFolder, setProcessFolder] = useState("")
    const bgColor = useColorModeValue("gray.100", "gray.400")

    const SelectFolderProcess = () => {
            SelectFolder("searchFolder").then((res) => {
                if (res !== "Error") {
                    setProcessFolder(res)
                }
            })
        }

    return (
        <>
            <Flex 
                mt="20px" 
                direction="column"
                align="center"
                justify="center"
                >
                <Flex algin="center">
                    <FolderCog size="40px"/>
                    <Heading size="4xl" ml="5px">手動設定</Heading>
                </Flex>

                <Fieldset.Root size="lg" maxW="md">
            <Stack mt="30px">
                <Fieldset.Legend>フォルダーのサムネイル設定</Fieldset.Legend>
                <Fieldset.HelperText>
                以下に必要事項を入力してください。
                </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
                <Field.Root>
                <Field.Label>商品URL</Field.Label>
                <Input name="url" />
                </Field.Root>

            <Flex gap="4px" alignItems="center">
                <Flex maxW="800px">
                    <Text 
                        textStyle="md" 
                        bgColor={bgColor}
                        borderRadius="sm"
                        py="3px"
                        px="6px"
                        truncate>{processFolder}</Text>
                </Flex>
                <IconButton 
                    onClick={() => {SelectFolderProcess()}}
                    variant="ghost"
                    aria-label='Toggle color mode'
                    >
                    <FolderSearch />
                </IconButton>
            </Flex>
            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start">
                決定
            </Button>
            </Fieldset.Root>
            </Flex>
        </>
    )
}

function Home(){
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
    const [latestVersion, setLatestVersion] = useState("")
    const [latestVersionURL, setLatestVersionURL] = useState("")

    EventsOn("updateAvailable", (data) => { 
        setIsUpdateAvailable(true)
        setLatestVersion(data.version)
        setLatestVersionURL(data.url)
    })

    const handleUpdateNow = async () => {
        //アップデートを実行する処理の実行
        try{
            setIsUpdateAvailable(false)
            await WriteURLAndUpdate()
        } catch(e) {
            console.log(e)
            toaster.create({
                title: "アップデートに失敗しました",
                description: "アプリを再起動し、再度お試しください。",
                type: "error",
            })
        }
    }

    const handleUpdateLater = () => {
        setIsUpdateAvailable(false)
    }

    goWebSocket("/processing")
    return (
        <>
            <Header />
                <DialogRoot open={isUpdateAvailable}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>アップデートのお知らせ</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <p>
                            🎉 新しいバージョン <strong>Ver.{latestVersion}</strong> が登場しました！<br />
                            リリースノートは<Link onClick={() => {BrowserOpenURL(latestVersionURL)}} variant="underline" colorPalette="blue" _hover={{ color: "teal" }} fontWeight="bold">こちら</Link>から確認できます。<br />
                            今すぐアップデートして最新の機能をお試しください！
                            </p>
                        </DialogBody>
                        <DialogFooter>
                            <DialogActionTrigger asChild>
                                <Button variant="outline" size="sm" onClick={handleUpdateLater}>後で</Button>
                            </DialogActionTrigger>
                            <Button onClick={handleUpdateNow} size="sm" >アップデートする</Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>
            <Tabs.Root lazyMount unmoutOnExit defaultValue="home">
                <Tabs.List>
                    <Tabs.Trigger value="manual">
                        <BookText size="18px"/>
                        使い方
                    </Tabs.Trigger>
                    <Tabs.Trigger value="selfProcess">
                        <FolderCog size="20px"/>
                        手動設定
                    </Tabs.Trigger>
                    <Tabs.Indicator />
                </Tabs.List>

                <Tabs.Content value="manual">{manual()}</Tabs.Content>
                <Tabs.Content value="selfProcess">{selfProcess()}</Tabs.Content>
            <Tabs.Content />
            </Tabs.Root>
        </>
    );
}
export default Home
