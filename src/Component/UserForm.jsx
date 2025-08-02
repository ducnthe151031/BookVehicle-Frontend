import React, { useState } from 'react';
import { createUser } from '../service/authentication.js';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const UserForm = ({ onClose, onSuccess, initialData, isEditMode }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: initialData?.username || '',
        email: initialData?.email || '',
        password: '',
        confirmPassword: '',
        role: initialData?.role || 'USER',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); //
        if (loading) return; //

        setError('');

        // Validate password and confirmPassword
        if (!isEditMode && formData.password !== formData.confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp');
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                // Exclude password fields for edit mode unless explicitly changed
                const updateData = {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                };
                await updateUser(initialData.id, updateData);
                toast.success('Cập nhật người dùng thành công!');
            } else {
                await createUser(formData);
                toast.success('Thêm người dùng thành công!');
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
            toast.error('Thao tác thất bại: ' + (err.response?.data?.message || 'Có lỗi xảy ra'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {error && <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                    aria-label="Email"
                />
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-600">Tên đăng nhập</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                    disabled={isEditMode}
                    aria-label="Tên đăng nhập"
                />
            </div>
            {!isEditMode && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                aria-label="Mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-2 right-3 text-gray-500"
                                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                aria-label="Nhập lại mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute top-2 right-3 text-gray-500"
                                aria-label={showConfirmPassword ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </>
            )}
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-600">Vai trò</label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    aria-label="Vai trò"
                >
                    <option value="USER">Người dùng</option>
                    <option value="OWNER">Chủ sở hữu</option>
                    <option value="OPERATOR">Nhân viên</option>
                    <option value="ADMIN">Quản trị viên</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                    aria-label="Hủy"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    aria-label={'Thêm'}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-r-2"></div>
                            Đang xử lý...
                        </div>
                    ) : (
                        isEditMode ? 'Cập nhật' : 'Thêm'
                    )}

                </button>
            </div>
        </form>
    );
};

export default UserForm;