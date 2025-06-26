import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.jsx";

import { Eye, EyeOff } from 'lucide-react';



const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await login(formData);
            setMessage('Đăng nhập thành công!');
            const userRole = response.decodedToken?.role;
            const redirectPath = userRole === 'ROLE_ADMIN' ? '/vehicle/brands' : '/home';
            setTimeout(() => navigate(redirectPath), 1000);

            const response = await login(formData); // Lấy phản hồi từ login
            setMessage('Đăng nhập thành công!');
            const userRole = response.decodedToken?.role;
            console.log('Role from login response:', userRole); // Debug role
            const redirectPath = userRole === 'ROLE_ADMIN' ? '/vehicle/brands' : '/home';
            setTimeout(() => {
                navigate(redirectPath);
            }, 1000);

        } catch (error) {
            const apiMessage = error.response?.data?.message || 'Đăng nhập thất bại, có lỗi xảy ra!';
            setMessage(apiMessage);
        }
    };

    return (

        <div className="min-h-screen bg-white flex flex-col px-4 py-6">
            {/* Logo trên cùng bên trái */}
            <div className="flex items-center space-x-2 mb-10 ml-6">
                <img src="https://media.istockphoto.com/id/1273534607/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-xe-h%C6%A1i-xe-t%E1%BB%B1-%C4%91%E1%BB%99ng-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-giao-th%C3%B4ng-h%C3%ACnh-b%C3%B3ng-%C3%B4-t%C3%B4-ph%C3%ADa-tr%C6%B0%E1%BB%9Bc-xe.jpg?s=170667a&w=0&k=20&c=sutyUnshIYhDrjuMc_qmwp9obZxzN-o-_bB9ci4v0uk=" alt="car icon" className="w-6 h-6" />
                <span className="text-lg font-semibold text-black">Thuê Xe</span>
            </div>

            {/* Nội dung form + ảnh */}
            <div className="flex flex-col md:flex-row items-center justify-center flex-grow gap-10">
                {/* Form */}
                <div className="bg-white border rounded-xl shadow-md p-10 w-[500px] min-h-[500px]">
                    <h2 className="text-xl font-medium text-gray-600">Chào mừng</h2>
                    <h1 className="text-3xl font-bold mb-6">Đăng nhập</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Tên người dùng</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Nhập tên của bạn"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Nhập mật khẩu của bạn"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-2 right-3 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="h-4 w-4" />
                                <span>Ghi nhớ</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm text-black hover:underline"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 font-semibold"
                        >
                            Đăng nhập
                        </button>
                    </form>

                    {message && <p className="text-sm text-red-500 text-center mt-4">{message}</p>}

                    <p className="mt-6 text-center text-sm text-gray-700">
                        Bạn không có tài khoản?{' '}
                        <Link to="/register" className="text-black font-medium hover:underline">
                            Đăng kí
                        </Link>
                    </p>
                </div>

                {/* Ảnh xe */}
                <div className="mt-10 md:mt-0">
                    <img
                        src="https://img1.xcarimg.com/PicLib/s/s13683_420.jpg"
                        alt="Car"
                        className="w-[420px] h-auto object-contain"
                    />
                </div>

        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-end"
            style={{ backgroundImage: "url('https://www.cupraofficial.com.au/content/dam/public/cupra-website/cars/tavascan/automatic-gallery/x-large/atacama-desert-2024-cupra-tavascan-car.jpg')" }}
        >
            <div className="bg-black bg-opacity-60 p-8 rounded-xl shadow-xl w-full max-w-sm mr-16 text-white">
                <h2 className="text-2xl font-bold text-center text-orange-400 mb-6">Đăng nhập</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Email hoặc Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Login
                    </button>
                </form>
                {message && <p className="text-sm text-center mt-3 text-red-400">{message}</p>}
                <p className="mt-6 text-sm text-center text-gray-200">

                    Không có tài khoản?{' '}

                    <Link to="/register" className="text-orange-400 font-medium hover:underline">
                        Đăng ký
                    </Link> đây

                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="text-orange-400 font-medium hover:underline mr-2"
                    >
                        Quên mật khẩu?
                    </button>
                    <br/>

                </p>

            </div>
        </div>
    );
};

export default LoginForm;