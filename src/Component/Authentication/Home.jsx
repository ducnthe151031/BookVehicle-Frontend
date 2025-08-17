import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Lock,
    User,
    Car,
    Calendar,
    MapPin,
    Fuel,
    Users,
    Star,
    Filter,
    Grid,
    List,
    Menu,
    X,
    ChevronDown,
    Clock,
    Crosshair,
    CarFront,
    Factory
} from 'lucide-react';
import { getBrands, getCategories, getVehicles, getVehiclesIsApproved } from "../../service/authentication.js";
import Header from "../Header.jsx";
import { toast } from "react-toastify";
import { FaCar, FaMotorcycle } from "react-icons/fa";

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
    const [error, setError] = useState(null);
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
    const fuelTypes = [
        { value: 'Gasoline', label: 'Xăng' },
        { value: 'Diesel', label: 'Dầu' },
        { value: 'Electric', label: 'Điện' },
        { value: 'Hybrid', label: 'Hybrid' }
    ];
    const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế", "Nha Trang"];

    // Current date and time for datetime input min
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);

    // Helper function to construct the full image URL
    const getFullImageUrl = (filename) => {
        if (!filename || filename.trim() === '') return 'https://via.placeholder.com/150';
        return `http://localhost:8080/v1/user/images/${filename.trim()}`;
    };

    // Fetch initial data (brands, categories) once
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [brandsRes, categoriesRes] = await Promise.all([
                    getBrands(),
                    getCategories()
                ]);

                if (brandsRes.httpStatus === 200) {
                    setBrands(brandsRes.data || []);
                } else {
                    toast.error('Không thể tải danh sách hãng xe.', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }

                if (categoriesRes.httpStatus === 200) {
                    setCategories(categoriesRes.data || []);
                } else {
                    toast.error('Không thể tải danh sách loại xe.', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
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

    // Fetch vehicles from backend when server-side filters or page changes
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                setError(null);

                const serverFilters = {
                    vehicleName: filters.vehicleName,
                    brands: filters.brands,
                    categories: filters.categories,
                    status: filters.status,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    fuelType: filters.fuelType
                };

                const response = await getVehiclesIsApproved(currentPage, 20, serverFilters);
                if (response.data.httpStatus === 200) {
                    setVehicles(response.data.data.content || []);
                    setTotalPages(response.data.data.totalPages || 0);
                } else {
                    toast.error('Không thể tải danh sách xe.', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                toast.error(error.response?.data?.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [
        filters.vehicleName,
        filters.brands,
        filters.categories,
        filters.status,
        filters.startDate,
        filters.endDate,
        filters.fuelType,
        currentPage
    ]);

    // Apply ALL filters (both frontend and backend-related) to the 'vehicles' data
    useEffect(() => {
        let currentFiltered = [...vehicles];

        // Filter out vehicles with status MAINTENANCE
        currentFiltered = currentFiltered.filter(vehicle => vehicle.status !== 'MAINTENANCE');

        // Frontend filter: Vehicle Type (Ô tô / Xe máy)
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

        // Local filtering for fuelEfficient and fourPlusDoors
        if (filters.fuelEfficient) {
            currentFiltered = currentFiltered.filter(vehicle =>
                vehicle.description?.toLowerCase().includes('tiết kiệm nhiên liệu') ||
                vehicle.fuelEfficiency?.toLowerCase() === 'high'
            );
        }
        if (filters.fourPlusDoors) {
            currentFiltered = currentFiltered.filter(vehicle =>
                vehicle.description?.toLowerCase().includes('4 cửa') ||
                (vehicle.seatCount && vehicle.seatCount >= 4)
            );
        }

        setFilteredVehicles(currentFiltered);
    }, [
        vehicles,
        filters.vehicleTypeId,
        filters.fuelType,
        filters.location,
        filters.fuelEfficient,
        filters.fourPlusDoors
    ]);

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
        if (!isFrontendFilter) setCurrentPage(0);
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
        setCurrentPage(0);
        setError(null);
        closeAllDropdowns();
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleBookVehicle = (vehicleId) => {
        navigate(`/${vehicleId}`);
    };

    const getBrandName = (brandId) => {
        const brand = brands.find(b => b.id === brandId);
        return brand ? brand.name : 'N/A';
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'N/A';
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

        setCurrentPage(0);
        try {
            const serverFilters = {
                vehicleName: filters.vehicleName,
                brands: filters.brands,
                categories: filters.categories,
                status: filters.status,
                startDate: filters.startDate,
                endDate: filters.endDate,
                fuelTypes: filters.fuelType
            };
            const response = await getVehicles(0, 20, serverFilters);
            if (response.data.httpStatus === 200) {
                setVehicles(response.data.data.content || []);
                setTotalPages(response.data.data.totalPages || 0);
            } else {
                toast.error('Không thể tải danh sách xe.', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error(error.response?.data?.message, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsSearching(false);
        }
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
                        toast.success(`Đã xác định vị trí: ${city}`, { position: "top-right" });
                    } else {
                        toast.warn('Không thể xác định tên thành phố.', { position: "top-right" });
                    }
                } catch (error) {
                    console.error("Lỗi khi reverse geocoding:", error);
                    toast.error('Lỗi khi chuyển đổi vị trí.', { position: "top-right" });
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

    if (loading && vehicles.length === 0 && brands.length === 0 && categories.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header logOut={logOut} handleChangePassword={handleChangePassword} customer={customer} />
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="flex flex-col">
                        <label htmlFor="location" className="text-gray-600 text-sm font-medium mb-1">Địa điểm nhận xe</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                id="location"
                                placeholder="Chọn một địa điểm"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value, true)}
                                className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all duration-200"
                                aria-label="Địa điểm nhận xe"
                            />
                            <button
                                type="button"
                                onClick={handleGeolocate}
                                disabled={isLocating}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                                aria-label="Tự động xác định vị trí"
                            >
                                {isLocating ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></div>
                                ) : (
                                    <Crosshair className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="startDate" className="text-gray-600 text-sm font-medium mb-1">Ngày nhận xe</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="datetime-local"
                                id="startDate"
                                value={filters.startDate?.slice(0, 16) || ''}
                                min={minDateTime}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all duration-200"
                                aria-label="Ngày nhận xe"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="endDate" className="text-gray-600 text-sm font-medium mb-1">Ngày trả xe</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="datetime-local"
                                id="endDate"
                                value={filters.endDate?.slice(0, 16) || ''}
                                min={filters.startDate?.slice(0, 16) || minDateTime}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all duration-200"
                                aria-label="Ngày trả xe"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={isSearching || !filters.startDate || !filters.endDate}
                        className={`col-span-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        aria-label="Tìm kiếm xe"
                    >
                        {isSearching ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                <span>Tìm kiếm xe</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Filter Buttons Section */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <button
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 ${Object.values(filters).every(f => !f && !filters.fuelEfficient && !filters.fourPlusDoors) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                        onClick={clearFilters}
                    >
                        <CarFront className="w-5 h-5" />
                        <span>Tất cả xe</span>
                    </button>

                    <button
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 ${filters.vehicleTypeId === '1' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleFilterChange('vehicleTypeId', '1', true)}
                    >
                        <Car className="w-5 h-5" />
                        <span>Ô tô</span>
                    </button>

                    <button
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 ${filters.vehicleTypeId === '2' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleFilterChange('vehicleTypeId', '2', true)}
                    >
                        <FaMotorcycle className="w-5 h-5" />
                        <span>Xe máy</span>
                    </button>

                    <div className="relative">
                        <button
                            className={`flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-200 ${filters.brands ? 'bg-blue-50 text-blue-700' : ''}`}
                            onClick={() => toggleDropdown(setShowBrandDropdown, showBrandDropdown)}
                        >
                            <Factory className="w-5 h-5" />
                            <span>
                Hãng xe{filters.brands && `: ${brands.find(b => b.id === filters.brands)?.name || filters.brands}`}
              </span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showBrandDropdown && (
                            <div className="absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                    onClick={() => handleFilterChange('brands', '', false)}
                                >
                                    Tất cả Hãng
                                </button>
                                {brands.map((brand) => (
                                    <button
                                        key={brand.id}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                        onClick={() => handleFilterChange('brands', brand.id, false)}
                                    >
                                        {brand.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            className={`flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-200 ${filters.categories ? 'bg-blue-50 text-blue-700' : ''}`}
                            onClick={() => toggleDropdown(setShowCategoryDropdown, showCategoryDropdown)}
                        >
                            <FaCar className="w-5 h-5" />
                            <span>
                Loại xe{filters.categories && `: ${categories.find(c => c.id === filters.categories)?.name || filters.categories}`}
              </span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showCategoryDropdown && (
                            <div className="absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                    onClick={() => handleFilterChange('categories', '', false)}
                                >
                                    Tất cả Loại
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                        onClick={() => handleFilterChange('categories', category.id, false)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            className={`flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-200 ${filters.fuelType ? 'bg-blue-50 text-blue-700' : ''}`}
                            onClick={() => toggleDropdown(setShowFuelDropdown, showFuelDropdown)}
                        >
                            <Fuel className="w-5 h-5" />
                            <span>
                Nhiên liệu{filters.fuelType && `: ${fuelTypes.find(f => f.value === filters.fuelType)?.label || filters.fuelType}`}
              </span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFuelDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showFuelDropdown && (
                            <div className="absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5">
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                    onClick={() => handleFilterChange('fuelType', '', true)}
                                >
                                    Tất cả Nhiên liệu
                                </button>
                                {fuelTypes.map((fuel) => (
                                    <button
                                        key={fuel.value}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                        onClick={() => handleFilterChange('fuelType', fuel.value, true)}
                                    >
                                        {fuel.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            className={`flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-200 ${filters.location ? 'bg-blue-50 text-blue-700' : ''}`}
                            onClick={() => toggleDropdown(setShowLocationDropdown, showLocationDropdown)}
                        >
                            <MapPin className="w-5 h-5" />
                            <span>
                Khu vực{filters.location && `: ${filters.location}`}
              </span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showLocationDropdown && (
                            <div className="absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                    onClick={() => handleFilterChange('location', '', true)}
                                >
                                    Tất cả Khu vực
                                </button>
                                {locations.map((loc) => (
                                    <button
                                        key={loc}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                        onClick={() => handleFilterChange('location', loc, true)}
                                    >
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Vehicle List Section */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Danh sách các xe</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading || isSearching ? (
                        <div className="flex justify-center py-12 col-span-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                        </div>
                    ) : filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                                    {vehicle.imageUrl ? (
                                        <img
                                            src={getFullImageUrl(vehicle.imageUrl.split(',')[0])}
                                            alt={vehicle.vehicleName}
                                            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Car className="w-24 h-24 text-gray-300" />
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{vehicle.vehicleName || 'N/A'}</h3>
                                    <p className="text-sm text-gray-600 flex items-center mb-3">
                                        <MapPin className="w-4 h-4 mr-1 text-blue-500" /> {vehicle.location || 'N/A'}
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1 text-blue-500" />
                                            <span>{vehicle.seatCount || 'N/A'} Chỗ</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Fuel className="w-4 h-4 mr-1 text-blue-500" />
                                            <span>
                        {vehicle.fuelType === 'Gasoline' ? 'Xăng' :
                            vehicle.fuelType === 'Diesel' ? 'Dầu' :
                                vehicle.fuelType === 'Electric' ? 'Điện' :
                                    vehicle.fuelType === 'Hybrid' ? 'Hybrid' :
                                        vehicle.fuelType || 'N/A'}
                      </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Factory className="w-4 h-4 mr-1 text-blue-500" />
                                            <span>{getBrandName(vehicle.branchId) || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaCar className="w-4 h-4 mr-1 text-blue-500" />
                                            <span>{getCategoryName(vehicle.categoryId) || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 mr-1 text-blue-500"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect x="3" y="8" width="18" height="12" rx="1"></rect>
                                                <path d="M7 16h.01"></path>
                                                <path d="M17 16h.01"></path>
                                                <path d="M7 12h10"></path>
                                            </svg>
                                            <span>{vehicle.liecensePlate || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            {vehicle.vehicleTypeId === '1' ? (
                                                <Car className="w-4 h-4 mr-1 text-blue-500" />
                                            ) : (
                                                <FaMotorcycle className="w-4 h-4 mr-1 text-blue-500" />
                                            )}
                                            <span>{vehicle.vehicleTypeId === '1' ? 'Ô tô' : 'Xe máy'}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xl font-bold text-gray-900">{vehicle.pricePerDay?.toLocaleString('vi-VN')} đ/ngày</p>
                                        <button
                                            onClick={() => handleBookVehicle(vehicle.id)}
                                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                                            aria-label={`Xem chi tiết ${vehicle.vehicleName}`}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md col-span-full">
                            <Car className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy xe nào</h3>
                            <p className="text-gray-600">Hãy thử điều chỉnh bộ lọc để tìm kiếm xe phù hợp</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            aria-label="Trang trước"
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
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${currentPage === pageIndex ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                    aria-label={`Trang ${pageIndex + 1}`}
                                >
                                    {pageIndex + 1}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            aria-label="Trang sau"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Home;