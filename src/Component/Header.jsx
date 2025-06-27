import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Car } from 'lucide-react'; // Import Car icon

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

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="bg-white text-black border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <button
                        onClick={handleNavigateHome}
                        className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                    >
                        <Car className="w-6 h-6" /> {/* Car icon */}
                        <span className="text-base font-semibold">Thuê Xe</span>
                    </button>
                    <nav className="flex space-x-6 text-gray-700 text-sm">
                        <a href="home" className="hover:text-blue-600">Trang chủ</a>
                        <a href="profile" className="hover:text-blue-600">Thông tin cá nhân</a>
                        <a href="myPayment" className="hover:text-blue-600">Đơn thanh toán</a>

                        {/*<a href="#" className="font-semibold text-gray-900">Các loại xe</a> /!* Bold for "Các loại xe" *!/*/}
                        {/*<a href="#" className="hover:text-blue-600">Người cho thuê</a>*/}
                        {/*<a href="#" className="hover:text-blue-600">Liên lạc với chúng tôi</a>*/}
                    </nav>
                </div>
                <div className="flex items-center space-x-2">
                    {customer ? (
                        // If customer is logged in, show profile/logout options
                        <div className="relative">
                            <button
                                onClick={handleMenuToggle}
                                className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                            >
                                <User className="w-5 h-5 text-yellow-500" />
                                <span className="font-medium">Xin chào {customer?.username}</span>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">

                                    <button
                                        onClick={handleChangePasswordClick}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                    <button
                                        onClick={logOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // If no customer, show login/register as per image
                        <div className="flex items-center space-x-1">
                            {/* Replaced Star icon with User as per image, and changed color to yellow */}
                            <User className="w-5 h-5 text-yellow-500" />
                            <button
                                onClick={handleLogin}
                                className="text-black text-sm hover:text-gray-700 font-medium"
                            >
                                Đăng nhập
                            </button>
                            <span className="text-gray-500 text-sm">/</span>
                            <button
                                onClick={() => navigate('/register')} // Assuming a register route
                                className="text-black text-sm hover:text-gray-700 font-medium"
                            >
                                Đăng kí
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;