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
    CheckIcon,
    Search,
    MapPin,
    ChevronDown,
    Crosshair
} from 'lucide-react';
import CRMLayout from "./Crm.jsx";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { toast } from "react-toastify";

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        vehicleName: '',
        brands: '',
        categories: '',
        status: '',
        startDate: '',
        endDate: '',
        fuelEfficient: false,
        fourPlusDoors: false,
        vehicleTypeId: '',
        fuelType: '',
        location: ''
    });

    // Dropdown visibility states
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showFuelDropdown, setShowFuelDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    // Hardcoded values for dropdowns
    const fuelTypes = ["Xăng", "Điện", "Hybrid"];
    const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế", "Nha Trang"];

    // Current date and time for datetime input min
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);

    // Drawer states
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectVehicleId, setRejectVehicleId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);

// Hàm mở modal chi tiết
    const openDetailModal = (vehicle) => {
        setSelectedDetail(vehicle);
        setShowDetailModal(true);
    };

    // Component hiển thị chi tiết
    const DetailItem = ({ icon, label, value }) => (
        <div className="flex items-start gap-3">
            <div className="text-gray-500 mt-0.5">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">{value || 'N/A'}</p>
            </div>
        </div>
    );
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
                setVehicles(data.data.content || []);
                setTotalPages(data.data.totalPages || 0);
            } else {
                setError(data.message || 'Lỗi khi tải danh sách xe');
                toast.error(data.message || 'Lỗi khi tải danh sách xe', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể kết nối đến server');
            toast.error(err.response?.data?.message || 'Không thể kết nối đến server', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
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
                toast.error('Có lỗi xảy ra khi tải dữ liệu ban đầu.', {
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
        fetchVehicles(page, {
            vehicleName: filters.vehicleName,
            brands: filters.brands,
            categories: filters.categories,
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate,
            fuelType: filters.fuelType
        });
    }, [page, filters.vehicleName, filters.brands, filters.categories, filters.status, filters.startDate, filters.endDate, filters.fuelType]);

    useEffect(() => {
        let currentFiltered = [...vehicles];

        // Frontend filter: Vehicle Type
        if (filters.vehicleTypeId) {
            currentFiltered = currentFiltered.filter(vehicle =>
                String(vehicle.vehicleTypeId) === filters.vehicleTypeId
            );
        }

        // Frontend filter: Fuel Type
        if (filters.fuelType) {
            currentFiltered = currentFiltered.filter(vehicle =>
                vehicle.fuelType === filters.fuelType
            );
        }

        // Frontend filter: Location
        if (filters.location) {
            currentFiltered = currentFiltered.filter(vehicle =>
                vehicle.location === filters.location
            );
        }

        // Frontend filter: Fuel Efficient
        if (filters.fuelEfficient) {
            currentFiltered = currentFiltered.filter(vehicle =>
                vehicle.description?.toLowerCase().includes('tiết kiệm nhiên liệu') ||
                vehicle.fuelEfficiency?.toLowerCase() === 'high'
            );
        }

        // Frontend filter: Four Plus Doors
        if (filters.fourPlusDoors) {
            currentFiltered = currentFiltered.filter(vehicle =>
                vehicle.description?.toLowerCase().includes('4 cửa') ||
                (vehicle.seatCount && vehicle.seatCount >= 4)
            );
        }

        setFilteredVehicles(currentFiltered);
    }, [vehicles, filters.vehicleTypeId, filters.fuelType, filters.location, filters.fuelEfficient, filters.fourPlusDoors]);

    const handleFilterChange = (key, value, isFrontendFilter = false) => {
        let newValue = value;

        if ((key === 'startDate' || key === 'endDate') && value) {
            newValue = value + ':00';
            const start = key === 'startDate' ? newValue : filters.startDate;
            const end = key === 'endDate' ? newValue : filters.endDate;

            if (start && end && new Date(start) >= new Date(end)) {
                toast.error('Ngày trả phải sau ngày nhận.', {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }
        }

        setFilters(prev => ({ ...prev, [key]: newValue }));
        if (!isFrontendFilter) setPage(0);
        setError(null);
        closeAllDropdowns();
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
            fourPlusDoors: false,
            vehicleTypeId: '',
            fuelType: '',
            location: ''
        });
        setPage(0);
        setError(null);
        closeAllDropdowns();
    };

    const closeAllDropdowns = () => {
        setShowBrandDropdown(false);
        setShowCategoryDropdown(false);
        setShowFuelDropdown(false);
        setShowLocationDropdown(false);
    };

    const toggleDropdown = (setter, currentState) => {
        closeAllDropdowns();
        setter(!currentState);
    };

    const handleSearch = async () => {
        if (!filters.startDate || !filters.endDate) {
            toast.error('Vui lòng chọn cả ngày nhận và ngày trả.', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setIsSearching(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 1500));

        setPage(0);
        fetchVehicles(0, {
            vehicleName: filters.vehicleName,
            brands: filters.brands,
            categories: filters.categories,
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate,
            fuelType: filters.fuelType
        });
    };

    const handleGeolocate = async () => {
        if (!navigator.geolocation) {
            toast.error('Trình duyệt của bạn không hỗ trợ định vị.', { position: "top-right" });
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();

                    const city = data.address?.city || data.address?.state || data.address?.county;

                    if (city) {
                        handleFilterChange('location', city, true);
                        toast.success(`Đã xác định vị trí của bạn là: ${city}`, { position: "top-right" });
                    } else {
                        toast.warn('Không thể xác định tên thành phố từ vị trí của bạn.', { position: "top-right" });
                    }
                } catch (error) {
                    console.error("Lỗi khi reverse geocoding:", error);
                    toast.error('Lỗi khi chuyển đổi vị trí thành địa chỉ.', { position: "top-right" });
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                let errorMessage = 'Lỗi khi lấy vị trí.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Bạn đã từ chối quyền truy cập vị trí.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Thông tin vị trí không có sẵn.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Yêu cầu lấy vị trí đã hết hạn.';
                        break;
                    default:
                        errorMessage = 'Đã xảy ra lỗi không xác định.';
                        break;
                }
                toast.error(errorMessage, { position: "top-right" });
                setIsLocating(false);
            }
        );
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
                fetchVehicles(page, {
                    vehicleName: filters.vehicleName,
                    brands: filters.brands,
                    categories: filters.categories,
                    status: filters.status,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    fuelType: filters.fuelType
                });
                setError('');
                toast.success('Xóa xe thành công!', {
                    position: "top-right",
                    autoClose: 3000,
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
        fetchVehicles(page, {
            vehicleName: filters.vehicleName,
            brands: filters.brands,
            categories: filters.categories,
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate,
            fuelType: filters.fuelType
        });
    };

    const handleApproved = async (vehicleId) => {
        if (window.confirm(`Bạn có chắc muốn phê duyệt thông tin xe có ID: ${vehicleId}?`)) {
            setLoading(true);
            try {
                await approveVehicle(vehicleId);
                fetchVehicles(page, {
                    vehicleName: filters.vehicleName,
                    brands: filters.brands,
                    categories: filters.categories,
                    status: filters.status,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    fuelType: filters.fuelType
                });
                setError('');
                toast.success('Phê duyệt xe thành công!', {
                    position: "top-right",
                    autoClose: 3000,
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
        setRejectReason('');
        setShowRejectForm(true);
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
            fetchVehicles(page, {
                vehicleName: filters.vehicleName,
                brands: filters.brands,
                categories: filters.categories,
                status: filters.status,
                startDate: filters.startDate,
                endDate: filters.endDate,
                fuelType: filters.fuelType
            });
            setError('');
            toast.success('Từ chối phê duyệt xe thành công!', {
                position: "top-right",
                autoClose: 3000,
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
                <div className="bg-white rounded-xl shadow-lg mb-4 relative">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Bộ lọc
                        </h2>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            {/* Cột 1 */}
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label htmlFor="location" className="text-gray-600 text-sm mb-1">Địa điểm</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            id="location"
                                            placeholder="Chọn địa điểm"
                                            value={filters.location}
                                            onChange={(e) => handleFilterChange('location', e.target.value, true)}
                                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGeolocate}
                                            disabled={isLocating}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 disabled:cursor-wait"
                                        >
                                            {isLocating ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                            ) : (
                                                <Crosshair className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="vehicleName" className="text-gray-600 text-sm mb-1">Tên xe</label>
                                    <input
                                        type="text"
                                        id="vehicleName"
                                        placeholder="Nhập tên xe"
                                        value={filters.vehicleName}
                                        onChange={(e) => handleFilterChange('vehicleName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Cột 2 */}
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label htmlFor="startDate" className="text-gray-600 text-sm mb-1">Ngày nhận xe</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="datetime-local"
                                            id="startDate"
                                            value={filters.startDate?.slice(0, 16) || ''}
                                            min={minDateTime}
                                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="endDate" className="text-gray-600 text-sm mb-1">Ngày trả xe</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="datetime-local"
                                            id="endDate"
                                            value={filters.endDate?.slice(0, 16) || ''}
                                            min={filters.startDate?.slice(0, 16) || minDateTime}
                                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cột 3 */}
                            <div className="space-y-4">

                                <div className="relative z-50"> {/* Tăng z-index lên cao */}
                                    <label className="text-gray-600 text-sm mb-1">Hãng xe</label>
                                    <button
                                        className="flex items-center space-x-2 px-3 py-2 w-full bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        onClick={() => toggleDropdown(setShowBrandDropdown, showBrandDropdown)}
                                    >
                                        <Car className="w-5 h-5" />
                                        <span className="truncate">
              {filters.brands ? brands.find(b => b.id === filters.brands)?.name || filters.brands : "Tất cả Hãng"}
            </span>
                                        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showBrandDropdown && (
                                        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                            <a
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFilterChange('brands', '', false);
                                                }}
                                            >
                                                Tất cả Hãng
                                            </a>
                                            {brands.map((brand) => (
                                                <a
                                                    key={brand.id}
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleFilterChange('brands', brand.id, false);
                                                    }}
                                                >
                                                    {brand.name}
                                                </a>
                                            ))}                                        </div>
                                    )}
                                </div>

                                <div className="relative z-20">
                                    <label className="text-gray-600 text-sm mb-1">Loại xe</label>
                                    <button
                                        className="flex items-center space-x-2 px-3 py-2 w-full bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        onClick={() => toggleDropdown(setShowCategoryDropdown, showCategoryDropdown)}
                                    >
                                        <Car className="w-5 h-5" />
                                        <span className="truncate">
              {filters.categories ? categories.find(c => c.id === filters.categories)?.name || filters.categories : "Tất cả Loại"}
            </span>
                                        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showCategoryDropdown && (
                                        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                                            <a
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFilterChange('categories', '', false);
                                                }}
                                            >
                                                Tất cả Loại
                                            </a>
                                            {categories.map((category) => (
                                                <a
                                                    key={category.id}
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleFilterChange('categories', category.id, false);
                                                    }}
                                                >
                                                    {category.name}
                                                </a>
                                            ))}                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cột 4 */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="text-gray-600 text-sm mb-1">Nhiên liệu</label>
                                    <button
                                        className="flex items-center space-x-2 px-3 py-2 w-full bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        onClick={() => toggleDropdown(setShowFuelDropdown, showFuelDropdown)}
                                    >
                                        <Fuel className="w-5 h-5" />
                                        <span className="truncate">
              {filters.fuelType || "Tất cả Nhiên liệu"}
            </span>
                                        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFuelDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showFuelDropdown && (
                                        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                            <a
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFilterChange('fuelType', '', true);
                                                }}
                                            >
                                                Tất cả Nhiên liệu
                                            </a>
                                            {fuelTypes.map((fuel) => (
                                                <a
                                                    key={fuel}
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleFilterChange('fuelType', fuel, true);
                                                    }}
                                                >
                                                    {fuel}
                                                </a>
                                            ))}                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="text-gray-600 text-sm mb-1">Trạng thái</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="AVAILABLE">Có sẵn</option>
                                        <option value="RENTED">Đã thuê</option>
                                        <option value="PENDING">Đang xử lý đơn</option>
                                    </select>
                                </div>
                            </div>

                            {/* Cột 5 - Button actions */}
                            <div className="flex flex-col justify-end space-y-3">
                                <div className="flex space-x-2">
                                    <button
                                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${filters.vehicleTypeId === '1' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        onClick={() => handleFilterChange('vehicleTypeId', '1', true)}
                                    >
            <span className="flex items-center justify-center gap-2">
              <Car className="w-4 h-4" />
              Ô tô
            </span>
                                    </button>
                                    <button
                                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${filters.vehicleTypeId === '2' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        onClick={() => handleFilterChange('vehicleTypeId', '2', true)}
                                    >
            <span className="flex items-center justify-center gap-2">
              <Car className="w-4 h-4" />
              Xe máy
            </span>
                                    </button>
                                </div>

                                <div className="flex space-x-2">

                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 flex items-center justify-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Xóa lọc</span>
                                    </button>
                                </div>
                            </div>
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
                                className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 flex items-center gap-1"
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
                        {!loading && filteredVehicles.length === 0 && !error && (
                            <div className="text-center text-gray-600 text-sm">Không có xe nào để hiển thị</div>
                        )}
                        {filteredVehicles.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên xe</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hãng</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá/ngày</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá/giờ</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phê duyệt</th>

                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredVehicles.map((vehicle) => (
                                        <tr key={vehicle.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {vehicle.imageUrl ? (
                                                    <img
                                                        src={getFullImageUrl(vehicle.imageUrl)}
                                                        alt={vehicle.vehicleName}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {vehicle.vehicleName}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {getBrandName(vehicle.branchId)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {vehicle.pricePerDay?.toLocaleString('vi-VN')} VNĐ
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {vehicle.pricePerHour?.toLocaleString('vi-VN')} VNĐ
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                vehicle.status === 'RENTED' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                        }`}>
                          {vehicle.status === 'AVAILABLE' ? 'Có sẵn' :
                              vehicle.status === 'RENTED' ? 'Đã thuê' : 'Đang xử lý'}
                        </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openDetailModal(vehicle)}
                                                        className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded hover:bg-blue-200 flex items-center gap-1"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        Chi tiết
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(vehicle)}
                                                        className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(vehicle.id)}
                                                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
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
                                                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejected(vehicle.id)}
                                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Modal chi tiết xe */}
                        {showDetailModal && selectedDetail && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">Chi tiết xe</h3>
                                            <button
                                                onClick={() => setShowDetailModal(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Cột 1 */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    {selectedDetail.imageUrl ? (
                                                        <img
                                                            src={getFullImageUrl(selectedDetail.imageUrl)}
                                                            alt={selectedDetail.vehicleName}
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="text-lg font-semibold">{selectedDetail.vehicleName}</h4>
                                                        <p className="text-gray-600">{getBrandName(selectedDetail.branchId)}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <DetailItem
                                                        icon={<Tag className="w-4 h-4" />}
                                                        label="Biển số"
                                                        value={selectedDetail.liecensePlate}
                                                    />
                                                    <DetailItem
                                                        icon={<Users className="w-4 h-4" />}
                                                        label="Số ghế"
                                                        value={selectedDetail.seatCount}
                                                    />
                                                    <DetailItem
                                                        icon={<Fuel className="w-4 h-4" />}
                                                        label="Nhiên liệu"
                                                        value={selectedDetail.fuelType}
                                                    />
                                                    <DetailItem
                                                        icon={<Tag className="w-4 h-4" />}
                                                        label="Loại xe"
                                                        value={getCategoryName(selectedDetail.categoryId)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Cột 2 */}
                                            <div className="space-y-4">

                                                <DetailItem
                                                    icon={<Building className="w-4 h-4" />}
                                                    label="Địa điểm"
                                                    value={selectedDetail.location}
                                                />

                                                <DetailItem
                                                    icon={<Car className="w-4 h-4" />}
                                                    label="Loại phương tiện"
                                                    value={selectedDetail.vehicleTypeId === '1' ? 'Ô tô' : 'Xe máy'}
                                                />

                                                <DetailItem
                                                    icon={<Car className="w-4 h-4" />}
                                                    label="Lí do không phê duyệt"
                                                    value={selectedDetail.reason}
                                                />


                                            </div>
                                        </div>

                                        {/* Mô tả */}
                                        <div className="mt-6">
                                            <h4 className="font-medium text-gray-700 mb-2">Mô tả</h4>
                                            <p className="text-gray-600 text-sm">
                                                {selectedDetail.description || 'Không có mô tả'}
                                            </p>
                                        </div>

                                        {/* Đăng ký xe */}
                                        {selectedDetail.registrationDocumentUrl && (
                                            <div className="mt-4">
                                                <h4 className="font-medium text-gray-700 mb-2">Đăng ký xe</h4>
                                                <a
                                                    href={getFullImageUrl(selectedDetail.registrationDocumentUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Xem giấy đăng ký
                                                </a>
                                            </div>
                                        )}

                                        {/* Button đóng */}
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={() => setShowDetailModal(false)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Đóng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-3 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
                                >
                                    Trang trước
                                </button>
                                <span className="text-sm text-gray-600">
                                    Trang {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={page === totalPages - 1}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
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
                                    className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleRejectSubmit}
                                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600"
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