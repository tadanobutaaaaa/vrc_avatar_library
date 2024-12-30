import { Flex, HStack, Box, Heading, } from '@chakra-ui/react';
import { CircleHelp, Info, Settings } from 'lucide-react';
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";
import { IconButton } from "@chakra-ui/react"; 
import { useNavigate } from "react-router-dom";
import Page from './coloModeButton';

function Header () {
    const navigate = useNavigate()
    return (
        <Flex alignItems="center" justifyContent="center" bg="teal.400" p={6} position="relative">
            <Box textAlign="center">
                <Heading>VRC Avater Library</Heading>
            </Box>
            
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