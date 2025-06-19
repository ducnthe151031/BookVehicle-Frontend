import React, { useState } from 'react';
import {
    Building2, Menu, Users, DollarSign, Search,
    BarChart2, MessageSquare, Calendar, Settings,
    Home, UserPlus, FileText, Bell, ChevronDown,
    Layout, Package, CheckCircle, Phone, Mail,
    Plus, Filter, MoreHorizontal, ArrowRight, X,
    LogOut, User, Car
} from 'lucide-react';
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import BookingForm from "./BookingForm.jsx";

const Unauthorized = () => (




    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
            <p className="text-gray-600 mb-6">Bạn không có quyền để truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.</p>
            <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Quay lại trang chủ
            </button>
        </div>
    </div>
);

const CRMLayout = ({ children }) => {
    const [collapsedSidebar, setCollapsedSidebar] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const { logOut, customer } = useAuth();
    const navigate = useNavigate();

    const navigation = [


        // { name: 'Đơn đặt xe', icon: FileText, path: '/vehicle/bookings', roles: ['ROLE_ADMIN'] },

        { name: 'Hãng xe', icon: Building2, path: '/vehicle/brands', roles: ['ROLE_ADMIN'] },
        { name: 'Loại xe', icon: Building2, path: '/vehicle/categories', roles: ['ROLE_ADMIN'] },
        { name: 'Danh sách xe', icon: Car, path: '/vehicle', roles: ['ROLE_ADMIN'] },
        { name: 'Danh sách thuê xe', icon: Car, path: '/rentals', roles: ['ROLE_ADMIN'] },
    ];

    const filteredNavigation = navigation.filter(
        (item) => !item.roles || item.roles.includes(customer?.role)
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
                                <h1 className="font-bold text-lg text-white">Thuê Xe</h1>

        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
            {/* Sidebar */}
            <div className={`${
                collapsedSidebar ? 'w-20' : 'w-72'
            } bg-white/80 backdrop-blur-lg border-r border-gray-200/50 flex flex-col transition-all duration-300 shadow-xl`}>

                {/* Logo Section */}
                <div className="h-20 border-b border-gray-200/50 flex items-center justify-between px-6">
                    {!collapsedSidebar && (
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Car className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-3">
                                <h1 className="font-bold text-xl text-gray-900">CarRental</h1>
                                <p className="text-xs text-gray-500">Management System</p>

                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsedSidebar(!collapsedSidebar)}

                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                    >
                        <Menu className="h-5 w-5 text-gray-300" />

                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors group"
                    >
                        <Menu className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />

                    </button>
                </div>

                {/* Navigation */}

                <nav className="flex-1 p-4 space-y-2">


                <nav className="flex-1 p-4 space-y-1">

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

                            } py-3 rounded-xl transition-all duration-200 group ${
                                location.pathname === item.path
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${
                                location.pathname === item.path ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                            } ${collapsedSidebar ? '' : 'mr-3'}`} />
                            {!collapsedSidebar && (
                                <span className="font-medium text-sm">{item.name}</span>
                            )}
                            {!collapsedSidebar && location.pathname === item.path && (
                                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User Menu */}
                <div className="p-4 border-t border-gray-200/50">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">

                                <User className="w-4 h-4 text-white" />
                            </div>
                            {!collapsedSidebar && (
                                <>
                                    <div className="ml-3 text-left flex-1">

                                        <p className="text-sm font-semibold text-white">{customer?.username || 'Admin'}</p>
                                        <p className="text-xs text-gray-400">Admin</p>

                                        <p className="text-sm font-semibold text-gray-900">{customer?.username}</p>
                                        <p className="text-xs text-gray-500">Administrator</p>

                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </button>


                        {showUserMenu && !collapsedSidebar && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded-xl shadow-lg border border-gray-600 py-2">
                                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors">
                                    <User className="w-4 h-4 mr-3 text-gray-400" />
                                    Hồ sơ cá nhân
                                </button>
                                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors">
                                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                                    Cài đặt
                                </button>
                                <hr className="my-2 border-gray-600" />
                                <button
                                    onClick={logOut}
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-3 text-red-400" />

                        {/* User Dropdown */}
                        {showUserMenu && !collapsedSidebar && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <User className="w-4 h-4 mr-3 text-gray-400" />
                                    Hồ sơ cá nhân
                                </button>
                                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                                    Cài đặt
                                </button>
                                <hr className="my-2 border-gray-100" />
                                <button
                                    onClick={logOut}
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-3 text-red-500" />

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

                <header className="h-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center">
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Quick Actions */}
                        <div className="flex items-center space-x-2">
                            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                <a href="/home" className="flex items-center space-x-2">
                                    <Home className="w-4 h-4" />
                                    <span>Trang chủ</span>
                                </a>
                            </button>

                            <div className="w-px h-6 bg-gray-300"></div>

                            <button
                                onClick={logOut}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors flex items-center space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>

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

                <main className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        {children || (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến với hệ thống quản lý</h2>
                                <p className="text-gray-600">Chọn một mục từ menu bên trái để bắt đầu</p>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default CRMLayout;