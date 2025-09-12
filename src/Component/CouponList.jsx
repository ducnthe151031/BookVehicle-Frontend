import React, { useState, useEffect } from 'react';
import CouponForm from './CouponForm.jsx';
import { getCoupons, deleteCoupon } from '../service/authentication.js';
import { Tag, DollarSign, X, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { toast } from "react-toastify";
import CRMLayout from "./Crm.jsx";
import {FaTicketAlt as TicketPercent} from "react-icons/fa";

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState(null);

    const fetchCoupons = async (pageNumber = 0) => {
        setLoading(true);
        setError('');
        try {
            const response = await getCoupons();
            const data = response.data;
            if (data.httpStatus === 200) {
                const allCoupons = data.data || [];
                const start = pageNumber * pageSize;
                const paginatedCoupons = allCoupons.slice(start, start + pageSize);
                setCoupons(paginatedCoupons);
                setTotalPages(Math.ceil(allCoupons.length / pageSize) || 1);
                setPage(pageNumber);
            } else {
                setError(data.message || 'Lỗi khi tải danh sách coupon');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleEdit = (coupon) => {
        setSelectedCoupon(coupon);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleDelete = (couponId) => {
        const coupon = coupons.find(c => c.id === couponId);
        setCouponToDelete(coupon);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!couponToDelete) return;

        setLoading(true);
        try {
            await deleteCoupon(couponToDelete.id);
            await fetchCoupons(page);
            toast.success('Xóa coupon thành công!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Không thể xóa coupon';
            toast.error('Xóa coupon thất bại: ' + errorMessage);
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setCouponToDelete(null);
        }
    };

    const handleAddFormClose = () => {
        setShowAddForm(false);
        setSelectedCoupon(null);
        setEditMode(false);
    };

    const handleAddFormSuccess = () => {
        setShowAddForm(false);
        setSelectedCoupon(null);
        setEditMode(false);
        fetchCoupons(0);
        setPage(0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3">
                        <TicketPercent className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Danh Sách Coupon</h1>
                    <p className="text-gray-600 text-sm">Quản lý mã giảm giá cho hệ thống</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <TicketPercent className="w-5 h-5" />
                                Danh sách mã giảm giá
                            </h2>
                            <button
                                onClick={() => {
                                    setSelectedCoupon(null);
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
                        {loading && <div className="text-center text-gray-600 text-sm">Đang tải...</div>}
                        {error && <div className="mb-3 p-2 rounded-lg text-center font-medium bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
                        {!loading && coupons.length === 0 && !error && <div className="text-center text-gray-600 text-sm">Không có coupon nào để hiển thị</div>}

                        {coupons.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Coupon</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền Giảm</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-gray-500" />
                                                    <span className="font-semibold text-gray-900">{coupon.couponCode}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">

                                                    <span className="text-gray-800">{coupon.discountAmount.toLocaleString('vi-VN')} VNĐ</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(coupon)} className="p-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-all duration-200">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(coupon.id)} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-all duration-200">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
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

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && couponToDelete && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
                            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                                <div className="flex justify-between items-center mb-4 border-b pb-3">
                                    <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setCouponToDelete(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Bạn có chắc chắn muốn xóa coupon <span className="font-semibold">{couponToDelete.couponCode}</span> không?
                                </p>
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setCouponToDelete(null);
                                        }}
                                        className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <Drawer open={showAddForm} onClose={handleAddFormClose} direction="right" size={400}>
                        <div className="p-6 bg-white h-full overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">{editMode ? 'Chỉnh sửa Coupon' : 'Thêm Coupon Mới'}</h3>
                                <button onClick={handleAddFormClose} className="text-gray-500 hover:text-gray-800"><X className="w-6 h-6" /></button>
                            </div>
                            <CouponForm
                                key={selectedCoupon ? selectedCoupon.id : 'new-coupon'}
                                onClose={handleAddFormClose}
                                onSuccess={handleAddFormSuccess}
                                initialData={editMode ? selectedCoupon : null}
                                isEditMode={editMode}
                            />
                        </div>
                    </Drawer>
                </div>
            </div>
        </div>
    );
};

const CouponListPage = () => (
    <CRMLayout>
        <CouponList />
    </CRMLayout>
);

export default CouponListPage;
