import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Car, Users, Fuel, Star, ChevronDown, ChevronLeft, ChevronRight, MessageSquare, BookOpen, UserCircle, Phone, Mail, Home as HomeIcon } from 'lucide-react'; // Added new icons
import {useAuth} from "../context/AuthContext.jsx";
import {getBrands, getCategories, getVehicles} from "../service/authentication.js";

const LandingPage = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]); // Added categories for "Loại xe" dropdown
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        vehicleName: '',    // Backend filter (for general search, or could be location search as per image)
        brands: '',         // Backend filter (sends name)
        categories: '',     // Backend filter (sends name)
        status: '',         // Frontend filter: for "Sở hữu" (Cá nhân/Doanh nghiệp)
        startDate: '',      // Backend filter
        endDate: '',        // Backend filter
        pickupTime: '09:00', // New: for pickup time
        fuelEfficient: false, // Frontend filter
        fourPlusDoors: false, // Frontend filter
        vehicleTypeId: '',  // Frontend filter: 1 for Ô tô, 2 for Xe máy
        fuelType: '',       // Frontend filter: Hardcoded values
        location: ''        // Frontend filter: Hardcoded values
    });

    // Dropdown visibility states
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showFuelDropdown, setShowFuelDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showOwnershipDropdown, setShowOwnershipDropdown] = useState(false); // New: for "Sở hữu"

    // Hardcoded values for dropdowns and display
    const fuelTypes = ["DIESEL", "GASOLINE", "Điện", "Hybrid"];
    const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế", "Nha Trang"];
    const ownershipStatuses = ["Cá nhân", "Doanh nghiệp"]; // For "Sở hữu" filter

    // Dummy data for new sections
    const featuredVehiclesData = [
        // Using sample structures matching your vehicle cards, replace with actual featured data if available
        { id: 'feat1', vehicleName: 'Porsche Cayenne 2020', imageUrl: 'https://cdn.autopro.com.vn/2019/12/28/hinh-anh-xe-porsche-cayenne-2020-01-1577501064964645229606.jpg', location: 'Đường Hoàn Kiếm, Hà Nội', seatCount: 4, fuelType: 'Xăng', gearBox: 'Tự động', pricePerDay: 500000, status: 'AVAILABLE', brands: 'Porsche', categories: 'SUV', vehicleTypeId: '1' },
        { id: 'feat2', vehicleName: 'Maserati Levante 2021', imageUrl: 'https://dealer.maserati.com/maserati/vn/vi/models/levante/assets/images/design/design-gallery/gallery-ext-1.jpg', location: 'Đường Hoàn Kiếm, Hà Nội', seatCount: 4, fuelType: 'Xăng', gearBox: 'Tự động', pricePerDay: 500000, status: 'AVAILABLE', brands: 'Maserati', categories: 'SUV', vehicleTypeId: '1' },
        { id: 'feat3', vehicleName: 'Bentley Flying Spur', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Bentley_Flying_Spur_V8_S_-_FOS_2016.JPG/1200px-Bentley_Flying_Spur_V8_S_-_FOS_2016.JPG', location: 'Đường Hoàn Kiếm, Hà Nội', seatCount: 4, fuelType: 'Xăng', gearBox: 'Tự động', pricePerDay: 700000, status: 'AVAILABLE', brands: 'Bentley', categories: 'Sedan', vehicleTypeId: '1' },
    ];

    const newsArticles = [
        { id: 'news1', title: '2024 Porsche 911 S/T', imageUrl: 'https://thanhnien.vn/stores/news_dataimages/thuyvy/082023/25/11/porsche-911-st-moi-gia-hon-8-ti-dong-tai-viet-nam-anh-1.jpeg', date: '12 Tháng 8, 2023', description: 'Giới hạn 991 chiếc cho xe thuê 2024 Porsche 911 S/T lần đầu tiên trên thế giới.' },
        { id: 'news2', title: '2017 Alfa Romeo Giulia Quadrifoglio', imageUrl: 'https://www.alfaromeousa.com/content/dam/alfa/us/vehicles/giulia/quadrifoglio/2024/gallery/exterior/2024-Alfa-Romeo-Giulia-QV-Exterior-01.jpg', date: '10 Tháng 7, 2023', description: 'Giới thiệu về xe thuê 2017 Alfa Romeo Giulia Quadrifoglio.' },
        { id: 'news3', title: '2024 Buick Envision S', imageUrl: 'https://images.summitmedia-digital.com/topgear/images/2021/04/23/2021-buick-envision-s-sport-01-640x480.jpg', date: '16 Tháng 6, 2023', description: 'Giảm ngay 30% cho xe thuê 2024 Buick Envision S cho bạn bè ngày lần đầu tiên.' },
    ];


    // Current date for date input min
    const today = new Date().toISOString().split('T')[0];

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
                // Do not set loading to false here, as vehicles are fetched separately
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
                    status: filters.status, // If status is backend-handled for 'Sở hữu'
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
        filters.status, // Assuming status is a backend filter for now
        filters.startDate,
        filters.endDate,
        currentPage
    ]);

    // Apply ALL filters (both frontend and backend-related) to the 'vehicles' data
    useEffect(() => {
        let currentFiltered = [...vehicles]; // Start with the vehicles array fetched from backend

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

        // Frontend filter: Location (for the specific dropdown/input)
        if (filters.location) {
            currentFiltered = currentFiltered.filter(vehicle =>
                vehicle.location === filters.location
            );
        }

        // Frontend filter: Ownership Status (Sở hữu)
        if (filters.status) {
            currentFiltered = currentFiltered.filter(vehicle =>
                vehicle.status === filters.status // Assuming vehicle.status holds the ownership status
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
        vehicles, // Re-apply filters when backend data changes
        filters.vehicleTypeId,
        filters.fuelType,
        filters.location,
        filters.status, // Added status for frontend filtering
        filters.fuelEfficient,
        filters.fourPlusDoors
    ]);

    const handleFilterChange = (key, value, isFrontendFilter = false) => {
        if ((key === 'startDate' || key === 'endDate') && value) {
            const start = key === 'startDate' ? value : filters.startDate;
            const end = key === 'endDate' ? value : filters.endDate;
            if (start && end && new Date(start) > new Date(end)) {
                setError('Ngày trả phải sau ngày nhận.');
                return;
            }
        }
        setFilters(prev => ({ ...prev, [key]: value }));

        // Only reset page and trigger backend fetch for filters handled by the backend
        if (!isFrontendFilter) {
            setCurrentPage(0);
        }

        setError(null);
        closeAllDropdowns();
    };

    const clearFilters = () => {
        setFilters({
            vehicleName: '',
            brands: '',
            categories: '',
            status: '', // Clear status too
            startDate: '',
            endDate: '',
            pickupTime: '09:00', // Reset pickup time
            fuelEfficient: false,
            fourPlusDoors: false,
            vehicleTypeId: '',
            fuelType: '',
            location: ''
        });
        setCurrentPage(0); // Clearing all filters should reset page and re-fetch from backend
        setError(null);
        closeAllDropdowns();
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleBookVehicle = (vehicleId) => {
        navigate(`/${vehicleId}`);
    };

    // Helper to get brand name from ID (used for dropdown display, if needed)
    const getBrandName = (brandId) => {
        const brand = brands.find(b => b.id === brandId);
        return brand ? brand.name : 'N/A';
    };

    // Helper to get category name from ID (used for dropdown display, if needed)
    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'N/A';
    };

    const closeAllDropdowns = () => {
        setShowBrandDropdown(false);
        setShowCategoryDropdown(false);
        setShowFuelDropdown(false);
        setShowLocationDropdown(false);
        setShowOwnershipDropdown(false); // Close new ownership dropdown
    };

    const toggleDropdown = (setter, currentState) => {
        closeAllDropdowns();
        setter(!currentState);
    };

    // Unified loading check
    const isOverallLoading = loading || (vehicles.length === 0 && brands.length === 0 && categories.length === 0);

    if (isOverallLoading) {
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

            {/* Hero Section */}
            <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: 'url(https://img.thuvienanh.net/uploads/images/2022/04/13/thuvienanh.net-hinh-nen-o-to-hd-dep-nhat-cho-may-tinh-09.jpg)' }}>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
                    <h1 className="text-5xl font-bold text-center mb-4 leading-tight">
                        An Toàn, Nhanh Chóng, Thoải Mái
                    </h1>
                    <p className="text-xl text-center mb-8">
                        Tự do di chuyển
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300">
                        Thuê ngay
                    </button>
                </div>
            </div>

            {/* Main Search Bar (below hero) */}
            <div className="bg-white rounded-lg shadow-xl p-6 mx-auto max-w-5xl -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="flex flex-col">
                    <label htmlFor="location" className="text-gray-600 text-sm mb-1">Địa điểm nhận xe</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            id="location"
                            placeholder="Chọn một địa điểm"
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value, true)} // Frontend filter
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-700"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="pickupTime" className="text-gray-600 text-sm mb-1">Thời gian nhận xe</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="time"
                            id="pickupTime"
                            value={filters.pickupTime}
                            onChange={(e) => handleFilterChange('pickupTime', e.target.value, true)} // Frontend filter
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
                            value={filters.startDate}
                            min={today}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)} // Backend filter
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
                            value={filters.endDate}
                            min={filters.startDate || today}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)} // Backend filter
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-700"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setCurrentPage(0)} // Triggers backend fetch with current filters
                    className="col-span-1 md:col-span-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                    <Search className="w-5 h-5" />
                    <span>Tìm xe</span>
                </button>
            </div>

            {/* Thuê theo hãng xe (Rent by Brand) Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Thuê theo hãng xe</h2>
                    <button
                        onClick={() => handleFilterChange('brands', '', false)} // Clear brand filter
                        className="text-red-600 hover:underline text-sm"
                    >
                    </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                    {brands.map((brand) => (
                        <button
                            key={brand.id}
                            onClick={() => handleFilterChange('brands', brand.name, false)}
                            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Replace with actual brand logos if available */}
                            <img src={`https://via.placeholder.com/60x60?text=${brand.name.substring(0,2)}`} alt={brand.name} className="w-12 h-12 mb-2 object-contain" />
                            <span className="text-sm font-medium text-gray-700">{brand.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* "Bạn muốn tìm xe như thế nào" (How do you want to find a car?) Filters */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Bạn muốn tìm xe như thế nào</h2>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {/* Tất cả xe */}
                    <button
                        className={`flex items-center space-x-2 px-6 py-3 rounded-full shadow-md transition-colors ${Object.values(filters).every(f => !f && !filters.fuelEfficient && !filters.fourPlusDoors && filters.pickupTime === '09:00') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={clearFilters}
                    >
                        <Car className="w-5 h-5" />
                        <span>Tất cả xe</span>
                    </button>

                    {/* Sở hữu (Ownership) Dropdown - Frontend Filter */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() => toggleDropdown(setShowOwnershipDropdown, showOwnershipDropdown)}
                        >
                            <Users className="w-5 h-5" />
                            <span>Sở hữu {filters.status && `: ${filters.status}`}</span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showOwnershipDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showOwnershipDropdown && (
                            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => { e.preventDefault(); handleFilterChange('status', '', true); }}
                                >
                                    Tất cả Sở hữu
                                </a>
                                {ownershipStatuses.map((status) => (
                                    <a
                                        key={status}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => { e.preventDefault(); handleFilterChange('status', status, true); }}
                                    >
                                        {status}
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
                            <Fuel className="w-5 h-5" />
                            <span>Nhiên liệu {filters.fuelType && `: ${filters.fuelType}`}</span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFuelDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showFuelDropdown && (
                            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => { e.preventDefault(); handleFilterChange('fuelType', '', true); }}
                                >
                                    Tất cả Nhiên liệu
                                </a>
                                {fuelTypes.map((fuel) => (
                                    <a
                                        key={fuel}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => { e.preventDefault(); handleFilterChange('fuelType', fuel, true); }}
                                    >
                                        {fuel}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Loại xe (Categories) Dropdown - Backend Filter, but presented here */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() => toggleDropdown(setShowCategoryDropdown, showCategoryDropdown)}
                        >
                            <Car className="w-5 h-5" /> {/* Use Car icon as per image */}
                            <span>Loại xe {filters.categories && `: ${filters.categories}`}</span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showCategoryDropdown && (
                            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => { e.preventDefault(); handleFilterChange('categories', '', false); }}
                                >
                                    Tất cả Loại
                                </a>
                                {categories.map((category) => (
                                    <a
                                        key={category.id}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => { e.preventDefault(); handleFilterChange('categories', category.name, false); }}
                                    >
                                        {category.name}
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
                            <MapPin className="w-5 h-5" />
                            <span>Khu vực {filters.location && `: ${filters.location}`}</span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showLocationDropdown && (
                            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => { e.preventDefault(); handleFilterChange('location', '', true); }}
                                >
                                    Tất cả Khu vực
                                </a>
                                {locations.map((loc) => (
                                    <a
                                        key={loc}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => { e.preventDefault(); handleFilterChange('location', loc, true); }}
                                    >
                                        {loc}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Vehicle Listing */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Danh sách các xe</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading && filteredVehicles.length === 0 ? (
                        <div className="flex justify-center py-12 col-span-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                        </div>
                    ) : filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {vehicle.imageUrl ? (
                                        <img
                                            src={vehicle.imageUrl}
                                            alt={vehicle.vehicleName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Car className="w-24 h-24 text-gray-300" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.vehicleName}</h3>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                        <span className="text-sm text-gray-600 ml-1">4.8 (436 Đánh giá)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center mb-3">
                                        <MapPin className="w-4 h-4 mr-1 text-gray-500" /> {vehicle.location || 'N/A'}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1 text-gray-500" />
                                            <span>{vehicle.seatCount || 'N/A'} Chỗ</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Fuel className="w-4 h-4 mr-1 text-gray-500" />
                                            <span>{vehicle.gearBox || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500" />
                                            <span>{vehicle.fuelType || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500" />
                                            <span>{vehicle.brands || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500" />
                                            <span>{vehicle.categories || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500" />
                                            <span>{vehicle.status || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-1 text-gray-500" />
                                            <span>
                                                {vehicle.vehicleTypeId === 1 ? 'Ô tô' :
                                                    vehicle.vehicleTypeId === 2 ? 'Xe máy' : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                        <p className="text-2xl font-bold text-gray-900">{vehicle.pricePerDay?.toLocaleString()}đ/ngày</p>
                                        <button
                                            onClick={() => handleBookVehicle(vehicle.id)}
                                            disabled={vehicle.status !== 'AVAILABLE'}
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
                            <Car className="w-20 h-20 text-gray-300 mx-auto mb-4" />
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

            {/* Xe nổi bật nhất (Most Featured Cars) Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center w-full">Xe nổi bật nhất</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredVehiclesData.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                {vehicle.imageUrl ? (
                                    <img src={vehicle.imageUrl} alt={vehicle.vehicleName} className="w-full h-full object-cover" />
                                ) : (
                                    <Car className="w-24 h-24 text-gray-300" />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.vehicleName}</h3>
                                <div className="flex items-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">4.8 (436 Đánh giá)</span>
                                </div>
                                <p className="text-sm text-gray-600 flex items-center mb-3">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-500" /> {vehicle.location || 'N/A'}
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1 text-gray-500" />
                                        <span>{vehicle.seatCount || 'N/A'} Chỗ</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Fuel className="w-4 h-4 mr-1 text-gray-500" />
                                        <span>{vehicle.gearBox || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Car className="w-4 h-4 mr-1 text-gray-500" />
                                        <span>{vehicle.fuelType || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Car className="w-4 h-4 mr-1 text-gray-500" />
                                        <span>{vehicle.brands || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                    <p className="text-2xl font-bold text-gray-900">{vehicle.pricePerDay?.toLocaleString()}đ/ngày</p>
                                    <button
                                        onClick={() => handleBookVehicle(vehicle.id)}
                                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-medium text-base"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button onClick={() => setCurrentPage(0)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors font-medium">
                        Xem tất cả &rarr;
                    </button>
                </div>
            </div>

            {/* Tin tức (News) Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tin tức</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {newsArticles.map((article) => (
                        <div key={article.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                            <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{article.date}</p>
                                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{article.description}</p>
                                <button className="text-red-600 hover:underline text-sm font-medium flex items-center">
                                    Đọc thêm <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cách Thuê Xe (How to Rent a Car) Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 bg-white rounded-lg shadow-md mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Cách Thuê Xe</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <Search className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">Tìm và chọn</h3>
                                <p className="text-gray-700">
                                    Chọn trong hàng nhiều chiếc xe của chúng tôi: chọn thời gian, địa điểm phù hợp với bạn nhất.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <BookOpen className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">Đặt và xác nhận</h3>
                                <p className="text-gray-700">
                                    Đặt chiếc xe bạn mong muốn chỉ với 1 cú nhấp chuột và nhận thông tin từ chúng tôi qua email và SMS.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Car className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">Tận hưởng chuyến đi của bạn</h3>
                                <p className="text-gray-700">
                                    Nhận chiếc xe của bạn ở địa điểm mong muốn và tận hưởng chuyến đi của bạn.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <img src="https://dealer.chrysler.com/blog/wp-content/uploads/2021/04/2021-Jeep-Wrangler-Unlimited-Sahara-Altitude.jpg" alt="How to Rent a Car" className="rounded-lg shadow-xl max-w-full h-auto" />
                    </div>
                </div>
            </div>

            {/* Nhận xét của khách hàng (Customer Reviews) Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Nhận xét của khách hàng</h2>
                <div className="relative bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-center items-center">
                        <ChevronLeft className="w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-600" />
                        <div className="text-center mx-8 max-w-3xl">
                            <p className="text-lg text-gray-700 mb-6 italic">
                                “Tôi thật sự ấn tượng với chất lượng dịch vụ mà tôi nhận được từ công ty cho thuê xe này. Quy trình thuê xe diễn ra suôn sẻ và dễ dàng, và chiếc xe tôi thuê thì trong tình trạng tuyệt vời. Nhân viên rất thân thiện và nhiệt tình, khiến tôi cảm thấy được chăm sóc chu đáo trong suốt thời gian thuê xe. Tôi chắc chắn sẽ giới thiệu công ty này đến bất kỳ ai đang tìm kiếm trải nghiệm thuê xe cao cấp.”
                            </p>
                            <div className="flex items-center justify-center space-x-3">
                                <img src="https://i.pravatar.cc/50?img=68" alt="Loki Nguyen" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold text-gray-800">Loki Nguyen</p>
                                    <p className="text-sm text-gray-500">Hà Nội</p>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                </div>
            </div>

            {/* Bạn muốn cho thuê xe? Hãy đăng ký ngay (Register Your Car) Form */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Bạn muốn cho thuê xe? Hãy đăng ký ngay</h2>
                <div className="bg-white rounded-lg shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="ownerName" className="text-gray-600 text-sm mb-1">Nhập tên của bạn</label>
                        <input type="text" id="ownerName" placeholder="Tên của bạn" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="ownerPhone" className="text-gray-600 text-sm mb-1">Số điện thoại</label>
                        <input type="tel" id="ownerPhone" placeholder="Số điện thoại" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="ownerCity" className="text-gray-600 text-sm mb-1">Thành phố</label>
                        <input type="text" id="ownerCity" placeholder="Thành phố" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="ownerDistrict" className="text-gray-600 text-sm mb-1">Quận / Huyện</label>
                        <input type="text" id="ownerDistrict" placeholder="Quận / Huyện" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="flex flex-col col-span-full">
                        <label htmlFor="ownerAddress" className="text-gray-600 text-sm mb-1">Địa chỉ</label>
                        <input type="text" id="ownerAddress" placeholder="Địa chỉ chi tiết" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="carBrand" className="text-gray-600 text-sm mb-1">Hãng xe</label>
                        <input type="text" id="carBrand" placeholder="Hãng xe" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="carModel" className="text-gray-600 text-sm mb-1">Mẫu xe</label>
                        <input type="text" id="carModel" placeholder="Mẫu xe" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="col-span-full text-center mt-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300">
                            Cho thuê ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;