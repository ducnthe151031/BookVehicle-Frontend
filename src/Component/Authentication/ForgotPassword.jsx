import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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