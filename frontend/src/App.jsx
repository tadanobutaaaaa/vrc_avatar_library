import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SetupProcess from "./pages/setup_process"
import Manual from "./pages/manual"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup_process" element={<SetupProcess/>}/>
            <Route path="/manual" element={<Manual/>}/>
        </Routes>
    );
}

export default App;
