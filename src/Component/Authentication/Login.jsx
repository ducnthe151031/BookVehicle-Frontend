import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.jsx";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

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