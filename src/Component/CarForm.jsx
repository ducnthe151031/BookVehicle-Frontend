import React, { useState, useEffect } from 'react';
import { Car, MapPin, Calendar, DollarSign, Fuel, Settings, Users, Tag, Building, FileText, Plus, X } from 'lucide-react';
import CRMLayout from "./Crm.jsx";
import { createCar, updateVehicle } from "../service/authentication.js";

const CarForm = ({ onClose, onSuccess, initialData, isEditMode }) => {
    const [formData, setFormData] = useState({
        id: '', // Added for edit mode
        name: '',
        brand: '', // Using hardcoded ID
        category: '',
        type: 'Gasoline',
        seats: '',
        dailyPrice: '',
        hourlyPrice: '',
        licensePlate: '',
        description: '',
        gearbox: 'Automatic',
        location: '',
        vehicleTypeId: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    //  Hardcoded brands and categories
    const brands = [
        { id: '1', name: 'Toyota' },
        { id: '2', name: 'Honda' },
        { id: '3', name: 'Mazda' },
        { id: '4', name: 'VinFast' },
        { id: '5', name: 'Yamaha' }, // Added for Xe máy
    ];

    const categories = [
        { id: '1', name: 'Sedan' },
        { id: '2', name: 'SUV' },
        { id: '3', name: 'Hatchback' },
        { id: '4', name: 'Motorcycle' }, // Xe máy
        { id: '5', name: 'Coupe' },
    ];

    useEffect(() => {
        // Set initial data if in edit mode
        if (isEditMode && initialData) {
            setFormData({
                id: initialData.id || '',
                name: initialData.vehicleName || '',
                brand: initialData.branchId || '', // Assuming branchId is the brand ID
                category: initialData.categoryId || '',
                type: initialData.fuelType || 'Gasoline',
                seats: initialData.seatCount || '',
                dailyPrice: initialData.pricePerDay || '',
                hourlyPrice: initialData.pricePerHour || '',
                licensePlate: initialData.liecensePlate || '',
                description: initialData.description || '',
                gearbox: initialData.gearBox || 'Automatic',
                location: initialData.location || '',
                vehicleTypeId: initialData.vehicleTypeId || '',
            });
        }
    }, [isEditMode, initialData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Tên xe không được để trống';
        if (!formData.brand.trim()) newErrors.brand = 'Hãng xe không được để trống';
        if (!formData.category.trim()) newErrors.category = 'Phân loại xe không được để trống';
        if (!formData.type.trim()) newErrors.type = 'Loại nhiên liệu không được để trống';
        if (!formData.seats || formData.seats < 2 || formData.seats > 50) newErrors.seats = 'Số ghế phải từ 2-50';
        if (!formData.dailyPrice || formData.dailyPrice < 100000) newErrors.dailyPrice = 'Giá ngày phải từ 100,000 VNĐ';
        if (formData.hourlyPrice && formData.hourlyPrice < 10000) newErrors.hourlyPrice = 'Giá giờ phải từ 10,000 VNĐ';
        if (formData.licensePlate && !/^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$/.test(formData.licensePlate)) newErrors.licensePlate = 'Biển số không đúng định dạng (VD: 30A-12345)';
        if (!formData.location.trim()) newErrors.location = 'Địa điểm không được để trống';
        if (!formData.vehicleTypeId.trim()) newErrors.vehicleTypeId = 'Loại xe không được để trống';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            setMessage('Vui lòng kiểm tra lại thông tin nhập vào');
            return;
        }

        try {
            const payload = {
                id: formData.id, // Include id for update
                name: formData.name,
                brand: formData.brand, // Using brand ID
                category: formData.category,
                type: formData.type,
                seats: Number(formData.seats),
                dailyPrice: Number(formData.dailyPrice),
                hourlyPrice: formData.hourlyPrice ? Number(formData.hourlyPrice) : null,
                licensePlate: formData.licensePlate,
                description: formData.description,
                gearbox: formData.gearbox,
                location: formData.location,
                vehicleTypeId: formData.vehicleTypeId,
            };

            if (isEditMode && initialData) {
                await updateVehicle(initialData.id, payload);
                setMessage('Cập nhật xe thành công!');
            } else {
                await createCar(payload);
                setMessage('Tạo xe thành công!');
            }

            setFormData({
                id: '',
                name: '',
                brand: '',
                category: '',
                type: 'Gasoline',
                seats: '',
                dailyPrice: '',
                hourlyPrice: '',
                licensePlate: '',
                description: '',
                gearbox: 'Automatic',
                location: '',
                vehicleTypeId: '',
            });
            setErrors({});
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessage(error.response?.data?.message || (isEditMode ? 'Lỗi khi cập nhật xe' : 'Lỗi khi tạo xe'));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            {isEditMode ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
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
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Hãng xe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building className="w-4 h-4 inline mr-2" />
                                    Hãng xe
                                </label>
                                <select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white ${
                                        errors.brand ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Chọn hãng xe</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
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
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white ${
                                        errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Chọn phân loại</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                                >
                                    <option value="Diesel">Diesel</option>
                                    <option value="PETROL">Xăng</option>
                                    <option value="Electric">Điện</option>
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                            </div>

                            {/* Số ghế */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Users className="w-4 h-4 inline mr-2" />
                                    Số ghế
                                </label>
                                <input
                                    type="number"
                                    name="seats"
                                    value={formData.seats}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.seats ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.seats && <p className="mt-1 text-sm text-red-600">{errors.seats}</p>}
                            </div>

                            {/* Giá ngày */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-2" />
                                    Giá ngày (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    name="dailyPrice"
                                    value={formData.dailyPrice}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.dailyPrice ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.dailyPrice && <p className="mt-1 text-sm text-red-600">{errors.dailyPrice}</p>}
                            </div>

                            {/* Giá giờ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-2" />
                                    Giá giờ (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    name="hourlyPrice"
                                    value={formData.hourlyPrice}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.hourlyPrice ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.hourlyPrice && <p className="mt-1 text-sm text-red-600">{errors.hourlyPrice}</p>}
                            </div>

                            {/* Biển số */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-2" />
                                    Biển số
                                </label>
                                <input
                                    type="text"
                                    name="licensePlate"
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
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                                />
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                                >
                                    <option value="AUTOMATIC">Tự động</option>
                                    <option value="Manual">Số sàn</option>
                                </select>
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
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                            </div>

                            {/* Loại xe ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-2" />
                                    Loại xe
                                </label>
                                <select
                                    name="vehicleTypeId"
                                    value={formData.vehicleTypeId}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white ${
                                        errors.vehicleTypeId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Chọn loại xe</option>
                                    <option value="1">Xe máy</option>
                                    <option value="2">Xe ô tô</option>
                                </select>
                                {errors.vehicleTypeId && <p className="mt-1 text-sm text-red-600">{errors.vehicleTypeId}</p>}
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
                                {isEditMode ? 'Cập nhật' : 'Tạo Xe'}
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