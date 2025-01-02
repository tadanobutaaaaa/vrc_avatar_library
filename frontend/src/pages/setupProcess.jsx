import React from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button"
import { SelectFolder } from '../../wailsjs/go/main/App';

function App() {
    return (
        <>
            <Header />
            <Button onClick={() => SelectFolder()}>ディレクトリを選択してください</Button>
        </>
    )
}

export default App