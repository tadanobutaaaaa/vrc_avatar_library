import { Flex, HStack, Box, Heading, } from '@chakra-ui/react';
import { CircleHelp, Info, Settings, House } from 'lucide-react';
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";
import { IconButton } from "@chakra-ui/react"; 
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Page from './coloModeButton';

function Header () {
    const navigate = useNavigate()
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
                    aria-label='Toggle color mode'
                >
                    <House/>
                </IconButton>
            </HStack>

            <HStack position="absolute" right={5}>
                <IconButton
                    onClick={() => navigate("/manual")}
                    variant="ghost"
                    aria-label='Toggle color mode'
                >
                    <Info 
                        variant="ghost"
                        aria-label='Toggle color mode'
                        size="20px"
                    />
                </IconButton>
                <IconButton 
                    onClick={() => {BrowserOpenURL("https://docs.google.com/forms/d/e/1FAIpQLSeo5KjaIfDgXkJ_2va2N9iDJV2kmRXVwQpklYECFi0E4jHnDA/viewform")}}
                    variant="ghost"
                    aria-label='Toggle color mode'
                >
                    <CircleHelp/>
                </IconButton>
                <IconButton
                    onClick={() => navigate("/setupProcess")}
                    variant="ghost"
                    aria-label='Toggle color mode'
                >
                    <Settings/>
                </IconButton>
                <Page />
            </HStack>
        </Flex>
    )
}

export default Header