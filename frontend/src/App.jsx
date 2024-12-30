import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SetupProcess from "./pages/setupProcess"
import Manual from "./pages/manual"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setupProcess" element={<SetupProcess/>}/>
            <Route path="/manual" element={<Manual/>}/>
        </Routes>
    );
}

export default App;
