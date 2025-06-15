import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../../service/authentication.js';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        token: searchParams.get('token') || '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setFormData(prev => ({ ...prev, token: searchParams.get('token') || '' }));
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword) {
            setMessage('Mật khẩu mới và xác nhận phải khớp và không được để trống.');
            return;
        }
        try {
            setLoading(true);
            setMessage('');
            const response = await resetPassword(formData);
            if (response.httpStatus === 200) {
                setMessage('Mật khẩu đã được đặt lại thành công!');
                setTimeout(() => navigate('/login'), 2000); // Quay lại đăng nhập sau 2 giây
            } else {
                setMessage(response.message || 'Đặt lại mật khẩu thất bại!');
            }
        } catch (error) {
            setMessage('Có lỗi xảy ra, vui lòng thử lại!');
            console.error('Reset password error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/login');
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-end"
            style={{ backgroundImage: "url('https://www.cupraofficial.com.au/content/dam/public/cupra-website/cars/tavascan/automatic-gallery/x-large/atacama-desert-2024-cupra-tavascan-car.jpg')" }}
        >
            <div className="bg-black bg-opacity-60 p-8 rounded-xl shadow-xl w-full max-w-sm mr-16 text-white">
                <h2 className="text-2xl font-bold text-center text-orange-400 mb-6">Đặt lại mật khẩu</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center">
                        <Lock className="w-5 h-5 text-gray-300 mr-2" />
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <div className="flex items-center">
                        <Lock className="w-5 h-5 text-gray-300 mr-2" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Xác nhận mật khẩu mới"
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
                            'Đặt lại mật khẩu'
                        )}
                    </button>
                </form>
                {message && <p className="text-sm text-center mt-3 text-red-400">{message}</p>}
                <p className="mt-6 text-sm text-center text-gray-200">
                    <button
                        onClick={handleBack}
                        className="text-orange-400 font-medium hover:underline"
                    >
                        Quay lại đăng nhập
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;