import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, ArrowLeft } from 'lucide-react';
import { changePassword } from '../service/authentication.js';
import Header from './Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { customer, logOut } = useAuth();
    const [formData, setFormData] = useState({
        email:  '',
        oldPassword: '',
        newPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.oldPassword || !formData.newPassword) {
            setError('Vui lòng nhập cả mật khẩu cũ và mật khẩu mới.');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await changePassword(formData);
            if (response.httpStatus === 200) {
                setSuccess(true);
                setTimeout(() => navigate('/profile'), 2000); // Redirect after 2 seconds
            } else {
                setError('Thay đổi mật khẩu thất bại. Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Có lỗi xảy ra khi thay đổi mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/profile');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header logOut={logOut} handleChangePassword={() => {}} customer={customer} />

            <div className="max-w-md mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={handleBack}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Quay lại</span>
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-900">Thay đổi mật khẩu</h1>
                        <div></div> {/* Placeholder for symmetry */}
                    </div>

                    {success ? (
                        <div className="text-center">
                            <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <p className="text-lg text-gray-900">Mật khẩu đã được thay đổi thành công!</p>
                            <p className="text-sm text-gray-600">Quay lại hồ sơ trong giây lát...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Nhập email"

                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu cũ</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mật khẩu cũ"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;