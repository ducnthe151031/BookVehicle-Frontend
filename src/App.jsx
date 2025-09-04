import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import LandingPage from "./Component/LandingPage.jsx";
import MyPayment from "./Component/myPayment.jsx";
import CouponListPage from "./Component/CouponList.jsx";
import VehicleListForStaff from "./Component/VehicleListForStaff.jsx";
import ProfileForAdmin from "./Component/ProfileForAdmin.jsx";
import ChanPasswordForAdmin from "./Component/ChangePassWordForAdmin.jsx";
import UserListPage from "./Component/User.jsx";
import Test from "./Component/Test.jsx";

function App() {
        return (
            <>
                    <Routes>
                            <Route path="/test" element={<Test />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
                            <Route path="/myPayment" element={<ProtectedRoute><MyPayment/></ProtectedRoute>} />
                            <Route path="/list" element={<ProtectedRoute><VehicleListForStaff/></ProtectedRoute>} />
                            <Route path="/prfAdmin" element={<ProtectedRoute><ProfileForAdmin/></ProtectedRoute>} />
                            <Route path="/passwordAdmin" element={<ProtectedRoute><ChanPasswordForAdmin/></ProtectedRoute>} />
                            <Route path="/user" element={<ProtectedRoute><UserListPage/></ProtectedRoute>} />
                            <Route path="/password" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />
                            <Route path="/coupon" element={<ProtectedRoute><CouponListPage/></ProtectedRoute>} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/forgotPassword" element={<ResetPassword />} />
                            <Route path="/landing" element={<LandingPage />} />
                            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                            <Route path="/vehicle/add" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
                            <Route path="/vehicle" element={<ProtectedRoute><VehicleList /></ProtectedRoute>} />
                            <Route path="/:carId" element={<ProtectedRoute><CarDetail /></ProtectedRoute>} />
                            <Route path="/vehicle/bookings/:carId" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
                            <Route path="/vehicle/brands" element={<ProtectedRoute><BrandList /></ProtectedRoute>} />
                            <Route path="/vehicle/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
                            <Route path="/rentals" element={<ProtectedRoute><RentalList /></ProtectedRoute>} />
                            <Route path="/crm" element={<ProtectedRoute><CRMLayout /></ProtectedRoute>} />
                            <Route path="/" element={<Navigate to="/landing" replace />} />
                            <Route path="*" element={<Navigate to="/landing" replace />} />
                    </Routes>

                    {/* Global ToastContainer - Add this for all components to use */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
            </>
        );
}

export default App;