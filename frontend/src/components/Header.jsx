import { Flex, HStack, Box, Heading, IconButton } from '@chakra-ui/react';
import { CircleHelp, Info, Settings, House, Folder } from 'lucide-react';
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";
import { OpenFolder } from "../../wailsjs/go/main/App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from 'react';

function Header () {
    const navigate = useNavigate()
    const [avatarsPath, setAvatarsPath] = useState("")
    OpenFolder().then((res) => {
        setAvatarsPath(res)
    })
    return (
        <Flex alignItems="center" justifyContent="center" bg="teal.400" p={5} position="relative">
            <Box textAlign="center">
                <Link to="/">
                    <Heading size="2xl">VRC Avatar Library</Heading>
                </Link>
            </Box>
            
            <HStack position="absolute" left={5}>
                <IconButton
                    onClick={() => navigate("/") }
                    variant="ghost"
                    aria-label='Open home'
                >
                    <House/>
                </IconButton>
            </HStack>

            <HStack position="absolute" right={5}>
                <IconButton
                    onClick={() => navigate("/manual")}
                    variant="ghost"
                    aria-label='Open self-introduction'
                >
                    <Info />
                </IconButton>
                <IconButton 
                    onClick={() => {BrowserOpenURL("https://docs.google.com/forms/d/e/1FAIpQLSeo5KjaIfDgXkJ_2va2N9iDJV2kmRXVwQpklYECFi0E4jHnDA/viewform")}}
                    variant="ghost"
                    aria-label='Open Google Form'
                >
                    <CircleHelp/>
                </IconButton>
                <IconButton 
                    onClick={() => {BrowserOpenURL(avatarsPath)}}
                    variant="ghost"
                    aria-label='Open Explorer'
                >
                    <Folder/>
                </IconButton>
                <IconButton
                    onClick={() => navigate("/setupProcess")}
                    variant="ghost"
                    aria-label='Open settings'
                >
                    <Settings/>
                </IconButton>
            </HStack>
        </Flex>
    )
}

export default Header