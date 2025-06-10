import React, { useState, useEffect } from 'react';
import { Car, MapPin, Calendar, DollarSign, Fuel, Settings, Users, Tag, Building, FileText, Plus, X } from 'lucide-react';
import CRMLayout from "./Crm.jsx";
import { createCar, getBrands } from "../service/authentication.js";

const CarForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        minimum_age: '',
        daily_price: '',
        type: 'Gasoline',
        gearbox: 'Automatic',
        seats: '',
        category: '',
        brand: '', // Default to empty string for select
        licensePlate: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [brands, setBrands] = useState([]); // State to store brand options

    // Fetch brand list from API
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await getBrands();
                if (data.httpStatus === 200) {
                    // Remove duplicates based on name using Map
                    const uniqueBrands = [...new Map(data.data.map(item => [item.name, item])).values()];
                    setBrands(uniqueBrands);
                } else {
                    setMessage('Lỗi khi tải danh sách hãng xe.');
                }
            } catch (error) {
                setMessage('Không thể kết nối đến server để lấy danh sách hãng xe.');
            }
        };

        fetchBrands();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        // Tên xe
        if (!formData.name.trim()) {
            newErrors.name = 'Tên xe không được để trống';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Tên xe phải có ít nhất 3 ký tự';
        }

        // Địa điểm
        if (!formData.location.trim()) {
            newErrors.location = 'Địa điểm không được để trống';
        }

        // Độ tuổi xe
        if (!formData.minimum_age) {
            newErrors.minimum_age = 'Độ tuổi xe không được để trống';
        } else if (formData.minimum_age < 0 || formData.minimum_age > 50) {
            newErrors.minimum_age = 'Độ tuổi xe phải từ 0-50 năm';
        }

        // Giá thuê
        if (!formData.daily_price) {
            newErrors.daily_price = 'Giá thuê không được để trống';
        } else if (formData.daily_price < 100000) {
            newErrors.daily_price = 'Giá thuê phải từ 100,000 VNĐ trở lên';
        }

        // Số chỗ ngồi
        if (!formData.seats) {
            newErrors.seats = 'Số chỗ ngồi không được để trống';
        } else if (formData.seats < 2 || formData.seats > 50) {
            newErrors.seats = 'Số chỗ ngồi phải từ 2-50 chỗ';
        }

        // Phân loại xe
        if (!formData.category) {
            newErrors.category = 'Vui lòng chọn phân loại xe';
        }

        // Biển số xe
        if (formData.licensePlate && !/^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$/.test(formData.licensePlate)) {
            newErrors.licensePlate = 'Biển số xe không đúng định dạng (VD: 30A-12345)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            setMessage('Vui lòng kiểm tra lại thông tin đã nhập vào');
            return;
        }

        try {
            const payload = {
                ...formData,
                minimum_age: Number(formData.minimum_age),
                daily_price: Number(formData.daily_price),
                seats: Number(formData.seats),
            };

            await createCar(payload);

            setMessage('Tạo xe thành công!');
            setFormData({
                name: '',
                location: '',
                minimum_age: '',
                daily_price: '',
                type: 'Gasoline',
                gearbox: 'Automatic',
                seats: '',
                category: '',
                brand: '', // Reset to empty string
                licensePlate: '',
                description: '',
            });
            setErrors({});
            if (onSuccess) onSuccess(); // Trigger success callback to reload and close
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi tạo xe.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Thông tin xe
                        </h2>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 focus:outline-none"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tên xe */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Car className="w-4 h-4 inline mr-2" />
                                    Tên xe
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nhập tên xe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Địa điểm */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Địa điểm
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Địa điểm của xe"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                            </div>

                            {/* Độ tuổi xe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Độ tuổi xe (năm)
                                </label>
                                <input
                                    type="number"
                                    name="minimum_age"
                                    placeholder="Độ tuổi của xe"
                                    value={formData.minimum_age}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="50"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.minimum_age ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.minimum_age && <p className="mt-1 text-sm text-red-600">{errors.minimum_age}</p>}
                            </div>

                            {/* Giá thuê */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-2" />
                                    Giá thuê theo ngày (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    name="daily_price"
                                    placeholder="Giá thuê theo ngày"
                                    value={formData.daily_price}
                                    onChange={handleChange}
                                    required
                                    min="100000"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.daily_price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.daily_price && <p className="mt-1 text-sm text-red-600">{errors.daily_price}</p>}
                            </div>

                            {/* Số chỗ ngồi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Users className="w-4 h-4 inline mr-2" />
                                    Số chỗ ngồi
                                </label>
                                <input
                                    type="number"
                                    name="seats"
                                    placeholder="Số chỗ ngồi"
                                    value={formData.seats}
                                    onChange={handleChange}
                                    required
                                    min="2"
                                    max="50"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.seats ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.seats && <p className="mt-1 text-sm text-red-600">{errors.seats}</p>}
                            </div>

                            {/* Loại nhiên liệu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Fuel className="w-4 h-4 inline mr-2" />
                                    Loại nhiên liệu
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                                >
                                    <option value="Diesel">Diesel</option>
                                    <option value="Gasoline">Xăng</option>
                                    <option value="Electric">Điện</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="PlugInHybrid">Plug-in Hybrid</option>
                                    <option value="Unknown">Không rõ</option>
                                </select>
                            </div>

                            {/* Hộp số */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Settings className="w-4 h-4 inline mr-2" />
                                    Hộp số
                                </label>
                                <select
                                    name="gearbox"
                                    value={formData.gearbox}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                                >
                                    <option value="Manual">Số sàn</option>
                                    <option value="Automatic">Số tự động</option>
                                </select>
                            </div>

                            {/* Phân loại xe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-2" />
                                    Phân loại xe
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white ${
                                        errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Chọn phân loại xe</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Coupe">Coupe</option>
                                    <option value="Convertible">Convertible</option>
                                    <option value="Pickup">Pickup</option>
                                    <option value="Van">Van</option>
                                    <option value="Crossover">Crossover</option>
                                    <option value="Wagon">Wagon</option>
                                    <option value="Minivan">Minivan</option>
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                            </div>

                            {/* Hãng xe (Updated to select) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building className="w-4 h-4 inline mr-2" />
                                    Hãng xe
                                </label>
                                <select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                                >
                                    <option value="">Chọn hãng xe</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.name}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Biển số xe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-2" />
                                    Biển số xe
                                </label>
                                <input
                                    type="text"
                                    name="licensePlate"
                                    placeholder="VD: 30A-12345"
                                    value={formData.licensePlate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.licensePlate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.licensePlate && <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>}
                            </div>

                            {/* Mô tả */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    Mô tả thêm
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Mô tả thêm về xe, tình trạng, trang thiết bị..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                                />
                            </div>
                        </div>

                        {/* Submit and Cancel Buttons */}
                        <div className="mt-8 flex justify-end gap-4">
                            {onClose && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Hủy
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Tạo Xe
                            </button>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
                                message.includes('thành công')
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



export default CarForm;