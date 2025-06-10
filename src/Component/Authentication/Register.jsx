import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../service/authentication.js';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'OWNER',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await register(formData);
            setMessage('Đăng ký thành công!');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            const apiMessage = error.response?.data?.message || 'Lỗi đăng ký!';
            setMessage(apiMessage);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-end"
            style={{ backgroundImage: "url('https://www.cupraofficial.com.au/content/dam/public/cupra-website/cars/tavascan/automatic-gallery/x-large/atacama-desert-2024-cupra-tavascan-car.jpg')" }} // cập nhật đúng đường dẫn ảnh
        >
            <div className="bg-black bg-opacity-60 p-8 rounded-xl shadow-xl w-full max-w-sm mr-16 text-white">
                <h2 className="text-2xl font-bold text-center text-orange-400 mb-6">Đăng ký</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Tên người dùng"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
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
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Register
                    </button>
                </form>
                {message && <p className="text-sm text-center mt-3 text-red-400">{message}</p>}
                <p className="mt-6 text-sm text-center text-gray-200">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-orange-400 font-medium hover:underline">
                        Đăng nhập
                    </Link> đấy
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
