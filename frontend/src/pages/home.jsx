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
} from '@chakra-ui/react';
import Header from '../components/Header';
import { FileManager } from "../../wailsjs/go/main/App";
function App() {
    const [selectedValue, setselectedValue] = useState("google")
    const [addtionalElements, setaddtionalElements] = useState('')
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
            console.log(existedPaths)
            console.log(getImageResJson)
            const tableElements = existedPaths.map(element => 
                <Tr key={element.path}>
                    <Td><img src={`http://127.0.0.1:8000/Images/${element.path}.jpg`} /></Td>
                    <Td>{element.path}</Td>
                    <Td>{element.fullPath}</Td>
                    <Td><Link color="teal.400" href={element.url}>{element.url}</Link></Td>
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
