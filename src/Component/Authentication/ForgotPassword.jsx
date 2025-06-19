import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPassword } from '../../service/authentication.js';
import { Mail, User, Loader2 } from 'lucide-react';

import { Mail, User, Loader2 } from 'lucide-react';
import { forgotPassword } from '../../service/authentication.js';


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
            return;
        }
        try {
            setLoading(true);
            setMessage('');
            const response = await forgotPassword(formData);
            if (response.httpStatus === 200) {
                setMessage('Yêu cầu quên mật khẩu đã được gửi. Vui lòng kiểm tra email!');

                setTimeout(() => navigate('/login'), 2000);

                setTimeout(() => navigate('/login'), 2000); // Quay lại màn đăng nhập sau 2 giây

            } else {
                setMessage(response.message || 'Gửi yêu cầu thất bại!');
            }
        } catch (error) {
            setMessage('Có lỗi xảy ra, vui lòng thử lại!');
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

        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-end"
            style={{ backgroundImage: "url('https://www.cupraofficial.com.au/content/dam/public/cupra-website/cars/tavascan/automatic-gallery/x-large/atacama-desert-2024-cupra-tavascan-car.jpg')" }}
        >
            <div className="bg-black bg-opacity-60 p-8 rounded-xl shadow-xl w-full max-w-sm mr-16 text-white">
                <h2 className="text-2xl font-bold text-center text-orange-400 mb-6">Quên mật khẩu</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-300 mr-2" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-300 mr-2" />
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nhập username của bạn"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Gửi yêu cầu'
                        )}
                    </button>
                </form>
                {message && <p className="text-sm text-center mt-3 text-red-400">{message}</p>}
                <p className="mt-6 text-sm text-center text-gray-200">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-orange-400 font-medium hover:underline"
                    >
                        Quay lại đăng nhập
                    </button>
                </p>

            </div>
        </div>
    );
};


export default ForgotPassword;



