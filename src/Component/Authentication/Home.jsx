import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

import { Search, Lock, User, Car, Calendar, MapPin, Fuel, Users, Star, Filter, Grid, List, Menu, X, ChevronDown } from 'lucide-react';

import { Search, Lock, User, Car, Calendar, MapPin, Fuel, Users, Star, Filter, Grid, List, Menu, X } from 'lucide-react';

import { getBrands, getCategories, getVehicles } from "../../service/authentication.js";
import Header from "../Header.jsx";

const Home = () => {

    const {customer, logOut} = useAuth();

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

// ** Helper function to construct the full image URL **
    const getFullImageUrl = (filename) => {
        if (!filename) return null;
        // ** Adjust this base URL to match your backend's image serving endpoint **
        return `http://localhost:8080/v1/user/images/${filename}`;
    };

// Fetch initial data (brands, categories) once

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


                const [brandsRes, categoriesRes] = await Promise.all([

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


                if (brandsRes.httpStatus === 200) {
                    setBrands(brandsRes.data || []);
                } else {
                    setError('Không thể tải danh sách hãng xe.');

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

                } else {
                    setError('Không thể tải danh sách loại xe.');
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setError('Có lỗi xảy ra khi tải dữ liệu ban đầu.');
            } finally {
                setLoading(false); // Set loading false after fetching brands and categories

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


// Fetch vehicles from backend when server-side filters or page changes

    // Fetch vehicles when server-side filters or page changes

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                setError(null);


                const serverFilters = {

                const response = await getVehicles(currentPage, 20, {

                    vehicleName: filters.vehicleName,
                    brands: filters.brands,
                    categories: filters.categories,
                    status: filters.status,
                    startDate: filters.startDate,
                    endDate: filters.endDate

                };

                const response = await getVehicles(currentPage, 20, serverFilters);

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

        setFilters(prev => ({...prev, [key]: value}));

        if (!isFrontendFilter) {
            setCurrentPage(0);
        }

        setError(null);
        closeAllDropdowns();

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

            fourPlusDoors: false,
            vehicleTypeId: '',
            fuelType: '',
            location: ''
        });
        setCurrentPage(0);
        setError(null);
        closeAllDropdowns();

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

    if (loading && vehicles.length === 0 && brands.length === 0 && categories.length === 0) {

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

        <div className="min-h-screen bg-gray-50 font-sans">
            <Header logOut={logOut} handleChangePassword={handleChangePassword} customer={customer}/>

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
                    {loading && filteredVehicles.length === 0 ? (
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
                                            src={getFullImageUrl(vehicle.imageUrl)} // ** Use the helper function here **
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