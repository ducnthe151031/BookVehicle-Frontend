import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Car, Mail, Phone, X } from 'lucide-react';
import { useAuth } from "../context/AuthContext.jsx";

const Header = ({ logOut, handleChangePassword, customer }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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
        setIsMenuOpen(false);
    };

    const handleLogin = () => {
        navigate('/login');
        setIsMenuOpen(false);
    };

    const handleBecomeOwner = () => {
        setIsContactModalOpen(true);
        setIsMenuOpen(false);
    };

    const handleCloseContactModal = () => {
        setIsContactModalOpen(false);
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
                        {customer?.role === "ROLE_OWNER" ? (
                            <>
                                <a href="list" className="hover:text-blue-600">Danh sách xe</a>
                                <a href="myPayment" className="hover:text-blue-600">Đơn thanh toán</a>
                            </>
                        ) : (
                            <a href="myPayment" className="hover:text-blue-600">Đơn thanh toán</a>
                        )}
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
                                        onClick={handleProfile}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Hồ sơ
                                    </button>
                                    <button
                                        onClick={handleChangePasswordClick}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                    {customer?.role === "ROLE_USER" && (
                                        <button
                                            onClick={handleBecomeOwner}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Trở thành người cho thuê
                                        </button>
                                    )}
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
                                onClick={() => navigate('/register')}
                                className="text-black text-sm hover:text-gray-700 font-medium"
                            >
                                Đăng kí
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Contact Admin Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-xl font-bold text-gray-800">Liên hệ để trở thành người cho thuê</h3>
                            <button
                                onClick={handleCloseContactModal}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Đóng"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="text-gray-600 mb-6">
                            <p className="mb-4">Bạn muốn trở thành người cho thuê xe hoặc nhân viên vận hành? Vui lòng liên hệ với quản trị viên của chúng tôi để được hỗ trợ.</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Email:</span>
                                    <a href="mailto:ducnthe151031@fpt.edu.vn" className="text-blue-600 hover:underline">ducnthe151031@fpt.edu.vn</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Số điện thoại:</span>
                                    <a href="tel:+84364185257" className="text-blue-600 hover:underline">+84 364 185 257</a>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={handleCloseContactModal}
                                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                                aria-label="Đóng"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
