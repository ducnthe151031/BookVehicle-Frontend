import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Lock, Edit, MapPin, Check, Upload, FileText } from 'lucide-react';
import { getProfile, updateProfile } from '../service/authentication.js';
import Header from './Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CRMLayout from "./Crm.jsx";
const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { customer, logOut } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // State for form data, including Base64 strings for new files or existing filenames
    const [formData, setFormData] = useState({
        email: '',
        phoneNumber: '',
        address: '',
        fullName: '',
        avartarUrl: '', // Add avatar field
        citizenIdCardUrl: '', // Will hold Base64 for new file, or filename for existing
        driverLicenseUrl: '', // Will hold Base64 for new file, or filename for existing
    });

    // State for temporary image preview URLs (for newly selected files)
    const [tempAvatarPreviewUrl, setTempAvatarPreviewUrl] = useState(null);
    const [tempCccdPreviewUrl, setTempCccdPreviewUrl] = useState(null);
    const [tempLicensePreviewUrl, setTempLicensePreviewUrl] = useState(null);

    // Helper to construct the full URL for displaying images from backend filename
    const getFullImageUrl = (filename) => {
        if (!filename || filename === 'Chưa cập nhật') return null;
        // Construct the full URL using your backend's image serving endpoint
        return `http://localhost:8080/v1/user/images/${filename}`;
    };

    // Helper to get display name (filename or "Chưa cập nhật")
    const getDisplayName = (filename) => {
        if (filename && filename !== 'Chưa cập nhật') {
            try {
                const urlObj = new URL(filename); // Try parsing as URL
                const pathParts = urlObj.pathname.split('/');
                return pathParts[pathParts.length - 1];
            } catch (e) {
                return filename; // Not a URL, assume it's already a filename
            }
        }
        return 'Chưa cập nhật';
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProfile();
                if (data.httpStatus === 200) {
                    setProfile(data.data);
                    // Populate formData with existing profile data
                    setFormData({
                        email: data.data.email || '',
                        phoneNumber: data.data.phoneNumber || '',
                        address: data.data.address || '',
                        fullName: data.data.fullName || '',
                        avartarUrl: data.data.avartarUrl || '', // Load avatar filename
                        citizenIdCardUrl: data.data.citizenIdCardUrl || '', // Will be a filename (e.g., "abc.png")
                        driverLicenseUrl: data.data.driverLicenseUrl || '', // Will be a filename (e.g., "xyz.png")
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
        // Ensure formData reflects current profile data when entering edit mode
        if (profile) {
            setFormData({
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                fullName: profile.fullName || '',
                avartarUrl: profile.avartarUrl || '', // Load avatar filename
                citizenIdCardUrl: profile.citizenIdCardUrl || '', // Load existing filename
                driverLicenseUrl: profile.driverLicenseUrl || '', // Load existing filename
            });
        }
        // Clear any temporary preview URLs when entering edit mode, to show current saved files
        if (tempAvatarPreviewUrl) URL.revokeObjectURL(tempAvatarPreviewUrl);
        setTempAvatarPreviewUrl(null);
        if (tempCccdPreviewUrl) URL.revokeObjectURL(tempCccdPreviewUrl);
        setTempCccdPreviewUrl(null);
        if (tempLicensePreviewUrl) URL.revokeObjectURL(tempLicensePreviewUrl);
        setTempLicensePreviewUrl(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNumber") {
            // Only allow digits, max 10 chars
            if (/^\d*$/.test(value) && value.length <= 10) {
                // Validate starts with 0 and 9 or 10 digits
                if (value === "" || /^0\d{0,9}$/.test(value)) {
                    setFormData(prev => ({ ...prev, [name]: value }));
                }
            }
        } else if (name === "email") {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Avatar change handler (identical to Profile.jsx)
    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setFormData(prev => ({ ...prev, avartarUrl: base64String }));
            };
            reader.readAsDataURL(file);
            if (tempAvatarPreviewUrl) URL.revokeObjectURL(tempAvatarPreviewUrl);
            setTempAvatarPreviewUrl(URL.createObjectURL(file));
        } else {
            setFormData(prev => ({ ...prev, avartarUrl: '' }));
            if (tempAvatarPreviewUrl) {
                URL.revokeObjectURL(tempAvatarPreviewUrl);
                setTempAvatarPreviewUrl(null);
            }
        }
    };

    // Handler for file input changes (reads file as Base64 and creates preview URL)
    const handleFileInputChange = (e, fieldName) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1]; // Get only the Base64 part
                setFormData(prev => ({ ...prev, [fieldName]: base64String }));
            };
            reader.readAsDataURL(file); // Read the file as a Data URL (Base64)

            // Create a temporary URL for image preview
            if (fieldName === 'avartarUrl') {
                if (tempAvatarPreviewUrl) URL.revokeObjectURL(tempAvatarPreviewUrl); // Clean up old preview URL
                setTempAvatarPreviewUrl(URL.createObjectURL(file));
            } else if (fieldName === 'citizenIdCardUrl') {
                if (tempCccdPreviewUrl) URL.revokeObjectURL(tempCccdPreviewUrl); // Clean up old preview URL
                setTempCccdPreviewUrl(URL.createObjectURL(file));
            } else if (fieldName === 'driverLicenseUrl') {
                if (tempLicensePreviewUrl) URL.revokeObjectURL(tempLicensePreviewUrl); // Clean up old preview URL
                setTempLicensePreviewUrl(URL.createObjectURL(file));
            }
        } else {
            // If file input is cleared
            setFormData(prev => ({ ...prev, [fieldName]: '' }));
            if (fieldName === 'avartarUrl' && tempAvatarPreviewUrl) {
                URL.revokeObjectURL(tempAvatarPreviewUrl);
                setTempAvatarPreviewUrl(null);
            } else if (fieldName === 'citizenIdCardUrl' && tempCccdPreviewUrl) {
                URL.revokeObjectURL(tempCccdPreviewUrl);
                setTempCccdPreviewUrl(null);
            } else if (fieldName === 'driverLicenseUrl' && tempLicensePreviewUrl) {
                URL.revokeObjectURL(tempLicensePreviewUrl);
                setTempLicensePreviewUrl(null);
            }
        }
    };

    // Update the handleSubmit function in Profile.jsx
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate phone number
        if (!/^0\d{8,9}$/.test(formData.phoneNumber)) {
            toast.error("Số điện thoại phải bắt đầu bằng 0 và có 9 hoặc 10 số!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        // Validate email
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            toast.error("Email không hợp lệ!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await updateProfile(formData);
            if (response.httpStatus === 200) {
                setProfile(response.data);
                setFormData({
                    email: response.data.email || '',
                    phoneNumber: response.data.phoneNumber || '',
                    address: response.data.address || '',
                    fullName: response.data.fullName || '',
                    avartarUrl: response.data.avartarUrl || '',
                    citizenIdCardUrl: response.data.citizenIdCardUrl || '',
                    driverLicenseUrl: response.data.driverLicenseUrl || '',
                });
                setIsEditing(false);
                if (tempAvatarPreviewUrl) URL.revokeObjectURL(tempAvatarPreviewUrl);
                setTempAvatarPreviewUrl(null);
                if (tempCccdPreviewUrl) URL.revokeObjectURL(tempCccdPreviewUrl);
                setTempCccdPreviewUrl(null);
                if (tempLicensePreviewUrl) URL.revokeObjectURL(tempLicensePreviewUrl);
                setTempLicensePreviewUrl(null);
                toast.success('Cập nhật hồ sơ thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.error('Cập nhật hồ sơ thất bại.', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi cập nhật hồ sơ.');
            toast.error(error.response?.data?.message, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        // Reset formData to original profile values
        if (profile) {
            setFormData({
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                fullName: profile.fullName || '',
                avartarUrl: profile.avartarUrl || '', // Reset avatar
                citizenIdCardUrl: profile.citizenIdCardUrl || '',
                driverLicenseUrl: profile.driverLicenseUrl || '',
            });
        }
        // Clean up any unsaved temporary preview URLs
        if (tempAvatarPreviewUrl) URL.revokeObjectURL(tempAvatarPreviewUrl);
        setTempAvatarPreviewUrl(null);
        if (tempCccdPreviewUrl) URL.revokeObjectURL(tempCccdPreviewUrl);
        setTempCccdPreviewUrl(null);
        if (tempLicensePreviewUrl) URL.revokeObjectURL(tempLicensePreviewUrl);
        setTempLicensePreviewUrl(null);
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Profile Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                                {isEditing ? (
                                    tempAvatarPreviewUrl ? (
                                        <img src={tempAvatarPreviewUrl} alt="Avatar Preview" className="w-full h-full rounded-full object-cover" />
                                    ) : formData.avartarUrl && formData.avartarUrl.length > 50 ? (
                                        <img src={"data:image/*;base64," + formData.avartarUrl} alt="Avatar Preview" className="w-full h-full rounded-full object-cover" />
                                    ) : profile.avartarUrl ? (
                                        <img src={getFullImageUrl(profile.avartarUrl)} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-gray-400" />
                                    )
                                ) : (
                                    profile.avartarUrl ? (
                                        <img src={getFullImageUrl(profile.avartarUrl)} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-gray-400" />
                                    )
                                )}
                                {isEditing && (
                                    <>
                                        <input
                                            type="file"
                                            id="avatarFile"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                        <label
                                            htmlFor="avatarFile"
                                            className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1 cursor-pointer"
                                        >
                                            Thay đổi
                                        </label>
                                    </>
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
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
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

                        {/* Document Uploads */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin giấy tờ</h3>
                            <div className="space-y-4 text-sm text-gray-600">
                                {isEditing ? (
                                    <>
                                        {/* CCCD Upload */}
                                        <div>
                                            <label htmlFor="cccdFile" className="block text-sm font-medium text-gray-700 mb-1">
                                                Căn cước công dân:
                                            </label>
                                            <input
                                                type="file"
                                                id="cccdFile"
                                                className="hidden"
                                                onChange={(e) => handleFileInputChange(e, 'citizenIdCardUrl')}
                                                accept="image/*,.pdf"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('cccdFile').click()}
                                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                {/* Display "Đã chọn tệp mới" if new file, else filename */}
                                                {(formData.citizenIdCardUrl && formData.citizenIdCardUrl.length > 50) ? 'Đã chọn tệp mới' : getDisplayName(profile.citizenIdCardUrl)}
                                            </button>
                                            {/* Image Preview for CCCD */}
                                            {(tempCccdPreviewUrl || (profile.citizenIdCardUrl && !formData.citizenIdCardUrl.includes('data:image'))) && (
                                                <div className="mt-2 text-center">
                                                    <img
                                                        src={tempCccdPreviewUrl || getFullImageUrl(profile.citizenIdCardUrl)}
                                                        alt="CCCD Preview"
                                                        className="max-w-full h-auto max-h-32 object-contain border rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            {!tempCccdPreviewUrl && !profile.citizenIdCardUrl && (
                                                <p className="text-xs text-gray-500 mt-1">Chưa có tệp nào được chọn.</p>
                                            )}
                                        </div>

                                        {/* Driver's License Upload */}
                                        <div>
                                            <label htmlFor="licenseFile" className="block text-sm font-medium text-gray-700 mb-1">
                                                Giấy phép lái xe:
                                            </label>
                                            <input
                                                type="file"
                                                id="licenseFile"
                                                className="hidden"
                                                onChange={(e) => handleFileInputChange(e, 'driverLicenseUrl')}
                                                accept="image/*,.pdf"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('licenseFile').click()}
                                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                {/* Display "Đã chọn tệp mới" if new file, else filename */}
                                                {(formData.driverLicenseUrl && formData.driverLicenseUrl.length > 50) ? 'Đã chọn tệp mới' : getDisplayName(profile.driverLicenseUrl)}
                                            </button>
                                            {/* Image Preview for License */}
                                            {(tempLicensePreviewUrl || (profile.driverLicenseUrl && !formData.driverLicenseUrl.includes('data:image'))) && (
                                                <div className="mt-2 text-center">
                                                    <img
                                                        src={tempLicensePreviewUrl || getFullImageUrl(profile.driverLicenseUrl)}
                                                        alt="License Preview"
                                                        className="max-w-full h-auto max-h-32 object-contain border rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            {!tempLicensePreviewUrl && !profile.driverLicenseUrl && (
                                                <p className="text-xs text-gray-500 mt-1">Chưa có tệp nào được chọn.</p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 flex-shrink-0" />
                                            <span>Căn cước công dân:</span>
                                            {profile.citizenIdCardUrl ? (
                                                <a href={getFullImageUrl(profile.citizenIdCardUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    <img
                                                        src={getFullImageUrl(profile.citizenIdCardUrl)}
                                                        alt="CCCD"
                                                        className="w-24 h-auto object-contain inline-block ml-2 border rounded"
                                                    />
                                                </a>
                                            ) : (
                                                <span className="ml-1 text-gray-500">Chưa cập nhật</span>
                                            )}
                                        </p>
                                        <p className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 flex-shrink-0" />
                                            <span>Giấy phép lái xe:</span>
                                            {profile.driverLicenseUrl ? (
                                                <a href={getFullImageUrl(profile.driverLicenseUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    <img
                                                        src={getFullImageUrl(profile.driverLicenseUrl)}
                                                        alt="License"
                                                        className="w-24 h-auto object-contain inline-block ml-2 border rounded"
                                                    />
                                                </a>
                                            ) : (
                                                <span className="ml-1 text-gray-500">Chưa cập nhật</span>
                                            )}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Account Status */}

                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileForAdmin = () => (
    <CRMLayout>
        <Profile/>
    </CRMLayout>
);

export default ProfileForAdmin;

