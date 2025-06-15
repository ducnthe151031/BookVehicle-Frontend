import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Lock, Edit, MapPin, Check } from 'lucide-react';
import { getProfile, updateProfile } from '../service/authentication.js';
import Header from './Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { customer, logOut } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phoneNumber: '',
        address: '',
        fullName: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProfile();
                if (data.httpStatus === 200) {
                    setProfile(data.data);
                    setFormData({
                        email: data.data.email || '',
                        phoneNumber: data.data.phoneNumber || '',
                        address: data.data.address || '',
                        fullName: data.data.fullName || ''
                    });
                } else {
                    setError('Không thể tải thông tin hồ sơ.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Có lỗi xảy ra khi tải hồ sơ.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(true);
        // Đảm bảo giữ giá trị hiện tại khi chuyển sang chế độ chỉnh sửa
        if (profile) {
            setFormData({
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                fullName: profile.fullName || ''
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const response = await updateProfile(formData);
            if (response.httpStatus === 200) {
                setProfile(response.data);
                setIsEditing(false);
                alert('Cập nhật hồ sơ thành công!');
            } else {
                setError('Cập nhật hồ sơ thất bại.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Có lỗi xảy ra khi cập nhật hồ sơ.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset formData về giá trị ban đầu từ profile
        if (profile) {
            setFormData({
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                fullName: profile.fullName || ''
            });
        }
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Không tìm thấy thông tin hồ sơ.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header logOut={logOut} handleChangePassword={handleChangePassword} customer={customer} />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Profile Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{profile.username}</h2>
                                <p className="text-sm text-gray-600">{profile.role || 'N/A'}</p>
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="space-y-2">
                                <button
                                    onClick={handleCancel}
                                    className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    <span>Hủy</span>
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    <Check className="w-5 h-5" />
                                    <span>Lưu</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleEditToggle}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <Edit className="w-5 h-5" />
                                <span>Sửa hồ sơ</span>
                            </button>
                        )}
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin cá nhân</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                {isEditing ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><Mail className="w-4 h-4 inline mr-2" />Email: {profile.email || 'Chưa cập nhật'}</p>
                                        <p><Lock className="w-4 h-4 inline mr-2" />Số điện thoại: {profile.phoneNumber || 'Chưa cập nhật'}</p>
                                        <p><MapPin className="w-4 h-4 inline mr-2" />Địa chỉ: {profile.address || 'Chưa cập nhật'}</p>
                                    </>
                                )}
                                <p><Calendar className="w-4 h-4 inline mr-2" />Ngày tạo: {new Date(profile.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p><User className="w-4 h-4 inline mr-2" />Họ và tên: {profile.fullName || 'Chưa cập nhật'}</p>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Trạng thái tài khoản</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>Đã kích hoạt: {profile.enabled ? 'Có' : 'Không'}</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;