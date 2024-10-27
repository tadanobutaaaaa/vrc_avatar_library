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
} from '@chakra-ui/react';
import Header from '../components/Header';
import { FileManager } from "../../wailsjs/go/main/App";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime"
function App() {
    const [selectedValue, setselectedValue] = useState("google")
    const [addtionalElements, setaddtionalElements] = useState('')
    const [checkedItems, setCheckedItems] = useState([])
    const [existedPaths, setExistedPaths] = useState([])

    const changeValue = (e) => setselectedValue(e.target.value)
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
        setTimeout(displayImages, 4000)
    }

    async function displayImages() {
        FileManager()
        try {
            const getImageRes = await fetch("http://localhost:8000/image/get/" + selectedValue,
                {
                    mode: "cors",
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({})
                }
            )
            // if (getImageRes.status === 404) alert(`${target}の画像を取得できませんでした`)
            const getImageResJson = await getImageRes.json()
            setExistedPaths(getImageResJson.existedPaths)

            setCheckedItems(Array(existedPaths.length).fill(false))
            //console.log(addtionalElements)
            // path = getImageResJson.path
        } catch (err) {
            console.error(err)
            return
        }
        
        // 画面に表示する
        // outputFileRef.current.src = `http://127.0.0.1:8000/${path}`
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
            <Td>{element.path}</Td>
            <Td><Link color="teal.400" onClick={() => BrowserOpenURL(element.url)}>{element.url}</Link></Td>
        </Tr>
    )
    setaddtionalElements(tableElements)
    }}, [existedPaths])

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
                <Box>
                    <Flex justifyContent="flex-end">
                        <Select 
                            w={335}
                            mt={3}
                            mr={5}
                            border="1px solid"
                            onChange={changeValue}
                        >
                            <option value="google">Google</option>
                            <option value="duckduckgo">DuckDuckGo(非推奨)</option>
                        </Select>
                    </Flex>
                </Box>
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
