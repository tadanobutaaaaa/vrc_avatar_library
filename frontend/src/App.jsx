import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SetupProcess from "./pages/setupProcess"
import Manual from "./pages/manual"
import Processing from "./pages/processing"
import Result from "./pages/result"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setupProcess" element={<SetupProcess/>}/>
            <Route path="/manual" element={<Manual/>}/>
            <Route path="/processing" element={<Processing/>}/>
            <Route path="/result" element={<Result/>} />
        </Routes>
    );
}

export default App;
