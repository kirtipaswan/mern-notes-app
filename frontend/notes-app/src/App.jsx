import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import LandingPage from "./pages/LandingPage/LandingPage"; 

const App = () => {
  return (
    <Router>
            <Routes>
                {/* Set the root path to the new LandingPage */}
                <Route path="/" element={<LandingPage />} /> 
                <Route path="/dashboard" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
  );
};

export default App;
