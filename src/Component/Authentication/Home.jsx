import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Search, Lock, User, Car, Calendar, MapPin, Fuel, Users, Star, Filter, Grid, List, Menu, X } from 'lucide-react';
import { getBrands, getCategories, getVehicles } from "../../service/authentication.js";
import Header from "../Header.jsx";

const Home = () => {
    const { customer, logOut } = useAuth();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [error, setError] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        vehicleName: '',
        brands: '',
        categories: '',
        status: '',
        startDate: '',
        endDate: '',
        fuelEfficient: false,
        fourPlusDoors: false
    });

    // Current date for date input min
    const today = new Date().toISOString().split('T')[0];

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [vehiclesRes, brandsRes, categoriesRes] = await Promise.all([
                    getVehicles(0, 20, {
                        vehicleName: filters.vehicleName,
                        brands: filters.brands,
                        categories: filters.categories,
                        status: filters.status,
                        startDate: filters.startDate,
                        endDate: filters.endDate
                    }),
                    getBrands(),
                    getCategories()
                ]);

                if (vehiclesRes.data.httpStatus === 200) {
                    setVehicles(vehiclesRes.data.data.content || []);
                    setTotalPages(vehiclesRes.data.data.totalPages || 0);
                } else {
                    setError('Không thể tải danh sách xe.');
                }

                if (brandsRes.httpStatus === 200) {
                    setBrands(brandsRes.data || []);
                }

                if (categoriesRes.httpStatus === 200) {
                    setCategories(categoriesRes.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Có lỗi xảy ra khi tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch vehicles when server-side filters or page changes
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getVehicles(currentPage, 20, {
                    vehicleName: filters.vehicleName,
                    brands: filters.brands,
                    categories: filters.categories,
                    status: filters.status,
                    startDate: filters.startDate,
                    endDate: filters.endDate
                });
                if (response.data.httpStatus === 200) {
                    setVehicles(response.data.data.content || []);
                    setTotalPages(response.data.data.totalPages || 0);
                } else {
                    setError('Không thể tải danh sách xe.');
                }
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                setError('Có lỗi xảy ra khi tải xe.');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [filters.vehicleName, filters.brands, filters.categories, filters.status, filters.startDate, filters.endDate, currentPage]);

    // Apply local filtering for fuelEfficient and fourPlusDoors
    useEffect(() => {
        let filtered = vehicles;
        if (filters.fuelEfficient) {
            filtered = filtered.filter(vehicle =>
                vehicle.description?.toLowerCase().includes('tiết kiệm')
            );
        }
        if (filters.fourPlusDoors) {
            filtered = filtered.filter(vehicle =>
                vehicle.description?.toLowerCase().includes('cửa') || vehicle.seatCount >= 4
            );
        }
        setFilteredVehicles(filtered);
    }, [vehicles, filters.fuelEfficient, filters.fourPlusDoors]);

    const handleFilterChange = (key, value) => {
        if ((key === 'startDate' || key === 'endDate') && value) {
            const start = key === 'startDate' ? value : filters.startDate;
            const end = key === 'endDate' ? value : filters.endDate;
            if (start && end && new Date(start) > new Date(end)) {
                setError('Ngày trả phải sau ngày nhận.');
                return;
            }
        }
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(0);
        setError(null);
    };

    const clearFilters = () => {
        setFilters({
            vehicleName: '',
            brands: '',
            categories: '',
            status: '',
            startDate: '',
            endDate: '',
            fuelEfficient: false,
            fourPlusDoors: false
        });
        setCurrentPage(0);
        setError(null);
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleBookVehicle = (vehicleId) => {
        navigate(`/${vehicleId}`);
    };

    const getBrandName = (branchId) => {
        return branchId || 'N/A';
    };

    const getCategoryName = (categoryId) => {
        return categoryId || 'N/A';
    };

    if (loading && vehicles.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
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
            {/* Search Bar */}
            <div className="bg-blue-600 pb-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa điểm nhận xe
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên xe"
                                        value={filters.vehicleName}
                                        onChange={(e) => handleFilterChange('vehicleName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <MapPin className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày nhận
                                </label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    min={today}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày trả
                                </label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    min={filters.startDate || today}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                onClick={() => setCurrentPage(0)}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <div className="w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Bộ lọc</h3>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden"
                            >
                                {showFilters ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
                            {/* Thông tin xe */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Thông tin xe</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={filters.fuelEfficient}
                                            onChange={(e) => handleFilterChange('fuelEfficient', e.target.checked)}
                                        />
                                        <span className="text-sm">Siêu tiết kiệm nhiên liệu</span>
                                        <span className="ml-auto text-sm text-gray-500">
                                            {vehicles.filter(v => v.description?.toLowerCase().includes('tiết kiệm')).length}
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={filters.fourPlusDoors}
                                            onChange={(e) => handleFilterChange('fourPlusDoors', e.target.checked)}
                                        />
                                        <span className="text-sm">4+ cửa</span>
                                        <span className="ml-auto text-sm text-gray-500">
                                            {vehicles.filter(v => v.description?.toLowerCase().includes('cửa') || v.seatCount >= 4).length}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Hãng xe */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Hãng xe</h4>
                                <select
                                    value={filters.brands}
                                    onChange={(e) => handleFilterChange('brands', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả hãng</option>
                                    {[...new Set(vehicles.map(v => v.branchId))].map((branch) => (
                                        <option key={branch} value={branch}>{branch}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Loại xe */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Loại xe</h4>
                                <select
                                    value={filters.categories}
                                    onChange={(e) => handleFilterChange('categories', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả loại</option>
                                    {[...new Set(vehicles.map(v => v.categoryId))].map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Trạng thái */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Trạng thái</h4>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="AVAILABLE">Có sẵn</option>
                                    <option value="RENTED">Đã thuê</option>
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={clearFilters}
                                className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Có sẵn {filteredVehicles.length} xe
                                </h2>
                            </div>
                        </div>

                        {/* Vehicle Cards */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : filteredVehicles.length > 0 ? (
                                filteredVehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-start gap-6">
                                            {/* Car Image */}
                                            <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {vehicle.imageUrl ? (
                                                    <img
                                                        src={vehicle.imageUrl}
                                                        alt={vehicle.vehicleName}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <Car className="w-16 h-16 text-gray-400" />
                                                )}
                                            </div>

                                            {/* Car Details */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            {vehicle.vehicleName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-3">
                                                            {getCategoryName(vehicle.categoryId)} | {getBrandName(vehicle.branchId)}
                                                        </p>

                                                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                                            <div className="flex items-center">
                                                                <Users className="w-4 h-4 mr-1" />
                                                                <span>{vehicle.seatCount || 5} chỗ ngồi</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Fuel className="w-4 h-4 mr-1" />
                                                                <span>{vehicle.fuelType || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span>Biển số: {vehicle.liecensePlate || 'N/A'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-4 text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                vehicle.status === 'AVAILABLE'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {vehicle.status === 'AVAILABLE' ? 'Có sẵn' : 'Đã thuê'}
                                                            </span>
                                                        </div>

                                                        <div className="mt-4 flex items-center space-x-4">
                                                            <div className="flex items-center">
                                                                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">
                                                                    {vehicle.branchId}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <span className="text-xs text-gray-600 mr-2">Xuất sắc</span>
                                                                    <div className="flex">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-xs text-gray-600 ml-1">9+ đánh giá</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-gray-600 mt-2">
                                                            {vehicle.description || 'Không có mô tả'}
                                                        </p>
                                                    </div>

                                                    {/* Price and Book Button */}
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-600 mb-1">Giá cho 1 ngày</div>
                                                        <div className="text-2xl font-bold text-gray-900 mb-2">
                                                            {vehicle.pricePerDay?.toLocaleString() || 'N/A'} VNĐ
                                                        </div>
                                                        <div className="text-sm text-gray-600 mb-4">Miễn phí hủy</div>

                                                        <button
                                                            onClick={() => handleBookVehicle(vehicle.id)}
                                                            disabled={vehicle.status !== 'AVAILABLE'}
                                                            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium mb-2"
                                                        >
                                                            Xem chi tiết
                                                        </button>

                                                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                                                            <button className="flex items-center hover:text-blue-600">
                                                                <span>Thông tin quan trọng</span>
                                                            </button>
                                                            <button className="flex items-center hover:text-blue-600">
                                                                <span>Gửi báo giá qua email</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg">
                                    <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy xe nào</h3>
                                    <p className="text-gray-600">Hãy thử điều chỉnh bộ lọc để tìm kiếm xe phù hợp</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Trước
                                </button>

                                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                    const pageIndex = Math.floor(currentPage / 5) * 5 + index;
                                    if (pageIndex >= totalPages) return null;

                                    return (
                                        <button
                                            key={pageIndex}
                                            onClick={() => setCurrentPage(pageIndex)}
                                            className={`px-4 py-2 rounded-lg ${
                                                currentPage === pageIndex
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageIndex + 1}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;