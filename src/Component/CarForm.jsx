import React, { useState, useEffect } from 'react';
import { Car, MapPin, Calendar, DollarSign, Fuel, Settings, Users, Tag, Building, FileText, Plus, X, Upload } from 'lucide-react';
import CRMLayout from "./Crm.jsx";
import { createCar, updateVehicle, getBrands, getCategories } from "../service/authentication.js";
import { toast } from "react-toastify";

const CarForm = ({ onClose, onSuccess, initialData, isEditMode }) => {
    const [formData, setFormData] = useState({
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
        gearbox: 'AUTOMATIC',
        location: '',
        vehicleTypeId: '',
        imageUrl: '',
        registrationDocumentUrl: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState(null);
    const [regDocPreviewUrl, setRegDocPreviewUrl] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]); // Thay cho mainImagePreviewUrl
    const [regDocPreviewUrls, setRegDocPreviewUrls] = useState([]); // Thêm dòng này

    const getFullImageUrl = (filename) => {
        if (!filename || filename === 'Chưa cập nhật' || filename.startsWith('data:image')) return null;
        return `http://localhost:8080/v1/user/images/${filename}`;
    };

    const getDisplayName = (filename) => {
        if (filename && filename !== 'Chưa cập nhật') {
            try {
                const urlObj = new URL(filename);
                const pathParts = urlObj.pathname.split('/');
                return pathParts[pathParts.length - 1];
            } catch (e) {
                if (filename.length > 50 && filename.includes('base64')) {
                    return 'tệp đã chọn';
                }
                return filename;
            }
        }
        return 'Chưa cập nhật';
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [brandsRes, categoriesRes] = await Promise.all([
                    getBrands(),
                    getCategories()
                ]);
                if (brandsRes.httpStatus === 200) {
                    setBrands(brandsRes.data || []);
                } else {
                    toast.error('Không thể tải danh sách hãng xe', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
                if (categoriesRes.httpStatus === 200) {
                    setCategories(categoriesRes.data || []);
                } else {
                    toast.error('Không thể tải danh sách loại xe', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (err) {
                console.error("Error fetching brands/categories:", err);
                toast.error('Lỗi khi tải danh sách hãng hoặc loại xe', {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                id: initialData.id || '',
                name: initialData.vehicleName || '',
                brand: initialData.branchId || '',
                category: initialData.categoryId || '',
                type: initialData.fuelType || 'Gasoline',
                seats: initialData.seatCount || '',
                dailyPrice: initialData.pricePerDay || '',
                hourlyPrice: initialData.pricePerHour || '',
                licensePlate: initialData.liecensePlate || '',
                description: initialData.description || '',
                gearbox: initialData.gearBox || 'AUTOMATIC',
                location: initialData.location || '',
                vehicleTypeId: initialData.vehicleTypeId || '',
                imageUrl: initialData.imageUrl || '',
                registrationDocumentUrl: initialData.registrationDocumentUrl || '',
            });
            if (mainImagePreviewUrl) URL.revokeObjectURL(mainImagePreviewUrl);
            setMainImagePreviewUrl(null);
            if (regDocPreviewUrl) URL.revokeObjectURL(regDocPreviewUrl);
            setRegDocPreviewUrl(null);
            if (initialData.imageUrl) {
                const urls = initialData.imageUrl.split(',');
                setImagePreviews(urls.map((url) => getFullImageUrl(url)).filter(Boolean));
            }
            if (initialData.registrationDocumentUrl) {
                const urls = initialData.registrationDocumentUrl.split(',');
                setRegDocPreviewUrls(urls.map((url) => getFullImageUrl(url)).filter(Boolean));
            }
        }
    }, [isEditMode, initialData]);
    const handleRemoveImage = (indexToRemove) => {
        // Xóa khỏi preview
        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[indexToRemove]);
        newPreviews.splice(indexToRemove, 1);
        setImagePreviews(newPreviews);

        // Xóa khỏi form data
        const currentImages = formData.imageUrl ? formData.imageUrl.split(',') : [];
        currentImages.splice(indexToRemove, 1);
        setFormData(prev => ({ ...prev, imageUrl: currentImages.join(',') }));
    };
    const handleRemoveRegDoc = (indexToRemove) => {
        // Xóa khỏi preview
        const newPreviews = [...regDocPreviewUrls];
        if (newPreviews[indexToRemove]) {
            URL.revokeObjectURL(newPreviews[indexToRemove]);
        }
        newPreviews.splice(indexToRemove, 1);
        setRegDocPreviewUrls(newPreviews);

        // Xóa khỏi form data
        const currentDocs = formData.registrationDocumentUrl ? formData.registrationDocumentUrl.split(',') : [];
        currentDocs.splice(indexToRemove, 1);
        setFormData((prev) => ({ ...prev, registrationDocumentUrl: currentDocs.join(',') }));
    };
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Tên xe không được để trống';
        if (!formData.brand.trim()) newErrors.brand = 'Hãng xe không được để trống';
        if (!formData.category.trim()) newErrors.category = 'Phân loại xe không được để trống';
        if (!formData.type.trim()) newErrors.type = 'Loại nhiên liệu không được để trống';
        if (!formData.seats || formData.seats < 2 || formData.seats > 50 || formData.seats < 0)
            newErrors.seats = 'Số ghế phải từ 2-50 và không âm';
        if (!formData.dailyPrice || formData.dailyPrice < 100000 || formData.dailyPrice < 0)
            newErrors.dailyPrice = 'Giá ngày phải từ 500,000 VNĐ và không âm';
        if (formData.hourlyPrice && (formData.hourlyPrice < 10000 || formData.hourlyPrice < 0))
            newErrors.hourlyPrice = 'Giá giờ phải từ 100,000 VNĐ và không âm';
        if (formData.licensePlate && !/^\d{2}[A-Z]{1,2}-?\d{4,5}$/i.test(formData.licensePlate))
            newErrors.licensePlate = 'Biển số không đúng định dạng (VD: 30A-12345)';
        if (!formData.location.trim()) newErrors.location = 'Địa điểm không được để trống';
        if (!formData.vehicleTypeId.trim()) newErrors.vehicleTypeId = 'Loại xe không được để trống';
        if (!isEditMode && !formData.imageUrl) newErrors.imageUrl = 'Ảnh đại diện của xe không được để trống';
        if (!isEditMode && !formData.registrationDocumentUrl)
            newErrors.registrationDocumentUrl = 'Giấy đăng ký xe không được để trống';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Helper function to format number with commas
    const formatNumberWithCommas = (value) => {
        if (value === "" || value === null || value === undefined) return "";
        const num = Number(value.toString().replace(/,/g, ""));
        if (isNaN(num)) return "";
        return num.toLocaleString('en-US');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'seats' || name === 'dailyPrice' || name === 'hourlyPrice') {
            // Remove commas for price fields before processing
            let rawValue = value.replace(/,/g, "");
            if (rawValue === "" && (name === 'dailyPrice' || name === 'hourlyPrice')) {
                processedValue = "";
            } else {
                processedValue = Math.max(0, Number(rawValue) || 0);
            }
            if (name === 'seats' && (processedValue < 2 || processedValue > 50)) {
                setErrors({ ...errors, [name]: 'Số ghế phải từ 2-50 và không âm' });
            } else if (name === 'dailyPrice' && processedValue < 500000 && processedValue !== "") {
                setErrors({ ...errors, [name]: 'Giá ngày phải từ 500,000 VNĐ và không âm' });
            } else if (name === 'hourlyPrice' && processedValue < 100000 && processedValue !== "") {
                setErrors({ ...errors, [name]: 'Giá giờ phải từ 100,000 VNĐ và không âm' });
            } else if (errors[name]) {
                setErrors({ ...errors, [name]: '' });
            }
        }

        setFormData({
            ...formData,
            [name]: processedValue,
        });
    };

    const [imageUrls, setImageUrls] = useState([]); // Thay vì imageUrl đơn lẻ

    const handleFileInputChange = (e, fieldName) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newPreviews = [];
            const newUrls = [];

            files.forEach((file) => {
                const previewUrl = URL.createObjectURL(file);
                newPreviews.push(previewUrl);

                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1];
                    newUrls.push(base64String);

                    if (newUrls.length === files.length) {
                        const currentUrls = formData[fieldName] ? formData[fieldName].split(',') : [];
                        const combinedUrls = [...currentUrls, ...newUrls].join(',');

                        setFormData((prev) => ({ ...prev, [fieldName]: combinedUrls }));
                        if (fieldName === 'imageUrl') {
                            setImagePreviews((prev) => [...prev, ...newPreviews]);
                        } else {
                            setRegDocPreviewUrls((prev) => [...prev, ...newPreviews]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin nhập vào.', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            const payload = {
                id: isEditMode ? formData.id : undefined,
                name: formData.name,
                brand: formData.brand,
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
                imageUrl: formData.imageUrl,
                registrationDocumentUrl: formData.registrationDocumentUrl,
                approved: false,
            };

            if (isEditMode) {
                const response = await updateVehicle(payload.id, payload);
                if (response.httpStatus === 200) {
                    toast.success('Cập nhật xe thành công!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                } else {
                    toast.success('Cập nhật xe thành công!', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } else {
                const response = await createCar(payload);
                if (response.httpStatus === 200) {
                    toast.success('Tạo xe thành công!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    setFormData({
                        id: '', name: '', brand: '', category: '', type: 'Gasoline', seats: '',
                        dailyPrice: '', hourlyPrice: '', licensePlate: '', description: '',
                        gearbox: 'AUTOMATIC', location: '', vehicleTypeId: '', imageUrl: '', registrationDocumentUrl: ''
                    });
                    setErrors({});
                    if (mainImagePreviewUrl) URL.revokeObjectURL(mainImagePreviewUrl);
                    setMainImagePreviewUrl(null);
                    if (regDocPreviewUrl) URL.revokeObjectURL(regDocPreviewUrl);
                    setRegDocPreviewUrl(null);
                } else {
                    toast.success(response.message || 'Tạo xe thành công.', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            setMessage(error.response?.data?.message || (isEditMode ? 'Lỗi khi cập nhật xe' : 'Lỗi khi tạo xe'));
            toast.error(error.response?.data?.message || (isEditMode ? 'Lỗi khi cập nhật xe' : 'Lỗi khi tạo xe'), {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden">
                <div className="p-5">
                    {loading && (
                        <div className="text-center text-gray-600 text-sm">Đang tải dữ liệu...</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
                            >
                                <option value="Gasoline">Xăng</option>
                                <option value="Diesel">Dầu</option>
                                <option value="Electric">Điện</option>
                                <option value="Hybrid">Hybrid</option>

                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-2" />
                                Giá ngày (VNĐ)
                            </label>
                            <input
                                type="text"
                                name="dailyPrice"
                                value={formatNumberWithCommas(formData.dailyPrice)}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                    errors.dailyPrice ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                            {errors.dailyPrice && <p className="mt-1 text-sm text-red-600">{errors.dailyPrice}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-2" />
                                Giá giờ (VNĐ)
                            </label>
                            <input
                                type="text"
                                name="hourlyPrice"
                                value={formatNumberWithCommas(formData.hourlyPrice)}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                    errors.hourlyPrice ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                            {errors.hourlyPrice && <p className="mt-1 text-sm text-red-600">{errors.hourlyPrice}</p>}
                        </div>

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

                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                <Upload className="w-4 h-4 inline mr-2" />
                                Ảnh đại diện xe (Tối đa 5 ảnh)
                            </label>
                            <input
                                type="file"
                                id="imageUrl"
                                className="hidden"
                                onChange={(e) => handleFileInputChange(e, 'imageUrl')}
                                accept="image/*"
                                multiple
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('imageUrl').click()}
                                disabled={imagePreviews.length >= 5}
                                className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg shadow-sm text-sm font-medium ${
                                    imagePreviews.length >= 5 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'
                                } ${
                                    errors.imageUrl ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Chọn ảnh ({imagePreviews.length}/5)
                            </button>

                            {/* Hiển thị preview ảnh */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Ảnh xe ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>



                        </div>

                        <div>
                            <label htmlFor="registrationDocumentUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-2" />
                                Giấy đăng ký xe (Có thể chọn nhiều file)
                            </label>
                            <input
                                type="file"
                                id="registrationDocumentUrl"
                                className="hidden"
                                onChange={(e) => handleFileInputChange(e, 'registrationDocumentUrl')}
                                accept="image/*,.pdf"
                                multiple
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('registrationDocumentUrl').click()}
                                className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                                    errors.registrationDocumentUrl ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Chọn file
                            </button>

                            {/* Hiển thị preview giấy đăng ký xe */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {regDocPreviewUrls.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Giấy đăng ký xe ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-lg border"
                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/96')} // Hình ảnh thay thế nếu lỗi
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRegDoc(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Xóa file này"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.registrationDocumentUrl && (
                                <p className="mt-1 text-sm text-red-600">{errors.registrationDocumentUrl}</p>
                            )}
                        </div>
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
                                disabled={loading}
                            >
                                <option value="">Chọn loại xe</option>
                                <option value="1">Ô tô</option>
                                <option value="2">Xe máy</option>
                            </select>
                            {errors.vehicleTypeId && <p className="mt-1 text-sm text-red-600">{errors.vehicleTypeId}</p>}
                        </div>

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
                                disabled={loading}
                            >
                                <option value="AUTOMATIC">Tự động</option>
                                <option value="MANUAL">Số sàn</option>
                                <option value="MANUAL CLUTCH">Côn tay</option>
                                <option value="SCOOTER">Tay ga</option>
                            </select>
                        </div>

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
                    </div>

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
                            disabled={loading}
                        >
                            <Plus className="w-5 h-5" />
                            {isEditMode ? 'Cập nhật' : 'Tạo Xe'}
                        </button>
                    </div>

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
    );
};

export default CarForm;

