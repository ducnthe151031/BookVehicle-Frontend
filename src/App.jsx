import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./Component/Authentication/Login.jsx";
import RegisterForm from "./Component/Authentication/Register.jsx";
import HomePage from "./Component/Authentication/Home.jsx";
import CarForm from "./Component/CarForm.jsx";
import BookingForm from "./Component/BookingForm.jsx";
import ProtectedRoute from "./Component/Authentication/shared/ProtectedRoute.jsx";
import CRMLayout from "./Component/Crm.jsx";
import VehicleList from "./Component/VehicleList.jsx";
import BrandList from "./Component/Branch.jsx";
import CategoryList from "./Component/CategoryList.jsx";
import RentalList from "./Component/RentalList.jsx";
import CarDetail from "./Component/CarDetail.jsx";
import Profile from "./Component/Profile.jsx";
import ChangePassword from "./Component/ChangePassword.jsx";
import ForgotPassword from "./Component/Authentication/ForgotPassword.jsx";

import ResetPassword from "./Component/Authentication/ResetPassword.jsx";
import LandingPage from "./Component/LandingPage.jsx"; // Add CarDetail import

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path="/password" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgotPassword" element={<ResetPassword />} />
            <Route path="/landing" element={<LandingPage />} />

            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/vehicle/add" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
            <Route path="/vehicle" element={<ProtectedRoute><VehicleList /></ProtectedRoute>} />
            <Route path="/:carId" element={<ProtectedRoute><CarDetail /></ProtectedRoute>} /> {/* Add CarDetail route */}
            <Route path="/vehicle/bookings/:carId" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} /> {/* Adjust BookingForm route */}
            <Route path="/vehicle/brands" element={<ProtectedRoute><BrandList /></ProtectedRoute>} />
            <Route path="/vehicle/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
            <Route path="/rentals" element={<ProtectedRoute><RentalList /></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute><CRMLayout /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} /> {/* Fallback for 404 */}
        </Routes>
    );

import ResetPassword from "./Component/Authentication/ResetPassword.jsx"; // Add CarDetail import

function App() {
        return (
            <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
                    <Route path="/password" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/forgotPassword" element={<ResetPassword />} />
                    <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                    <Route path="/vehicle/add" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
                    <Route path="/vehicle" element={<ProtectedRoute><VehicleList /></ProtectedRoute>} />
                    <Route path="/:carId" element={<ProtectedRoute><CarDetail /></ProtectedRoute>} /> {/* Add CarDetail route */}
                    <Route path="/vehicle/bookings/:carId" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} /> {/* Adjust BookingForm route */}
                    <Route path="/vehicle/brands" element={<ProtectedRoute><BrandList /></ProtectedRoute>} />
                    <Route path="/vehicle/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
                    <Route path="/rentals" element={<ProtectedRoute><RentalList /></ProtectedRoute>} />
                    <Route path="/crm" element={<ProtectedRoute><CRMLayout /></ProtectedRoute>} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} /> {/* Fallback for 404 */}
            </Routes>
        );

}

export default App;