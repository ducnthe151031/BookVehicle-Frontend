import React, { useState, useEffect } from 'react';
import { Calendar, Car, CheckCircle, X, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CRMLayout from './Crm.jsx';
import { getVehicles, createBooking } from '../service/authentication.js';

const BookingForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        vehicleId: '',
        startDate: null,
        endDate: null,
        depositPaid: false,
    });

    const [vehicles, setVehicles] = useState([]);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    // Fetch vehicle list

    //   Fetch vehicle list

    useEffect(() => {
        const fetchVehicles = async () => {
            setIsLoading(true);
            try {

                // Fetch only AVAILABLE vehicles for booking
                const response = await getVehicles(0, 50, { status: 'AVAILABLE' }); // Increased page size, added status filter
                if (response.data.httpStatus === 200) {
                    setVehicles(response.data.data.content);
                } else {
                    setMessage('Lỗi khi tải danh sách xe: ' + (response.data.message || ''));

                const response = await getVehicles(0, 10);
                if (response.data.httpStatus === 200) {
                    setVehicles(response.data.data.content);
                } else {
                    setMessage('Lỗi khi tải danh sách xe.');

                }
            } catch (error) {
                setMessage('Không thể kết nối đến server để lấy danh sách xe.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.vehicleId) {
            newErrors.vehicleId = 'Vui lòng chọn xe.';
        }
        if (!formData.startDate) {
            newErrors.startDate = 'Vui lòng chọn ngày bắt đầu.';
        }
        if (!formData.endDate) {
            newErrors.endDate = 'Vui lòng chọn ngày kết thúc.';

        } else if (formData.endDate <= formData.startDate) { // End date must be strictly after start date
            newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.'; // This error message is correct for strict validation.

        } else if (formData.endDate <= formData.startDate) {
            newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';

        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleDateChange = (name) => (date) => {

        setFormData(prev => {
            const newFormData = {
                ...prev,
                [name]: date,
            };

            // **FIX: If startDate is changed, ensure endDate is still valid or clear it.**
            if (name === 'startDate' && date) {
                // Calculate the true minimum end date (24 hours after start date)
                const minEndDateForPicker = new Date(date.getTime() + 24 * 60 * 60 * 1000);

                // If the current endDate is invalid (before or same as new minimum), clear it
                if (newFormData.endDate && newFormData.endDate < minEndDateForPicker) {
                    newFormData.endDate = null;
                }
                // No longer automatically setting endDate to a fixed next day.
                // Rely on DatePicker's minDate and handleSubmit validation.
            }

            return newFormData;
        });


        setFormData({
            ...formData,
            [name]: date,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        if (!validateForm()) {
            setMessage('Vui lòng kiểm tra lại thông tin nhập vào.');
            setIsLoading(false);
            return;
        }

        try {

            // Backend expects LocalDateTime. Converting Date objects to ISO strings.
            const startDateISO = formData.startDate.toISOString();
            const endDateISO = formData.endDate.toISOString();


            const payload = {
                vehicleId: formData.vehicleId,
                startDate: startDateISO,
                endDate: endDateISO,
                depositPaid: formData.depositPaid,
                // These fields are typically filled by the backend or derived from the vehicle/user:
                // customerId: customer?.id, // Example: customer ID if logged in
                // status: "PENDING", // Backend should set status for new bookings
                // createdBy: customer?.username, // Example: username if logged in
                // brandId: selectedVehicle?.branchId, // From selected vehicle
                // categoryId: selectedVehicle?.categoryId, // From selected vehicle
                // rentType: "DAY", // Assuming this form is always for daily rental based on its inputs
                // totalPrice: calculatedTotalPrice, // Needs to be calculated based on selected vehicle and dates
            };
            console.log("Booking Payload:", payload);
            console.log("start", startDateISO)
            console.log("end", endDateISO)

            const response = await createBooking(payload);

            if (response.httpStatus === 200) {
                setMessage('Đặt xe thành công!');
                // Clear form fields
                setFormData({
                    vehicleId: '',
                    startDate: null,
                    endDate: null,
                    depositPaid: false,
                });
                setErrors({});
                if (onSuccess) onSuccess();
            } else {
                setMessage(response.message || 'Lỗi khi đặt xe.');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi đặt xe.');
            console.error("Booking submission error:", error);

            const payload = {
                vehicleId: formData.vehicleId,
                startDate: formData.startDate.toISOString(),
                endDate: formData.endDate.toISOString(),
                depositPaid: formData.depositPaid,
            };

            await createBooking(payload);

            setMessage('Đặt xe thành công!');
            setFormData({
                vehicleId: '',
                startDate: null,
                endDate: null,
                depositPaid: false,
            });
            setErrors({});
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi đặt xe.');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Calendar className="w-6 h-6" />
                            Đặt hộ xe
                        </h2>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 focus:outline-none transition-colors"
                            >
                                <X className="w-7 h-7" />
                            </button>
                        )}
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Vehicle Selection */}
                            <div>
                                <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center gap-2">
                                    <Car className="w-5 h-5 text-blue-600" />
                                    Chọn xe <span className="text-sm text-gray-500">(Bắt buộc)</span>
                                </label>
                                <select
                                    name="vehicleId"
                                    value={formData.vehicleId}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                                        errors.vehicleId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    } text-gray-700`}
                                >
                                    <option value="">-- Vui lòng chọn xe --</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>

                                            {/* Display vehicle details: Name (Brand) - Price/day */}
                                            {`${vehicle.vehicleName} (${vehicle.branchId || 'N/A'}) - ${vehicle.pricePerDay ? vehicle.pricePerDay.toLocaleString('vi-VN') : 'N/A'} VNĐ/ngày`}

                                            {`${vehicle.vehicleName} (${vehicle.branchId}) - ${vehicle.pricePerDay ? vehicle.pricePerDay.toLocaleString('vi-VN') : 'N/A'} VNĐ/ngày`}

                                        </option>
                                    ))}
                                </select>
                                {errors.vehicleId && <p className="mt-1 text-sm text-red-600">{errors.vehicleId}</p>}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Ngày bắt đầu <span className="text-sm text-gray-500">(Chọn thời gian)</span>
                                </label>
                                <div className="relative">
                                    <DatePicker
                                        selected={formData.startDate}
                                        onChange={handleDateChange('startDate')}

                                        minDate={new Date()} // Cannot pick past dates
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={60} // Allow selecting minutes at 00, 15, 30, 45 if changed to 15

                                        minDate={new Date()}
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={60}

                                        className={`w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 pl-10 ${
                                            errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        } text-gray-700`}
                                        placeholderText="Chọn ngày bắt đầu"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Ngày kết thúc <span className="text-sm text-gray-500">(Sau ngày bắt đầu)</span>
                                </label>
                                <div className="relative">
                                    <DatePicker
                                        selected={formData.endDate}
                                        onChange={handleDateChange('endDate')}

                                        // FIX: minDate is 24 hours after startDate, ensuring at least one full day.
                                        minDate={formData.startDate ? new Date(formData.startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={60} // Allow selecting minutes at 00, 15, 30, 45

                                        minDate={formData.startDate || new Date()}
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={60}

                                        className={`w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 pl-10 ${
                                            errors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        } text-gray-700`}
                                        placeholderText="Chọn ngày kết thúc"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                            </div>

                            {/* Deposit Paid */}
                            <div>
                                <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    Đã thanh toán cọc
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="depositPaid"
                                        checked={formData.depositPaid}
                                        onChange={handleChange}
                                        className="w-6 h-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-colors"
                                    />
                                    <span className="text-sm text-gray-600">Kích hoạt để xác nhận thanh toán cọc</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit and Cancel Buttons */}
                        <div className="mt-8 flex justify-end gap-4">
                            {onClose && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-md"
                                >
                                    Hủy
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-5 h-5" />
                                        Đặt Xe
                                    </>
                                )}
                            </button>
                        </div>


                        {/* Message */}

                        {/*  Message */}

                        {message && (
                            <div className={`mt-6 p-4 rounded-xl text-center font-medium ${
                                message.includes('thành công')
                                    ? 'bg-green-100 border border-green-300 text-green-900'
                                    : 'bg-red-100 border border-red-300 text-red-900'
                            } animate-fade-in`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookingPage = () => (
    <CRMLayout>
        <BookingForm />
    </CRMLayout>
);

export default BookingPage;