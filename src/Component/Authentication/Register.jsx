import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../service/authentication.js';
import {Eye, EyeOff, Loader2} from 'lucide-react';
import {toast} from "react-toastify";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            toast.error('Email không hợp lệ!', { position: "top-right", autoClose: 3000 });
            return false;
        }

        if (formData.username.length > 50) {
            toast.error('Tên người dùng không được vượt quá 50 ký tự!', { position: "top-right", autoClose: 3000 });
            return false;
        }

        if (formData.password.length > 50) {
            toast.error('Mật khẩu không được vượt quá 50 ký tự!', { position: "top-right", autoClose: 3000 });
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu và Nhập lại mật khẩu không khớp!', { position: "top-right", autoClose: 3000 });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) return;

        try {
            setLoading(true);
            await register(formData);
            toast.success('Vui lòng check email để kích hoạt tài khoản!', { position: "top-right", autoClose: 3000 });
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            const apiMessage = error.response?.data?.message || 'Lỗi đăng ký!';
            toast.error(apiMessage, { position: "top-right", autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col px-4 py-6">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-10 ml-6">
                <img
                    src="https://media.istockphoto.com/id/1273534607/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-xe-h%C6%A1i-xe-t%E1%BB%B1-%C4%91%E1%BB%99ng-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-giao-th%C3%B4ng-h%C3%ACnh-b%C3%B3ng-%C3%B4-t%C3%B4-ph%C3%ADa-tr%C6%B0%E1%BB%9Bc-xe.jpg?s=170667a&w=0&k=20&c=sutyUnshIYhDrjuMc_qmwp9obZxzN-o-_bB9ci4v0uk="
                    alt="car icon"
                    className="w-6 h-6"
                />
                <span className="text-lg font-semibold text-black">Thuê Xe</span>
            </div>

            {/* Nội dung form + ảnh */}
            <div className="flex flex-col md:flex-row items-center justify-center flex-grow gap-10">
                {/* Form */}
                <div className="bg-white border rounded-xl shadow-md p-10 w-[500px] min-h-[500px]">
                    <h2 className="text-xl font-medium text-gray-600">Chào mừng</h2>
                    <h1 className="text-3xl font-bold mb-6">Đăng kí</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Nhập email của bạn"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Tên người dùng</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Nhập tên của bạn"
                                value={formData.username}
                                onChange={handleChange}
                                maxLength={50}
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
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                    maxLength={50}
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

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nhập lại mật khẩu</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    maxLength={50}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute top-2 right-3 text-gray-500"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        {/* Role Selection Dropdown */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Vai trò</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="USER">Người dùng</option>
                                <option value="OWNER">Chủ xe</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 font-semibold flex items-center justify-center disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Đăng kí'
                            )}
                        </button>
                    </form>

                    {message && <p className="text-sm text-red-500 text-center mt-4">{message}</p>}

                    <p className="mt-6 text-center text-sm text-gray-700">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-black font-medium hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </div>

                {/* Ảnh mô tô */}
                <div className="mt-10 md:mt-0">
                    <img
                        src="https://img1.xcarimg.com/PicLib/s/s13683_420.jpg"
                        alt="Motorbike"
                        className="w-[420px] h-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
