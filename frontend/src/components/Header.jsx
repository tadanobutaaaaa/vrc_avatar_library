import { Icon,
    Flex, 
    HStack, 
    Box, 
    Heading,
} from '@chakra-ui/react';
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime"
import { Link } from "react-router-dom";

function Header () {
    // const { colorMode, toggleColorMode } = useColorMode()
    
    return (
        <Flex alignItems="center" justifyContent="center" bg="teal.400" p={6} position="relative">
            <Box textAlign="center">
                <Heading>VRC Avater Library</Heading>
            </Box>
            
            <HStack spacing="25px" position="absolute" right={7}>
                {/*
                <Link to="/manual">
                    <Icon as={InfoIcon} boxSize={6}/>
                </Link>
                <Link href = "https://docs.google.com/forms/d/e/1FAIpQLSeo5KjaIfDgXkJ_2va2N9iDJV2kmRXVwQpklYECFi0E4jHnDA/viewform">
                    <Icon as={QuestionIcon} boxSize={6}/>
                </Link>
                */}
            </HStack>
        </Flex>
    )
}

export default Header