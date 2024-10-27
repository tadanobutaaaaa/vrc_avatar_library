import { useRef } from 'react';
import { Icon, 
    useColorMode, 
    IconButton, 
    Flex, 
    HStack, 
    Box, 
    Heading,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Input,
    Button,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, SettingsIcon, InfoIcon, QuestionIcon } from '@chakra-ui/icons';
import { Link } from "react-router-dom";

function Header () {
    // const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    return (
        <Flex alignItems="center" justifyContent="center" bg="teal.400" p={6} position="relative">
            <Box textAlign="center">
                <Heading>VRC Avater Library</Heading>
            </Box>
            
            <HStack spacing="25px" position="absolute" right={7}>
                {/* 
                <IconButton 
                aria-label='Toggle theme'
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                />
                */}
                <Link to="/manual">
                    <Icon as={InfoIcon} boxSize={6}/>
                </Link>
                <Link to="/help">
                    <Icon as={QuestionIcon} boxSize={6}/>
                </Link>
                    <IconButton 
                        variant="unstyled" a
                        ria-label='setting' 
                        icon={<SettingsIcon boxSize={6}/>}
                        ref={btnRef} 
                        onClick={onOpen}/>
                    <Drawer
                        isOpen={isOpen}
                        placement='right'
                        onClose={onClose}
                        finalFocusRef={btnRef}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Google Custom Search API Key</DrawerHeader>

                        <DrawerBody>
                            <Input placeholder='Type here...' />
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                            </Button>
                            <Button colorScheme='blue'>Save</Button>
                        </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
            </HStack>
        </Flex>
    )
}

export default Header