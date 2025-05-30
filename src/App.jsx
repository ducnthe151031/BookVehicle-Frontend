import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./Component/Authentication/Login.jsx";
import Login from "./Component/Authentication/Login.jsx";
import Register from "./Component/Authentication/Register.jsx";
import HomePage from "./Component/Authentication/Home.jsx";
import LoginForm from "./Component/Authentication/Login.jsx";
import RegisterForm from "./Component/Authentication/Register.jsx";

function App() {
//ttest


    return (
        <Routes>
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/register" element={<RegisterForm />}/>
            <Route path="/home" element={<HomePage />} />
        </Routes>

    ) ;
}

export default App
