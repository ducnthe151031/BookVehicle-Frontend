import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../service/authentication.js';
import { Mail, User, Loader2 } from 'lucide-react';
import {toast} from "react-toastify";

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.username) {
            setMessage('Vui lòng nhập cả email và username.');
            toast.error('Vui lòng nhập cả email và username.', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        try {
            setLoading(true);
            setMessage('');
            const response = await forgotPassword(formData);
            if (response.httpStatus === 200) {
                toast.success('Yêu cầu quên mật khẩu đã được gửi. Vui lòng kiểm tra email!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(response.message || 'Gửi yêu cầu thất bại!', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message, {
                position: "top-right",
                autoClose: 3000,
            });
            console.error('Forgot password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col px-4 py-6">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-10 ml-6">
                <img src="https://media.istockphoto.com/id/1273534607/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-xe-h%C6%A1i-xe-t%E1%BB%B1-%C4%91%E1%BB%99ng-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-giao-th%C3%B4ng-h%C3%ACnh-b%C3%B3ng-%C3%B4-t%C3%B4-ph%C3%ADa-tr%C6%B0%E1%BB%9Bc-xe.jpg?s=170667a&w=0&k=20&c=sutyUnshIYhDrjuMc_qmwp9obZxzN-o-_bB9ci4v0uk=" alt="car icon" className="w-6 h-6" />
                <span className="text-lg font-semibold text-black">Thuê Xe</span>
            </div>

            {/* Nội dung form + ảnh */}
            <div className="flex flex-col md:flex-row items-center justify-center flex-grow gap-10">
                {/* Form */}
                <div className="bg-white border rounded-xl shadow-md p-10 w-[500px] min-h-[500px]">
                    <h2 className="text-xl font-medium text-gray-600">Khôi phục mật khẩu</h2>
                    <h1 className="text-3xl font-bold mb-6">Quên mật khẩu</h1>

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
                                placeholder="Nhập username của bạn"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 font-semibold flex items-center justify-center disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                'Gửi yêu cầu'
                            )}
                        </button>
                    </form>

                    {message && (
                        <p className={`text-sm text-center mt-4 ${message.includes('thành công') || message.includes('kiểm tra email') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                    <p className="mt-6 text-center text-sm text-gray-700">
                        Bạn đã có tài khoản?{' '}
                        <button onClick={() => navigate('/login')} className="text-black font-medium hover:underline">
                            Đăng nhập
                        </button>
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
            </div>
        </div>
    );
};

export default ForgotPassword;
