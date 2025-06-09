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
import VehicleDetail from "./Component/VehicleDetail.jsx";
import ListVehicle from "./Component/ListVehicle.jsx";
import VehicleList from "./Component/VehicleList.jsx";
import BrandList from "./Component/Branch.jsx";
import CRMLayout from "./Component/Crm.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/*câu lệnh vào thẳng trang login */}

            <Route path="/login" element={<LoginForm />}/>
            <Route path="/register" element={<RegisterForm />}/>
            <Route path="/home" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
            <Route path="/car" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
            <Route path="/vehicle" element={<ProtectedRoute><VehicleList /></ProtectedRoute>} />
            <Route path="/vehicle/bookings" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
            <Route path="/vehicle/brands" element={<ProtectedRoute><BrandList /></ProtectedRoute>} />
            <Route path="/crm" element={<CRMLayout />} />
            {/*//vehicledetail*/}
            <Route path="/vehicledetail/:id" element={<VehicleDetail />} />
            <Route path="/listVehicle" element={<ListVehicle />} />
        </Routes>


    ) ;
}

export default App
