import React, { useState } from 'react';
import {
    Building2, Menu, Users, DollarSign, Search,
    BarChart2, MessageSquare, Calendar, Settings,
    Home, UserPlus, FileText, Bell, ChevronDown,
    Layout, Package, CheckCircle, Phone, Mail,
    Plus, Filter, MoreHorizontal, ArrowRight, X,
    LogOut, User, Car, ListTree
} from 'lucide-react';
import {
    FaCar,
    FaIndustry as Factory,
    FaListAlt as ClipboardList,
    FaTicketAlt as TicketPercent,
    FaUserCircle as UserCircle,
    FaKey as KeyRound
} from 'react-icons/fa';
import { GiCarKey } from 'react-icons/gi';
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import BookingForm from "./BookingForm.jsx";

const Unauthorized = () => {
        const navigate = useNavigate();

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                    <X className="w-12 h-12 text-red-500 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
                    <p className="text-gray-600 mb-6">Bạn không có quyền để truy cập vào trang này. Vui lòng liên hệ quản
                        trị viên nếu cần hỗ trợ.</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        )
    }
;

const CRMLayout = ({ children }) => {
    const [collapsedSidebar, setCollapsedSidebar] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const { logOut, customer } = useAuth();
    const navigate = useNavigate();

    const navigation = [
        { name: 'Quản lí người dùng', icon: User, path: '/user', roles: ['ROLE_ADMIN'] },
        { name: 'Hãng xe', icon: Factory, path: '/vehicle/brands', roles: ['ROLE_OPERATOR'] },
        { name: 'Loại xe', icon: FaCar, path: '/vehicle/categories', roles: ['ROLE_OPERATOR'] },
        { name: 'Danh sách xe', icon: Car, path: '/vehicle', roles: ['ROLE_OWNER','ROLE_OPERATOR'] },
        { name: 'Danh sách thuê xe', icon: ClipboardList, path: '/rentals', roles: ['ROLE_OPERATOR'] },
        { name: 'Mã coupon', icon: TicketPercent, path: '/coupon', roles: ['ROLE_OPERATOR'] },
        { name: 'Hồ sơ cá nhân', icon: UserCircle, path: '/prfAdmin', roles: ['ROLE_ADMIN','ROLE_OPERATOR'] },
        { name: 'Đổi mật khẩu', icon: KeyRound, path: '/passwordAdmin', roles: ['ROLE_ADMIN','ROLE_OPERATOR'] }
    ];

    const filteredNavigation = navigation.filter(
        (item) => item.roles && item.roles.includes(customer?.role)
    );

    // Kiểm tra xem đường dẫn hiện tại có được phép không
    const isAuthorized = filteredNavigation.some((item) => item.path === location.pathname);

    const handleNavClick = (path) => {
        navigate(path);
    };

    if (!isAuthorized && location.pathname !== '/' && !location.pathname.startsWith('/login')) {
        return <Unauthorized />;
    }

    return (
        <div className="h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`${
                collapsedSidebar ? 'w-16' : 'w-64'
            } bg-gray-800 text-white flex flex-col transition-all duration-300 shadow-lg`}>
                {/* Logo Section */}
                <div className="h-16 border-b border-gray-700 flex items-center justify-between px-4">
                    {!collapsedSidebar && (
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                                <Car className="h-5 w-5 text-gray-800" />
                            </div>
                            <div className="ml-3">
                                <h2 className="font-bold text-lg text-white">Management</h2>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsedSidebar(!collapsedSidebar)}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                    >
                        <Menu className="h-5 w-5 text-gray-300" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">

                    {filteredNavigation.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavClick(item.path)}
                            className={`w-full flex items-center ${
                                collapsedSidebar ? 'justify-center px-2' : 'justify-start px-4'
                            } py-2 rounded transition-all duration-200 ${
                                location.pathname === item.path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-white' : 'text-gray-300'}`} />
                            {!collapsedSidebar && <span className="ml-3 font-medium text-sm">{item.name}</span>}
                        </button>
                    ))}

                    {/* Add Home button for admin and operator */}
                    {(customer?.role === 'ROLE_ADMIN' || customer?.role === 'ROLE_OPERATOR') && (
                        <button
                            onClick={() => navigate('/home')}
                            className={`w-full flex items-center ${collapsedSidebar ? 'justify-center px-2' : 'justify-start px-4'} py-2 rounded transition-all duration-200 text-gray-300 hover:bg-gray-700 mt-4`}
                        >
                            <Home className="w-5 h-5 text-gray-300" />
                            {!collapsedSidebar && <span className="ml-3 font-medium text-sm">Quay về trang chủ</span>}
                        </button>
                    )}
                </nav>

                {/* User Menu */}
                <div className="p-4 border-t border-gray-700">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-full flex items-center px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                                <User className="w-4 h-4 text-white" />
                            </div>
                            {!collapsedSidebar && (
                                <>
                                    <div className="ml-3 text-left flex-1">
                                        <p className="text-sm font-semibold text-white">{customer?.username || 'Admin'}</p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </button>

                        {showUserMenu && !collapsedSidebar && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded-xl shadow-lg border border-gray-600 py-2">

                                <button
                                    onClick={logOut}
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-3 text-red-400" />
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <p className="text-sm font-semibold text-white">{customer?.username || 'Admin'}</p>
                        </button>
                        <button
                            onClick={logOut}
                            className="text-gray-600 hover:text-red-600 transition-colors flex items-center"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="ml-2">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children || (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến với hệ thống quản lý</h2>
                            <p className="text-gray-600">Chọn một mục từ menu bên trái để bắt đầu</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CRMLayout;