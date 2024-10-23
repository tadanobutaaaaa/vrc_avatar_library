import { useState } from 'react';
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

    const allChecked = checkedItems.every(Boolean)
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked

    const changeValue = (e) => setselectedValue(e.target.value)


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
            const existedPaths = getImageResJson.existedPaths

            setCheckedItems(Array(existedPaths.length).fill(false))
            
            const handleChildChange = (index) => (e) => {
                const newCheckedItems = checkedItems.map((checked, i) => (i === index ? e.target.checked : checked));
                setCheckedItems(newCheckedItems);
            };


            const tableElements = existedPaths.map((element, index) => 
                <Tr key={element.path}>
                    <Td>
                        <Center>
                            <Checkbox
                            sChecked={checkedItems[index]}
                            onChange={handleChildChange(index)}
                            >
                            </Checkbox>
                        </Center>
                    </Td>
                        <Td><Image src={`http://127.0.0.1:8000/Images/${element.path}.jpg`} boxSize='50px' /></Td>
                        <Td>{element.path}</Td>
                        <Td>{element.subdirname}</Td>
                        <Td><Link color="teal.400" onClick={() => BrowserOpenURL(element.url)}>{element.url}</Link></Td>
                </Tr>
            )
            setaddtionalElements(tableElements)
            //console.log(addtionalElements)
            // path = getImageResJson.path
        } catch (err) {
            console.error(err)
            return
        }
        
        // 画面に表示する
        // outputFileRef.current.src = `http://127.0.0.1:8000/${path}`
    }

    //console.log(`テーブルの中身:${addtionalElements}`)
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
                        onChange={(e) => setCheckedItems(Array(checkedItems.length).fill(e.target.checked))}
                        >
                        </Checkbox> : null
                    }
                    
                    <TableContainer
                        mx="60px"
                        my="30px"
                        h="65vh"
                        border="1px solid"
                        borderRadius="8px"
                        boxShadow="md"
                        maxHeight="65vh" 
                        overflowY="auto"
                    >
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th w='1'></Th>
                                    <Th>画像</Th>
                                    <Th>名前</Th>
                                    <Th>場所</Th>
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
                        <Button 
                        colorScheme="teal"
                        onClick={sleepTime}
                        >処理を開始する
                        </Button> 
                    </Center> 
                </Box>
        </>
    );
}

export default App
