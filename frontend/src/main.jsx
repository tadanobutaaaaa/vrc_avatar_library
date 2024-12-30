import React from 'react'
import {createRoot} from 'react-dom/client'
import { Provider } from "@/components/ui/provider"
import { BrowserRouter } from 'react-router-dom';
import App from './App'

const container = document.getElementById('root')

const root = createRoot(container)

root.render(
    <React.StrictMode>
        <Provider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)
