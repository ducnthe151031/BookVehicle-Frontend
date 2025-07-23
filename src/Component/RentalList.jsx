import React, {useState, useEffect} from 'react';
import {Calendar, DollarSign, User, Car, Check, X, CheckCircle, XCircle} from 'lucide-react';
import CRMLayout from './Crm.jsx';
import {
    getRentals,
    getUserProfile,
    getCarDetails,
    approveBooking,
    rejectBooking,
    approveReturned
} from '../service/authentication.js';
import {FaListAlt as ClipboardList} from "react-icons/fa";
import {useAuth} from "../context/AuthContext.jsx";

const RentalList = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho tìm kiếm
    const {customer} = useAuth();

    const fetchRentals = async (pageNumber) => {
        setLoading(true);
        setError('');
        try {
            const data = await getRentals(pageNumber);
            if (data.httpStatus === 200) {
                const rentalsWithDetails = await Promise.all(data.data.content.map(async (rental) => {
                    const userResponse = await getUserProfile();
                    const carResponse = await getCarDetails(rental.vehicleId);
                    // Tính toán rentType dựa trên chênh lệch thời gian
                    const startDate = new Date(rental.startDate);
                    const endDate = new Date(rental.endDate);
                    const timeDiffMs = endDate - startDate; // Chênh lệch thời gian tính bằng mili giây
                    const hoursDiff = timeDiffMs / (1000 * 60 * 60); // Chuyển sang giờ

                    let rentType;
                    const days = Math.floor(hoursDiff / 24); // Số ngày tròn
                    const remainingHours = hoursDiff % 24; // Số giờ dư

                    if (remainingHours === 0) {
                        rentType = 'Thuê theo ngày';
                    } else {
                        rentType = `Thuê theo giờ`; // Tùy chỉnh với số giờ dư
                    }

                    return {
                        ...rental,
                        customerUsername: userResponse.data?.username || rental.customerId,
                        vehicleName: carResponse.data?.vehicleName || rental.vehicleId,
                        rentType: rentType, // Thêm rentType tính toán
                    };
                }));
                // Lọc danh sách dựa trên searchTerm
                const filteredRentals = rentalsWithDetails.filter(rental =>
                    rental.customerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rental.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rental.status.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setRentals(filteredRentals);
                setTotalPages(data.data.totalPages);
            } else {
                setError(data.message || 'Lỗi khi tải danh sách thuê xe');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals(page);
    }, [page, searchTerm]); // Thêm searchTerm vào dependency để refetch khi thay đổi

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            fetchRentals(newPage);
        }
    };

    const handleApprove = async (bookingId) => {
        try {
            await approveBooking(bookingId);
            // Refresh the list after approval
            fetchRentals(page);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể phê duyệt đơn');
        }
    };

    const handleReject = async (bookingId) => {
        try {
            await rejectBooking(bookingId);
            // Refresh the list after approval
            fetchRentals(page);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể phê duyệt đơn');
        }
    };


    const formatDate = (dateString, isHourly) => {
        const date = new Date(dateString);
        if (isHourly) {
            return date.toLocaleString('vi-VN', {dateStyle: 'short', timeStyle: 'short'});
        } else {
            return date.toLocaleString('vi-VN', {dateStyle: 'short'});
        }
    };

    const handleReturned = async (bookingId) => {
        try {
            await approveReturned(bookingId);
            // Refresh the list after approval
            fetchRentals(page);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể phê duyệt đơn');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3">
                        <ClipboardList className="w-7 h-7 text-white"/>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Danh Sách Thuê Xe</h1>
                    <p className="text-gray-600 text-sm">Quản lý các đơn thuê xe</p>
                </div>

                {/* Thêm bộ lọc tìm kiếm */}


                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <ClipboardList className="w-5 h-5"/>
                            Danh sách thuê xe
                        </h2>
                    </div>

                    <div className="p-4">
                        {loading && (
                            <div className="text-center text-gray-600 text-sm">Đang tải...</div>
                        )}
                        {error && (
                            <div
                                className="mb-3 p-2 rounded-lg text-center font-medium bg-red-50 border border-red-200 text-red-600 text-sm">
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
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách
                                            hàng
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày
                                            bắt đầu
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày
                                            kết thúc
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng
                                            giá
                                        </th>

                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại
                                            thuê
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng
                                            thái

                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trễ
                                            hạn
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phí
                                            trả thêm
                                        </th>


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
                                                        <User className="w-3 h-3 text-gray-500"/>
                                                        {rental.createdBy}
                                                    </div>
                                                </td>
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


                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    {rental.rentType}
                                                </td>

                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    {rental.deliveryStatus === 'READY_TO_PICK' ? 'Chờ lấy xe'
                                                        : rental.deliveryStatus === 'TRANSIT' ? 'Đang giao xe'
                                                            : rental.deliveryStatus === 'DELIVERED' ? 'Đã nhận xe'
                                                                : rental.deliveryStatus === 'RETURNED' ? 'Đã trả xe' :
                                                                    'N/A'
                                                    }
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
                                                        <>
                                                            {rental.lateFee.toLocaleString('vi-VN')} VNĐ
                                                        </>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>


                                                <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                    {showApproveButton && customer?.role === 'ROLE_OPERATOR' && (
                                                        <>
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
                                                        </>
                                                    )}
                                                    {rental.deliveryStatus === 'DELIVERED' && customer?.role === 'ROLE_OPERATOR' && rental?.lateFeePaid && (
                                                        <button
                                                            onClick={() => handleReturned(rental.id)}
                                                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-all duration-200"
                                                        >
                                                            Xác nhận đã trả xe
                                                        </button>
                                                    )}
                                                    {!rental?.lateFeePaid && rental.deliveryStatus === 'DELIVERED'&& (
                                                        <span
                                                            className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium"
                                                        >
      Chưa thanh toán phí muộn
    </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}

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
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200"
                                >
                                    Trang sau
                                </button>
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
        <RentalList/>
    </CRMLayout>
);

export default RentalListPage;