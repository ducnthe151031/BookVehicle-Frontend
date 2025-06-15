import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ logOut, handleChangePassword, customer }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenuToggle = (e) => {
        e.preventDefault();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleProfile = () => {
        navigate('/profile');
        setIsMenuOpen(false);
    };

    const handleChangePasswordClick = () => {
        navigate('/password');
        setIsMenuOpen(false);
    };

    const handleNavigateHome = () => {
        navigate('/home');
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleNavigateHome}
                        className="text-3xl font-extrabold tracking-tight hover:text-blue-200 transition-colors duration-200 focus:outline-none"
                    >
                        RentalCars
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={logOut}
                        className="flex items-center space-x-2 bg-amber-100 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-amber-200 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        <span>Đăng xuất</span>
                    </button>
                    <div className="relative">
                        <button
                            onClick={handleMenuToggle}
                            className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <span>Xin chào {customer?.username || 'Quản lý tài khoản'}</span>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-blue-600 rounded-lg shadow-lg z-10">
                                <ul className="py-1">
                                    <li>
                                        <button
                                            onClick={handleProfile}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-lg"
                                        >
                                            Thông tin cá nhân
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleChangePasswordClick}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-lg"
                                        >
                                            Đổi mật khẩu
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;