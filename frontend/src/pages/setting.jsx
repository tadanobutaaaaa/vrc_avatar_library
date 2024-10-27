import React from 'react';
import { Box, 
    Heading, } from '@chakra-ui/react';
import Header from '../components/Header';

function App() {
    const [input, setInput] = useState('')
    const handleInputChange = (e) => setInput(e.target.value)
    const isError = input === ''
// ページ推移をやめる　このプログラム全削除
    return (
        <>
            <Header />
            <Box
            mx="60px"
            mt={10}
            >
                <Heading>Google Custom Search API Key</Heading>
            </Box>
        </>
    );
}

export default App
