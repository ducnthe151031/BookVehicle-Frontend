import React, { useState, useEffect } from 'react';
import { createCoupon, updateCoupon } from '../service/authentication.js';
import { toast } from "react-toastify";
import { Tag, DollarSign, Save, X } from 'lucide-react';

const CouponForm = ({ onClose, onSuccess, initialData, isEditMode }) => {
    const [formData, setFormData] = useState({
        couponCode: '',
        discountAmount: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                couponCode: initialData.couponCode || '',
                discountAmount: initialData.discountAmount || ''
            });
        }
    }, [initialData, isEditMode]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.couponCode.trim()) {
            newErrors.couponCode = 'Mã coupon không được để trống.';
        }
        if (!formData.discountAmount || isNaN(formData.discountAmount) || parseFloat(formData.discountAmount) <= 0) {
            newErrors.discountAmount = 'Số tiền giảm giá phải là một số dương.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const apiData = {
                couponCode: formData.couponCode,
                discountAmount: parseFloat(formData.discountAmount)
            };

            if (isEditMode) {
                await updateCoupon(initialData.id, apiData);
                toast.success('Cập nhật coupon thành công!');
            } else {
                await createCoupon(apiData);
                toast.success('Tạo mới coupon thành công!');
            }
            onSuccess();
        } catch (err) {
            const errorMessage = err.response?.data?.message || (isEditMode ? 'Cập nhật coupon thất bại' : 'Tạo coupon thất bại');
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Mã Coupon
                </label>
                <input
                    type="text"
                    id="couponCode"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-200 ${errors.couponCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="VD: SUMMER2025"
                />
                {errors.couponCode && <p className="text-red-500 text-xs mt-1">{errors.couponCode}</p>}
            </div>

            <div>
                <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Số tiền giảm (VNĐ)
                </label>
                <input
                    type="number"
                    id="discountAmount"
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-200 ${errors.discountAmount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="VD: 50000"
                />
                {errors.discountAmount && <p className="text-red-500 text-xs mt-1">{errors.discountAmount}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 transition-all duration-200 flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
            </div>
        </form>
    );
};

export default CouponForm;
