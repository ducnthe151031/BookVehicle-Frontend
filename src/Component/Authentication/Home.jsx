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
    Clock
} from 'lucide-react';
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
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false); // Thêm trạng thái giả lập loading

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
    const fuelTypes = ["DIESEL", "GASOLINE", "Điện", "Hybrid"];
    const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế", "Nha Trang"];

    // Current date for date input min
    const today = new Date().toISOString().split('T')[0];

    // Helper function to construct the full image URL
    const getFullImageUrl = (filename) => {
        if (!filename) return null;
        return `http://localhost:8080/v1/user/images/${filename}`;
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
                    setError('Không thể tải danh sách hãng xe.');
                }

                if (categoriesRes.httpStatus === 200) {
                    setCategories(categoriesRes.data || []);
                } else {
                    setError('Không thể tải danh sách loại xe.');
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setError('Có lỗi xảy ra khi tải dữ liệu ban đầu.');
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
                    endDate: filters.endDate
                };

                const response = await getVehicles(currentPage, 20, serverFilters);
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
    }, [
        filters.vehicleName,
        filters.brands,
        filters.categories,
        filters.status,
        filters.startDate,
        filters.endDate,
        currentPage
    ]);

    // Apply ALL filters (both frontend and backend-related) to the 'vehicles' data
    useEffect(() => {
        let currentFiltered = [...vehicles];

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
            // Nếu người dùng chỉ chọn ngày thì thêm giờ mặc định
            if (!value.includes('T')) {
                newValue = `${value}T00:00:00`;
            }

            const start = key === 'startDate' ? newValue : filters.startDate;
            const end = key === 'endDate' ? newValue : filters.endDate;

            if (start && end && new Date(start) > new Date(end)) {
                setError('Ngày trả phải sau ngày nhận.');
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

    // Hàm giả lập tìm kiếm với hiệu ứng loading
    const handleSearch = async () => {
        if (!filters.startDate || !filters.endDate) {
            setError('Vui lòng chọn cả ngày nhận và ngày trả.');
            return;
        }

        setIsSearching(true); // Bắt đầu hiệu ứng loading
        setError(null);

        // Giả lập độ trễ 1.5 giây trước khi gọi API
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Reset currentPage và gọi lại fetchVehicles
        setCurrentPage(0);
        try {
            const serverFilters = {
                vehicleName: filters.vehicleName,
                brands: filters.brands,
                categories: filters.categories,
                status: filters.status,
                startDate: filters.startDate,
                endDate: filters.endDate
            };
            const response = await getVehicles(0, 20, serverFilters);
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
            setIsSearching(false); // Kết thúc hiệu ứng loading
        }
    };

    if (loading && vehicles.length === 0 && brands.length === 0 && categories.length === 0) {
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
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header logOut={logOut} handleChangePassword={handleChangePassword} customer={customer} />
            <div className="bg-white rounded-lg shadow-xl p-6 mx-auto max-w-5xl mt-40 relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="flex flex-col">
                    <label htmlFor="location" className="text-gray-600 text-sm mb-1">Địa điểm nhận xe</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            id="location"
                            placeholder="Chọn một địa điểm"
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value, true)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-700"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="startDate" className="text-gray-600 text-sm mb-1">Ngày nhận xe</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="date"
                            id="startDate"
                            value={filters.startDate?.slice(0, 10) || ''}
                            min={today}
                            onChange={(e) => {
                                const rawDate = e.target.value;
                                const formatted = `${rawDate}T00:00:00`;
                                handleFilterChange('startDate', formatted);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-700"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="endDate" className="text-gray-600 text-sm mb-1">Ngày trả xe</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="date"
                            id="endDate"
                            value={filters.endDate?.slice(0, 10) || ''}
                            min={filters.startDate?.slice(0, 10) || today}
                            onChange={(e) => {
                                const rawDate = e.target.value;
                                const formatted = `${rawDate}T00:00:00`;
                                handleFilterChange('endDate', formatted);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-700"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSearch} // Sử dụng hàm handleSearch thay vì setCurrentPage trực tiếp
                    disabled={isSearching || !filters.startDate || !filters.endDate}
                    className={`col-span-1 md:col-span-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2 ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSearching ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <Search className="w-5 h-5" />
                            <span>Tìm một chiếc xe</span>
                        </>
                    )}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Danh sách các xe</h1>

                {/* Filter Buttons Section */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {/* Tất cả xe */}
                    <button
                        className={`flex items-center space-x-2 px-6 py-3 rounded-full shadow-md transition-colors ${Object.values(filters).every(f => !f && !filters.fuelEfficient && !filters.fourPlusDoors) ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={clearFilters}
                    >
                        <Car className="w-5 h-5"/>
                        <span>Tất cả xe</span>
                    </button>

                    <button
                        className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-colors ${filters.vehicleTypeId === '1' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleFilterChange('vehicleTypeId', '1', true)}
                    >
                        <Car className="w-5 h-5"/>
                        <span>Ô tô</span>
                    </button>

                    <button
                        className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-colors ${filters.vehicleTypeId === '2' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleFilterChange('vehicleTypeId', '2', true)}
                    >
                        <Car className="w-5 h-5"/>
                        <span>Xe máy</span>
                    </button>

                    {/* Hãng xe (Brands) Dropdown - Backend Filter */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() => toggleDropdown(setShowBrandDropdown, showBrandDropdown)}
                        >
                            <Car className="w-5 h-5"/>
                            <span>Hãng xe {filters.brands && `: ${filters.brands}`}</span>
                            <ChevronDown
                                className={`w-4 h-4 ml-2 transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`}/>
                        </button>
                        {showBrandDropdown && (
                            <div
                                className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
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
                                            handleFilterChange('brands', brand.name, false);
                                        }}
                                    >
                                        {brand.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Loại xe (Categories) Dropdown - Backend Filter */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() => toggleDropdown(setShowCategoryDropdown, showCategoryDropdown)}
                        >
                            <Car className="w-5 h-5"/>
                            <span>Loại xe {filters.categories && `: ${filters.categories}`}</span>
                            <ChevronDown
                                className={`w-4 h-4 ml-2 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}/>
                        </button>
                        {showCategoryDropdown && (
                            <div
                                className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
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
                                            handleFilterChange('categories', category.name, false);
                                        }}
                                    >
                                        {category.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Nhiên liệu (Fuel) Dropdown - Frontend Filter */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() => toggleDropdown(setShowFuelDropdown, showFuelDropdown)}
                        >
                            <Fuel className="w-5 h-5"/>
                            <span>Nhiên liệu {filters.fuelType && `: ${filters.fuelType}`}</span>
                            <ChevronDown
                                className={`w-4 h-4 ml-2 transition-transform ${showFuelDropdown ? 'rotate-180' : ''}`}/>
                        </button>
                        {showFuelDropdown && (
                            <div
                                className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
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
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Khu vực (Location) Dropdown - Frontend Filter */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() => toggleDropdown(setShowLocationDropdown, showLocationDropdown)}
                        >
                            <MapPin className="w-5 h-5"/>
                            <span>Khu vực {filters.location && `: ${filters.location}`}</span>
                            <ChevronDown
                                className={`w-4 h-4 ml-2 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`}/>
                        </button>
                        {showLocationDropdown && (
                            <div
                                className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleFilterChange('location', '', true);
                                    }}
                                >
                                    Tất cả Khu vực
                                </a>
                                {locations.map((loc) => (
                                    <a
                                        key={loc}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFilterChange('location', loc, true);
                                        }}
                                    >
                                        {loc}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Vehicle Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading || isSearching ? (
                        <div className="flex justify-center py-12 col-span-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                        </div>
                    ) : filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                            <div key={vehicle.id}
                                 className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                                {/* Car Image */}
                                <div
                                    className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {vehicle.imageUrl ? (
                                        <img
                                            src={getFullImageUrl(vehicle.imageUrl)}
                                            alt={vehicle.vehicleName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Car className="w-24 h-24 text-gray-300"/>
                                    )}
                                </div>

                                {/* Car Details */}
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.vehicleName}</h3>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current"/>
                                        ))}
                                        <span className="text-sm text-gray-600 ml-1">4.8 (436 Đánh giá)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center mb-3">
                                        <MapPin className="w-4 h-4 mr-1 text-gray-500"/> {vehicle.location || 'N/A'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1 text-gray-500"/>
                                            <span>{vehicle.seatCount || 'N/A'} Chỗ</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Fuel className="w-4 h-4 mr-1 text-gray-500"/>
                                            <span>{vehicle.gearBox || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500"/>
                                            <span>{vehicle.fuelType || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500"/>
                                            <span>{getBrandName(vehicle.branchId) || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500"/>
                                            <span>{getCategoryName(vehicle.categoryId) || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500"/>
                                            <span>{vehicle.status || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500"/>
                                            <span>
                                            {vehicle.vehicleTypeId === 1 ? 'Ô tô' :
                                                vehicle.vehicleTypeId === 2 ? 'Xe máy' : 'N/A'}
                                        </span>
                                        </div>
                                    </div>

                                    <div
                                        className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                        <p className="text-2xl font-bold text-gray-900">{vehicle.pricePerDay?.toLocaleString()}đ/ngày</p>
                                        <button
                                            onClick={() => handleBookVehicle(vehicle.id)}
                                            // disabled={vehicle.status !== 'AVAILABLE'}
                                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-base"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg col-span-full shadow-md">
                            <Car className="w-20 h-20 text-gray-300 mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy xe nào</h3>
                            <p className="text-gray-600">Hãy thử điều chỉnh bộ lọc để tìm kiếm xe phù hợp</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-10">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700"
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
                                    className={`px-4 py-2 rounded-lg ${currentPage === pageIndex ? 'bg-red-600 text-white' : 'border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                                >
                                    {pageIndex + 1}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700"
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