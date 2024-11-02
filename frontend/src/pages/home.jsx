import { useState, useEffect } from 'react';
import { Button, 
    Center, 
    Box, 
    Flex, 
    Select,
    Table,
    Thead,
    Tr,
    Th,
    TableContainer,
    Tbody,
    Td,
    Link,
    Image,
    Checkbox,
    useToast,
} from '@chakra-ui/react';
import Header from '../components/Header';
import { FileManager, SearchAPIkey, ShutdownFastAPI } from "../../wailsjs/go/main/App";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime"

function App() {
    const [addtionalElements, setaddtionalElements] = useState('')
    const [checkedItems, setCheckedItems] = useState([])
    const [existedPaths, setExistedPaths] = useState([])
    const toast = useToast()

    const handleChildChange = (index) => (e) => {
        const checked = e.target.checked; // チェック状態を取得
        setCheckedItems(prevCheckedItems => {
            const newCheckedItems = [...prevCheckedItems]; // 新しい配列を作成
            newCheckedItems[index] = checked; // 対象のインデックスを更新
            console.log(`Checkbox ${index} changed: ${checked}`); // 状態を出力
            return newCheckedItems; // 更新された配列を返す
        });
    };

    const handleSelectAllChange = (e) => {
        const checked = e.target.checked;
        const newCheckedItems = Array(checkedItems.length).fill(checked); // すべてのチェックボックスを一括で更新
        console.log('All checkboxes changed to:', checked); // デバッグログ
        setCheckedItems(newCheckedItems); // 更新されたチェックボックスの状態を設定
    };
    
    useEffect(() => {
        console.log(checkedItems);
    }, [checkedItems]);


    function sleepTime() {
        SearchAPIkey().then((result) => {
            if(result) {
                displayImages()
            } else {
                toast({
                    title: 'システムからの通知',
                    description: "GoogleAPIkeyが設定されていないため実行できません　　　　　右上の歯車マークからAPIkeyを設定してください",
                    status: 'error',
                    duration: 5000,
                    position: 'top',
                    isClosable: true,
                })
            }
        })
    }

    async function displayImages() {
        await FileManager()
        try {
            const getImageRes = await fetch("http://localhost:8000/image/get",
                {
                    mode: "cors",
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({})
                }
            )
            const getImageResJson = await getImageRes.json()
            setExistedPaths(getImageResJson.existedPaths)

            setCheckedItems(Array(existedPaths.length).fill(false))
        } catch (err) {
            console.error(err)
            return
        }
    }

    useEffect(() => {
        if (existedPaths.length > 0) {
        console.log(existedPaths)
        const tableElements = existedPaths.map((element, index) => 
        <Tr key={element.path}>
                <Td>    
                    <Checkbox
                        key={index}
                        isChecked={checkedItems[index]}
                        onChange={handleChildChange(index)}
                        >
                            <Image 
                                src={`http://127.0.0.1:8000/Images/${element.path}.png` } 
                                boxSize='50px' 
                                border="1px solid"
                                borderRadius="8px"
                                borderColor='gray.200'
                                ml="10px"
                                />
                        </Checkbox>
                </Td>
            <Td>{element.query}</Td>
            <Td><Link color="teal.400" onClick={() => BrowserOpenURL(element.url)}>{element.url}</Link></Td>
        </Tr>
    )
    setaddtionalElements(tableElements)
    }}, [existedPaths])

    function shutdownFastAPI() {
        ShutdownFastAPI()
    }

    async function settingThumbnail() {
        try{
            let thumbnailList = []

            console.log(existedPaths)
            for(let i = 0; i < checkedItems.length; i++) {
                if (checkedItems[i]){
                    thumbnailList.push(existedPaths[i])
                }
            }
            console.log(`thumbnailList:${JSON.stringify(thumbnailList)}`)

            const postFastapiThumbnail = await fetch("http://localhost:8000/thumbnail",
                {
                    mode: "cors",
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(thumbnailList)
                }
            )

            const thumbnailResJSon = await postFastapiThumbnail.json()
            toast({
                title: 'システムからの通知',
                description: "正常にサムネイルが設定されました",
                status: 'success',
                duration: 2500,
                position: 'top',
                isClosable: true,
            })
            shutdownFastAPI()
        } catch (err) {
            console.error(err)
            return
        }
    }

    const allChecked = checkedItems.every(Boolean)
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked

    return (
        <>
            <Header />
                    {addtionalElements ?
                        <Checkbox
                            isChecked={allChecked}
                            isIndeterminate={isIndeterminate}
                            onChange={handleSelectAllChange}
                        >
                            すべて選択する
                        </Checkbox> : null
                    }
                    
                    <TableContainer
                        mx="50px"
                        my="30px"
                        h="70vh"
                        border="1px solid"
                        borderRadius="8px"
                        boxShadow="md"
                        maxHeight="65vh" 
                        overflowY="auto"
                    >
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>画像</Th>
                                    <Th>名前</Th>
                                    <Th>商品url</Th>
                                </Tr>
                            </Thead>
                                {addtionalElements ?
                                    <Tbody>
                                        {addtionalElements}
                                    </Tbody> : null
                                }
                        </Table>
                    </TableContainer>
                <Box>
                    <Center>
                        {addtionalElements ?
                        <Button 
                        colorScheme="teal"
                        onClick={settingThumbnail}
                        >サムネイルを設定する
                        </Button> :
                        <Button 
                        colorScheme="teal"
                        onClick={!allChecked ? null : sleepTime}
                        >ファイルを検索する
                        </Button>
                        }
                    </Center> 
                </Box>
        </>
    );
}

export default App
