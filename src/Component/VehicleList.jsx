import React, { useState, useEffect } from 'react';
import CarForm from './CarForm.jsx';
import {
    getVehicles,
    deleteVehicle,
    getBrands,
    getCategories,
    approveVehicle,
    rejectVehicle
} from '../service/authentication.js';
import {
    Car,
    Fuel,
    Users,
    Tag,
    Building,
    Calendar,
    DollarSign,
    FileText,
    X,
    Plus,
    Edit,
    Trash2,
    Image as ImageIcon,
    CheckCircle,
    CheckIcon
} from 'lucide-react';
import CRMLayout from "./Crm.jsx";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { toast } from "react-toastify";

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        brands: '',
        categories: '',
        vehicleName: '',
        startDate: '',
        endDate: '',
        status: '',
        vehicleTypeId: '',
        location: '',
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [editMode, setEditMode] = useState(false);
    // New states for rejection sidebar
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectVehicleId, setRejectVehicleId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const getFullImageUrl = (filename) => {
        if (!filename) return null;
        return `http://localhost:8080/v1/user/images/${filename}`;
    };

    const getBrandName = (brandId) => {
        const brand = brands.find(b => b.id === brandId);
        return brand ? brand.name : 'N/A';
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'N/A';
    };

    const fetchVehicles = async (pageNumber, filterParams) => {
        setLoading(true);
        setError('');
        try {
            const response = await getVehicles(pageNumber, pageSize, filterParams);
            const data = response.data;
            if (data.httpStatus === 200) {
                setVehicles(data.data.content);
                setTotalPages(data.data.totalPages);
            } else {
                setError(data.message || 'Lỗi khi tải danh sách xe');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [brandsRes, categoriesRes] = await Promise.all([
                    getBrands(),
                    getCategories()
                ]);
                if (brandsRes.httpStatus === 200) {
                    setBrands(brandsRes.data || []);
                }
                if (categoriesRes.httpStatus === 200) {
                    setCategories(categoriesRes.data || []);
                }
            } catch (err) {
                console.error("Error fetching brands/categories:", err);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchVehicles(page, filters);
    }, [page, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(0);
    };

    const handleFilterReset = () => {
        setFilters({
            brands: '',
            categories: '',
            vehicleName: '',
            startDate: '',
            endDate: '',
            status: '',
            vehicleTypeId: '',
            location: '',
        });
        setPage(0);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleDelete = async (vehicleId) => {
        if (window.confirm(`Bạn có chắc muốn xóa xe với ID: ${vehicleId}?`)) {
            setLoading(true);
            try {
                await deleteVehicle(vehicleId);
                fetchVehicles(page, filters);
                setError('');
                toast.success('Xóa xe thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể xóa xe');
                toast.error('Xóa xe thất bại: ' + (err.response?.data?.message || 'Lỗi không xác định'), {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddFormClose = () => {
        setShowAddForm(false);
        setSelectedVehicle(null);
        setEditMode(false);
    };

    const handleAddFormSuccess = () => {
        setShowAddForm(false);
        setSelectedVehicle(null);
        setEditMode(false);
        fetchVehicles(page, filters);
    };

    const handleApproved = async (vehicleId) => {
        if (window.confirm(`Bạn có chắc muốn phê duyệt thông tin xe có ID: ${vehicleId}?`)) {
            setLoading(true);
            try {
                await approveVehicle(vehicleId);
                fetchVehicles(page, filters);
                setError('');
                toast.success('Phê duyệt xe thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể phê duyệt xe');
                toast.error('Phê duyệt xe thất bại: ' + (err.response?.data?.message || 'Lỗi không xác định'), {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRejected = (vehicleId) => {
        setRejectVehicleId(vehicleId);
        setRejectReason(''); // Reset reason input
        setShowRejectForm(true); // Open rejection sidebar
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            toast.error('Vui lòng nhập lý do từ chối!', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        setLoading(true);
        try {
            await rejectVehicle(rejectVehicleId, rejectReason);
            fetchVehicles(page, filters);
            setError('');
            toast.success('Từ chối phê duyệt xe thành công!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setShowRejectForm(false);
            setRejectVehicleId(null);
            setRejectReason('');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể từ chối xe');
            toast.error('Từ chối xe thất bại: ' + (err.response?.data?.message || 'Lỗi không xác định'), {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRejectFormClose = () => {
        setShowRejectForm(false);
        setRejectVehicleId(null);
        setRejectReason('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3">
                        <Car className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Danh Sách Xe</h1>
                    <p className="text-gray-600 text-sm">Quản lý thông tin xe một cách hiệu quả</p>
                </div>

                {/* Filter Form */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Bộ lọc
                        </h2>
                    </div>
                    <div className="p-4">
                        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Building className="w-3 h-3 inline mr-1" />
                                    Hãng xe
                                </label>
                                <input
                                    type="text"
                                    name="brands"
                                    placeholder="VD: Toyota,Honda"
                                    value={filters.brands}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    Loại xe
                                </label>
                                <input
                                    type="text"
                                    name="categories"
                                    placeholder="VD: Sedan,SUV"
                                    value={filters.categories}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Car className="w-3 h-3 inline mr-1" />
                                    Tên xe
                                </label>
                                <input
                                    type="text"
                                    name="vehicleName"
                                    placeholder="Nhập tên xe"
                                    value={filters.vehicleName}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    Trạng thái
                                </label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="AVAILABLE">Có sẵn</option>
                                    <option value="RENTED">Đã thuê</option>
                                </select>
                            </div>
                        </form>
                        <div className="mt-3 flex justify-end gap-2">
                            <button
                                onClick={handleFilterReset}
                                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vehicle List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Car className="w-5 h-5" />
                                Danh sách xe
                            </h2>
                            <button
                                onClick={() => {
                                    setSelectedVehicle(null);
                                    setEditMode(false);
                                    setShowAddForm(true);
                                }}
                                className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        {loading && (
                            <div className="text-center text-gray-600 text-sm">Đang tải...</div>
                        )}
                        {error && (
                            <div className="mb-3 p-2 rounded-lg text-center font-medium bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        {!loading && vehicles.length === 0 && !error && (
                            <div className="text-center text-gray-600 text-sm">Không có xe nào để hiển thị</div>
                        )}
                        {vehicles.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên xe</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hãng</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại xe</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhiên liệu</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số ghế</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biển số</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá/ngày</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá/giờ</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hộp số</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại phương tiện</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đăng ký xe</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phê duyệt</th>

                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lí do từ chối</th>

                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {vehicles.map((vehicle) => (
                                        <tr key={vehicle.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                {vehicle.imageUrl ? (
                                                    <img src={getFullImageUrl(vehicle.imageUrl)} alt={vehicle.vehicleName} className="w-10 h-10 object-cover rounded" />
                                                ) : (
                                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                                )}
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Car className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{vehicle.vehicleName}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Building className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{getBrandName(vehicle.branchId)}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{getCategoryName(vehicle.categoryId)}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Fuel className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{vehicle.fuelType}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{vehicle.seatCount}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{vehicle.liecensePlate}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{vehicle.pricePerDay ? vehicle.pricePerDay.toLocaleString('vi-VN') : 'N/A'} VNĐ</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{vehicle.pricePerHour ? vehicle.pricePerHour.toLocaleString('vi-VN') : 'N/A'} VNĐ</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{vehicle.gearBox || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Building className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">{vehicle.location || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <span className={`inline-block py-0.5 px-2 text-xs font-medium rounded-full ${vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {vehicle.status === 'AVAILABLE' && 'Có sẵn'}
                                                    {vehicle.status === 'RENTED' && 'Đã thuê'}
                                                    {vehicle.status === 'PENDING' && 'Đang xử lý đơn'}
                                                </span>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Car className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-900">
                                                        {vehicle.vehicleTypeId === '1' ? 'Ô tô' :
                                                            vehicle.vehicleTypeId === '2' ? 'Xe máy' : 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm text-center">
                                                {vehicle.registrationDocumentUrl ? (
                                                    <a href={getFullImageUrl(vehicle.registrationDocumentUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        <FileText className="w-5 h-5 mx-auto" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">N/A</span>
                                                )}
                                            </td>

                                            <td className="px-2 py-1 whitespace-nowrap text-sm text-center">
                                                {vehicle.approved === true ? (
                                                    <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                                                ) : vehicle.approved === false ? (
                                                    <X className="w-5 h-5 text-red-500 mx-auto" />
                                                ) : (
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleApproved(vehicle.id)}
                                                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejected(vehicle.id)}
                                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-900">
                                                        {vehicle.reason}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleEdit(vehicle)}
                                                        className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(vehicle.id)}
                                                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-3 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 0}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200"
                                >
                                    Trang trước
                                </button>
                                <span className="text-sm text-gray-600">
                                    Trang {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages - 1}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200"
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Drawer for Add/Edit Car Form */}
                    <Drawer
                        open={showAddForm}
                        onClose={handleAddFormClose}
                        direction="right"
                        className="w-full max-w-4xl"
                        size="lg"
                    >
                        <div className="p-6 bg-white h-full overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">{editMode ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</h3>
                                <button
                                    onClick={handleAddFormClose}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <CarForm
                                key={selectedVehicle ? selectedVehicle.id : 'new-vehicle'}
                                onClose={handleAddFormClose}
                                onSuccess={handleAddFormSuccess}
                                initialData={editMode ? selectedVehicle : null}
                                isEditMode={editMode}
                            />
                        </div>
                    </Drawer>

                    {/* Drawer for Rejection Reason */}
                    <Drawer
                        open={showRejectForm}
                        onClose={handleRejectFormClose}
                        direction="right"
                        className="w-full max-w-md"
                        size="md"
                    >
                        <div className="p-6 bg-white h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Lý do từ chối</h3>
                                <button
                                    onClick={handleRejectFormClose}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhập lý do từ chối
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Vui lòng nhập lý do từ chối..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    rows="5"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleRejectFormClose}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleRejectSubmit}
                                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
        </div>
    );
};

const VehicleListPage = () => (
    <CRMLayout>
        <VehicleList />
    </CRMLayout>
);

export default VehicleListPage;