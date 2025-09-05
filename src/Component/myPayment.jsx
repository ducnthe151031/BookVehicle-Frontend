import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, User, Car, Check, X, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import CRMLayout from './Crm.jsx';
import {
    getRentals,
    getUserProfile,
    getCarDetails,
    approveBooking,
    rejectBooking,
    getMyRentals,
    deliveredBooking,
    payLateFee,
    returnBooking
} from '../service/authentication.js';
import Header from "./Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useTracking} from "./useTracking.jsx";

const MyPayment = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5); // Số lượng đơn thuê mỗi trang
    const [filters, setFilters] = useState({
        vehicleName: '',
        deliveryStatus: '',
        rentType: '',
        late: ''
    });
    const [showFilterForm, setShowFilterForm] = useState(false);
    const { customer, logOut } = useAuth();
    const navigate = useNavigate();
    const [mapUrl, setMapUrl] = useState('');
    const userId = customer?.username;
    const [loadingLocationId, setLoadingLocationId] = useState(null);

    const TrackingWrapper = ({ vehicleId, userId }) => {
        useTracking(vehicleId, userId);
        return null; // không render gì, chỉ chạy tracking
    };

    const fetchRentals = async (pageNumber) => {
        setLoading(true);
        setError('');
        try {
            const data = await getMyRentals(0); // always fetch all, like RentalList
            if (data.httpStatus === 200) {
                const rentalsWithDetails = await Promise.all(data.data.content.map(async (rental) => {
                    const carResponse = await getCarDetails(rental.vehicleId);
                    // Tính toán rentType dựa trên chênh lệch thời gian
                    const startDate = new Date(rental.startDate);
                    const endDate = new Date(rental.endDate);
                    const timeDiffMs = endDate - startDate;
                    const hoursDiff = timeDiffMs / (1000 * 60 * 60);

                    let rentType;
                    const days = Math.floor(hoursDiff / 24);
                    const remainingHours = hoursDiff % 24;

                    if (remainingHours === 0) {
                        rentType = 'Thuê theo ngày';
                    } else {
                        rentType = `Thuê theo giờ`; // Tùy chỉnh với số giờ dư
                    }

                    return {
                        ...rental,
                        vehicleName: carResponse.data?.vehicleName || rental.vehicleId,
                        rentType: rentType,
                    };
                }));
                // Lọc danh sách dựa trên searchTerm
                const filteredRentals = rentalsWithDetails.filter(rental =>
                    (filters.vehicleName === '' || rental.vehicleName.toLowerCase().includes(filters.vehicleName.toLowerCase())) &&
                    (filters.deliveryStatus === '' || rental.deliveryStatus.toLowerCase().includes(filters.deliveryStatus.toLowerCase())) &&
                    (filters.rentType === '' || rental.rentType.toLowerCase().includes(filters.rentType.toLowerCase())) &&
                    (filters.late === '' || (filters.late === 'Có' ? rental.late : !rental.late))
                );
                const newTotalPages = Math.ceil(filteredRentals.length / pageSize) || 1;
                setTotalPages(newTotalPages);
                // Validate page
                const newPage = page >= newTotalPages ? newTotalPages - 1 : page;
                if (newPage !== page) {
                    setPage(newPage);
                }
                const start = newPage * pageSize;
                const paginatedRentals = filteredRentals.slice(start, start + pageSize);
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
        // eslint-disable-next-line
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
            await deliveredBooking(bookingId);
            // Refresh the list after approval
            fetchRentals(page);
            toast.success('Xác nhận nhận xe thành công!');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xác nhận nhận xe');
            toast.error(err.response?.data?.message || 'Không thể xác nhận nhận xe');
        }
    };

    const handleReturn = async (bookingId) => {
        try {
            await returnBooking(bookingId);
            fetchRentals(page);
            toast.success('Yêu cầu được gửi tới cho hệ thống!');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xác nhận nhận xe');
            toast.error(err.response?.data?.message || 'Không thể xác nhận nhận xe');
        }
    };

    const handleReject = async (bookingId) => {
        try {
            await rejectBooking(bookingId);
            // Refresh the list after approval
            fetchRentals(page);
            toast.success('Hủy đơn thành công!');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể hủy đơn');
            toast.error(err.response?.data?.message || 'Không thể hủy đơn');
        }
    };

    const getStatusDisplay = (status) => {
        const statusMap = {
            READY_TO_PICK: { text: 'Chờ lấy xe', color: 'bg-yellow-100 text-yellow-800' },
            TRANSIT: { text: 'Đang giao', color: 'bg-green-100 text-green-800' },
            DELIVERED: { text: 'Đã giao', color: 'bg-red-100 text-red-800' },
            RETURNED: { text: 'Đã trả', color: 'bg-gray-100 text-gray-800' },
        };
        return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    };

    const formatDate = (dateString, isHourly) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleLateFeePayment = async (id) => {
        try {
            const response = await axios.post(`http://localhost:8080/v1/user/payLateFee/${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const paymentUrl = response.data.data.url;
            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                toast.error('Không tìm thấy URL thanh toán!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate(-1);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header logOut={logOut} handleChangePassword={handleChangePassword} customer={customer} />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3">
                        <Car className="w-7 h-7 text-white"/>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Danh Sách Thuê Xe</h1>
                    <p className="text-gray-600 text-sm">Quản lý các đơn thuê xe</p>
                </div>

                {/* Thêm bộ lọc tìm kiếm */}


                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Car className="w-5 h-5" />
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên xe</label>
                                    <input
                                        type="text"
                                        name="vehicleName"
                                        value={filters.vehicleName}
                                        onChange={handleFilterChange}
                                        placeholder="Tìm theo tên xe..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                    <select
                                        name="deliveryStatus"
                                        value={filters.deliveryStatus}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="READY_TO_PICK">Chờ lấy xe</option>
                                        <option value="TRANSIT">Đang giao</option>
                                        <option value="DELIVERED">Đã giao</option>
                                        <option value="RETURNED">Đã trả</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại thuê</label>
                                    <select
                                        name="rentType"
                                        value={filters.rentType}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="Thuê theo ngày">Thuê theo ngày</option>
                                        <option value="Thuê theo giờ">Thuê theo giờ</option>
                                    </select>
                                </div>
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
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng giá</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái duyệt</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại thuê</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trễ hạn</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phí trả thêm</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {rentals.map((rental) => {
                                        const statusDisplay = getStatusDisplay(rental.deliveryStatus);
                                        const showApproveButton = rental.deliveryStatus === 'TRANSIT';
                                        const showConfirmReturnedButton = rental.deliveryStatus === 'DELIVERED';
                                        const isHourly = rental.rentType.includes('giờ');
                                        return (
                                            <React.Fragment key={rental.id}>
                                            <tr key={rental.id} className="hover:bg-gray-50">

                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <Car className="w-3 h-3 text-gray-500"/>
                                                        {rental.vehicleName}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-gray-500"/>
                                                        {formatDate(rental.startDate, isHourly)}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-gray-500"/>
                                                        {formatDate(rental.endDate, isHourly)}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3 text-gray-500"/>
                                                        {rental.totalPrice ? rental.totalPrice.toLocaleString('vi-VN') : 'N/A'} VNĐ
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                        <span
                                                            className={`inline-block py-0.5 px-2 text-xs font-medium rounded-full ${statusDisplay.color}`}>
                                                            {statusDisplay.text}
                                                        </span>
                                                </td>

                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    {rental.rentType}
                                                </td>

                                                <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                    {rental?.late  ? (
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
                                                    <div className="flex gap-2">
                                                        {rental?.late && rental?.lateFee > 0 && !rental?.lateFeePaid && (
                                                            <button
                                                                onClick={() => handleLateFeePayment(rental.id)}
                                                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-all duration-200"
                                                            >
                                                                Thanh toán
                                                            </button>
                                                        )}
                                                        {rental?.lateFeePaid && (
                                                            <p className="text-green-600 text-xs">Đã thanh toán phí muộn</p>
                                                        )}
                                                        {rental?.deliveryStatus === 'RETURNED' && (
                                                            <p className="text-green-600 text-xs">Đạng đợi phản hồi từ hệ thống</p>
                                                        )}
                                                        {rental.deliveryStatus === 'CONFIRM_RETURNED' && customer?.role === 'ROLE_OPERATOR'  && (
                                                            <p className="text-green-600 text-xs">Đơn hàng đã kết thúc</p>

                                                        )}
                                                        {showApproveButton && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(rental.id)}
                                                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-all duration-200"
                                                                >
                                                                    Đã nhận xe
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(rental.id)}
                                                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-all duration-200"
                                                                >
                                                                    Hủy đơn
                                                                </button>
                                                            </>
                                                        )}
                                                        {showConfirmReturnedButton && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleReturn(rental.id)}
                                                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-all duration-200"
                                                                >
                                                                    Trả xe
                                                                </button>

                                                            </>
                                                        )}

                                                    </div>
                                                </td>
                                            </tr>
                                                {rental.deliveryStatus === "DELIVERED" && (
                                                    <TrackingWrapper vehicleId={rental.vehicleId} userId={userId} />
                                                )}
                                            </React.Fragment>
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
                                        aria-label="Trang trước"
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
                                        aria-label="Trang sau"
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

export default MyPayment;

