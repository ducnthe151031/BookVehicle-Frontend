import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, User, Car, Check, X, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import CRMLayout from './Crm.jsx';
import {
    getRentals,
    getUserProfile,
    getCarDetails,
    approveBooking,
    rejectBooking,
    approveReturned
} from '../service/authentication.js';
import { FaListAlt as ClipboardList } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import {toast} from "react-toastify";

const RentalList = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);
    const [filters, setFilters] = useState({
        customerUsername: '',
        vehicleName: '',
        status: '',
        rentType: '',
        late: ''
    });
    const [showFilterForm, setShowFilterForm] = useState(false);
    const { customer } = useAuth();
    const [mapUrl, setMapUrl] = useState('');
    const [loadingLocationId, setLoadingLocationId] = useState(null);

    const fetchRentals = async (pageNumber = 0) => {
        setLoading(true);
        setError('');
        try {
            // Bước 1: Gọi API để lấy toàn bộ dữ liệu (hoặc dữ liệu đã lọc từ API nếu server hỗ trợ)
            const data = await getRentals(); // Gọi API không kèm theo tham số page

            if (data.httpStatus === 200) {
                const rentalsWithDetails = await Promise.all(data.data.content.map(async (rental) => {
                    const userResponse = await getUserProfile();
                    const carResponse = await getCarDetails(rental.vehicleId);
                    const startDate = new Date(rental.startDate);
                    const endDate = new Date(rental.endDate);
                    const hoursDiff = (endDate - startDate) / (1000 * 60 * 60);
                    const remainingHours = hoursDiff % 24;
                    const rentType = remainingHours === 0 ? 'Thuê theo ngày' : `Thuê theo giờ`;

                    return {
                        ...rental,
                        customerUsername: userResponse.data?.username || rental.customerId,
                        vehicleName: carResponse.data?.vehicleName || rental.vehicleId,
                        rentType: rentType,
                    };
                }));

                // Bước 2: Lọc danh sách đã lấy được từ API
                const filteredRentals = rentalsWithDetails.filter(rental => {
                    return (
                        (filters.customerUsername === '' || rental.customerUsername.toLowerCase().includes(filters.customerUsername.toLowerCase())) &&
                        (filters.vehicleName === '' || rental.vehicleName.toLowerCase().includes(filters.vehicleName.toLowerCase())) &&
                        (filters.status === '' || rental.status.toLowerCase().includes(filters.status.toLowerCase())) &&
                        (filters.rentType === '' || rental.rentType.toLowerCase().includes(filters.rentType.toLowerCase())) &&
                        (filters.late === '' || (filters.late === 'Có' ? rental.late : !rental.late))
                    );
                });

                // Bước 3: Phân trang danh sách đã lọc
                const newTotalPages = Math.ceil(filteredRentals.length / pageSize) || 1;
                setTotalPages(newTotalPages);

                // Kiểm tra nếu page hiện tại vượt quá tổng số trang mới, đặt lại về trang cuối cùng hợp lệ
                const newPage = pageNumber >= newTotalPages ? newTotalPages - 1 : pageNumber;
                if (newPage !== pageNumber) {
                    setPage(newPage);
                }

                const start = newPage * pageSize;
                const end = start + pageSize;
                const paginatedRentals = filteredRentals.slice(start, end);
                setRentals(paginatedRentals);

            } else {
                setError(data.message || 'Lỗi khi tải danh sách thuê xe');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    const handleShowMap = (rentalId) => {
        if (navigator.geolocation) {
            setLoadingLocationId(rentalId);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const url = `https://www.google.com/maps?q=${lat},${lon}&hl=vi&z=15&output=embed`;
                    setMapUrl(url);
                    setLoadingLocationId(null); // reset
                },
                (error) => {
                    toast.error("Không thể lấy vị trí: " + error.message);
                    setLoadingLocationId(null); // reset khi lỗi
                }
            );
        } else {
            toast.error("Trình duyệt không hỗ trợ định vị.");
        }
    };

    useEffect(() => {
        fetchRentals(page);
    }, [page, filters]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0); // Reset về trang đầu khi thay đổi filter
    };

    const handleApprove = async (bookingId) => {
        try {
            await approveBooking(bookingId);
            fetchRentals(page);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể phê duyệt đơn');
        }
    };

    const handleReject = async (bookingId) => {
        try {
            await rejectBooking(bookingId);
            fetchRentals(page);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể hủy đơn');
        }
    };

    const handleReturned = async (bookingId) => {
        try {
            await approveReturned(bookingId);
            fetchRentals(page);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xác nhận trả xe');
        }
    };

    const formatDate = (dateString, isHourly) => {
        const date = new Date(dateString);
        if (isHourly) {
            return date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
        } else {
            return date.toLocaleString('vi-VN', { dateStyle: 'short' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3">
                        <ClipboardList className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Danh Sách Thuê Xe</h1>
                    <p className="text-gray-600 text-sm">Quản lý các đơn thuê xe</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                Danh sách thuê xe
                            </h2>
                            <button
                                onClick={() => setShowFilterForm(!showFilterForm)}
                                className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-1"
                            >
                                <Filter className="w-4 h-4" />
                                {showFilterForm ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                            </button>
                        </div>
                    </div>

                    {showFilterForm && (
                        <div className="p-4 bg-gray-50 border-b">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Xe</label>
                                    <input
                                        type="text"
                                        name="vehicleName"
                                        value={filters.vehicleName}
                                        onChange={handleFilterChange}
                                        placeholder="Tìm theo tên xe..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/*<div>*/}
                                {/*    <label className="block text-sm font-medium text-gray-700 mb-1">Loại thuê</label>*/}
                                {/*    <select*/}
                                {/*        name="rentType"*/}
                                {/*        value={filters.rentType}*/}
                                {/*        onChange={handleFilterChange}*/}
                                {/*        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                                {/*    >*/}
                                {/*        <option value="">Tất cả</option>*/}
                                {/*        <option value="Thuê theo ngày">Thuê theo ngày</option>*/}
                                {/*        <option value="Thuê theo giờ">Thuê theo giờ</option>*/}
                                {/*    </select>*/}
                                {/*</div>*/}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trễ hạn</label>
                                    <select
                                        name="late"
                                        value={filters.late}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="Có">Có</option>
                                        <option value="Không">Không</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-4">
                        {loading && (
                            <div className="text-center text-gray-600 text-sm">Đang tải...</div>
                        )}
                        {error && (
                            <div className="mb-3 p-2 rounded-lg text-center font-medium bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        {!loading && rentals.length === 0 && !error && (
                            <div className="text-center text-gray-600 text-sm">Không có đơn thuê nào để hiển thị</div>
                        )}
                        {rentals.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng giá</th>
                                        {/*<th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại thuê</th>*/}
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trễ hạn</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phí trả thêm</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vị trí hiện tại
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {rentals.map((rental) => {
                                        const showApproveButton = rental.deliveryStatus === 'READY_TO_PICK';
                                        const isHourly = rental.rentType.includes('giờ');
                                        return (
                                            <tr key={rental.id} className="hover:bg-gray-50">
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3 text-gray-500" />
                                                        {rental.createdBy}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <Car className="w-3 h-3 text-gray-500" />
                                                        {rental.vehicleName}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-gray-500" />
                                                        {formatDate(rental.startDate, isHourly)}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-gray-500" />
                                                        {formatDate(rental.endDate, isHourly)}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3 text-gray-500" />
                                                        {rental.totalPrice ? rental.totalPrice.toLocaleString('vi-VN') : 'N/A'} VNĐ
                                                    </div>
                                                </td>
                                                {/*<td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">*/}
                                                {/*    {rental.rentType}*/}
                                                {/*</td>*/}
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    {rental.deliveryStatus === 'READY_TO_PICK' ? 'Chờ lấy xe'
                                                        : rental.deliveryStatus === 'TRANSIT' ? 'Đang giao xe'
                                                            : rental.deliveryStatus === 'DELIVERED' ? 'Đã nhận xe'
                                                                : rental.deliveryStatus === 'RETURNED' ? 'Đã trả xe' : 'N/A'}
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                    {rental?.late ? (
                                                        <span className="text-red-600 font-semibold">Có</span>
                                                    ) : (
                                                        <span className="text-gray-500">Không</span>
                                                    )}
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    {rental?.late && rental?.lateFee ? (
                                                        <>{rental.lateFee.toLocaleString('vi-VN')} VNĐ</>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                    {rental.deliveryStatus === 'DELIVERED' ? (
                                                        loadingLocationId === rental.id ? (
                                                            <button
                                                                disabled
                                                                className="px-2 py-1 bg-gray-400 text-white text-xs rounded flex items-center gap-1"
                                                            >
                                                                <svg
                                                                    className="animate-spin h-4 w-4 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    ></circle>
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                                    ></path>
                                                                </svg>
                                                                Đang lấy vị trí...
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleShowMap(rental.id)}
                                                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-all duration-200"
                                                            >
                                                                Xem vị trí
                                                            </button>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                    {showApproveButton && customer?.role === 'ROLE_OPERATOR' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleApprove(rental.id)}
                                                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-all duration-200"
                                                            >
                                                                Bắt đầu giao
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(rental.id)}
                                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-700 transition-all duration-200"
                                                            >
                                                                Hủy đơn
                                                            </button>
                                                        </div>
                                                    )}
                                                    {rental.deliveryStatus === 'RETURNED' && customer?.role === 'ROLE_OPERATOR'  && (
                                                        <button
                                                            onClick={() => handleReturned(rental.id)}
                                                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-all duration-200"
                                                        >
                                                            Xác nhận đã trả xe
                                                        </button>
                                                    )}
                                                    {rental.deliveryStatus === 'CONFIRM_RETURNED' && customer?.role === 'ROLE_OPERATOR'  && (
                                                        <p className="text-green-600 text-xs">Đơn hàng đã kết thúc</p>

                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                                {mapUrl && (
                                    <div className="mt-4">
                                        <iframe
                                            src={mapUrl}
                                            width="100%"
                                            height="400"
                                            allowFullScreen=""
                                            loading="lazy"
                                            className="rounded-lg shadow"
                                        ></iframe>
                                    </div>
                                )}
                                <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-300"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Trước
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Trang {page + 1} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages - 1}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-300"
                                    >
                                        Sau
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RentalListPage = () => (
    <CRMLayout>
        <RentalList />
    </CRMLayout>
);

export default RentalListPage;