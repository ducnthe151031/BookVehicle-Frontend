import { useState } from 'react'
import {Routes, Route, Navigate, Form} from 'react-router-dom';
import LoginPage from "./Component/Authentication/Login.jsx";
import Login from "./Component/Authentication/Login.jsx";
import Register from "./Component/Authentication/Register.jsx";
import HomePage from "./Component/Authentication/Home.jsx";
import LoginForm from "./Component/Authentication/Login.jsx";
import RegisterForm from "./Component/Authentication/Register.jsx";
import CarForm from "./Component/CarForm.jsx";
import BookingForm from "./Component/BookingForm.jsx";
import ProtectedRoute from "./Component/Authentication/shared/ProtectedRoute.jsx";
import CRMLayout from "./Component/Crm.jsx";
import CarFormPage from "./Component/CarForm.jsx";
import VehicleList from "./Component/VehicleList.jsx";
import BrandList from "./Component/Branch.jsx";

function App() {

    return (
        <Routes>
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/register" element={<RegisterForm />}/>
            <Route path="/home" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
            <Route path="/car" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
            <Route path="/vehicle" element={<ProtectedRoute><VehicleList /></ProtectedRoute>} />
            <Route path="/vehicle/bookings" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
            <Route path="/vehicle/brands" element={<ProtectedRoute><BrandList /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/crm" element={<CRMLayout />} />

        </Routes>

    ) ;
}

export default App
