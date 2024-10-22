import { extendTheme } from '@chakra-ui/react';

//const config = {
//    initialColorMode: 'system',
//    useSystemColorMode: true,
//};

const theme = extendTheme({
    textStyles: {
        appTitle: {
            fontFamily: "'Anton', sans-serif"
        },
    },
});

export default theme;
