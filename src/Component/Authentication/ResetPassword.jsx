import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
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
        setFormData(prev => ({
            ...prev,
            token: searchParams.get('token') || ''
        }));
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
                setTimeout(() => navigate('/login'), 2000);
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

            {/* Nội dung chính */}
            <div className="flex flex-col md:flex-row items-center justify-center flex-grow gap-10">
                {/* Form */}
                <div className="bg-white border rounded-xl shadow-md p-10 w-[500px] min-h-[500px]">
                    <h2 className="text-xl font-medium text-gray-600">Đặt lại mật khẩu</h2>
                    <h1 className="text-3xl font-bold mb-6">Tạo mật khẩu mới</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Nhập mật khẩu mới"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Xác nhận mật khẩu mới"
                                value={formData.confirmPassword}
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
                                    Đang xử lý...
                                </>
                            ) : (
                                'Đặt lại mật khẩu'
                            )}
                        </button>
                    </form>

                    {message && (
                        <p className={`text-sm text-center mt-4 ${message.includes('thành công') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                    <p className="mt-6 text-center text-sm text-gray-700">
                        Quay lại{' '}
                        <button onClick={() => navigate('/login')} className="text-black font-medium hover:underline">
                            đăng nhập
                        </button>
                    </p>
                </div>

                {/* Ảnh minh họa */}
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

export default ResetPassword;
