import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Users, Fuel, ArrowLeft, MapPin, Star, CheckCircle, Info, Settings, Upload, Clock, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarDetails } from '../service/authentication.js';
import Header from "./Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const CarDetail = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { customer, logOut } = useAuth();

    const [rentalType, setRentalType] = useState('day');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [pickupTime, setPickupTime] = useState('09:00');
    const [returnTime, setReturnTime] = useState('09:00');

    const [cccdFile, setCccdFile] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);

    const [couponCode, setCouponCode] = useState('');
    const [discountCode, setDiscountCode] = useState('');
    const [selectedDiscountOption, setSelectedDiscountOption] = useState('none');

    const SURCHARGE_FIXED = 0;
    const OVERTIME_FEE_PER_HOUR = 50000;

    const getFullImageUrl = (filename) => {
        if (!filename) return null;
        return `http://localhost:8080/v1/user/images/${filename}`;
    };

    const calculateDurationAndTotal = () => {
        let duration = 0;
        let totalPrice = 0;
        let days = 0;
        let hours = 0;

        if (!car) {
            return { days: 0, hours: 0, duration: 0, totalPrice: 0 };
        }

        if (rentalType === 'day') {
            if (!car.pricePerDay) return { days: 0, hours: 0, duration: 0, totalPrice: 0 };

            const start = new Date(pickupDate);
            const end = new Date(returnDate);

            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            if (start.toString() !== 'Invalid Date' && end.toString() !== 'Invalid Date' && end >= start) {
                const diffTime = Math.abs(end - start);
                days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                totalPrice = car.pricePerDay * days;
            }
        } else { // 'hour' rental
            if (!car.pricePerHour) return { days: 0, hours: 0, duration: 0, totalPrice: 0 };

            const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
            const endDateTime = new Date(`${pickupDate}T${returnTime}`);

            if (startDateTime.toString() === 'Invalid Date' || endDateTime.toString() === 'Invalid Date') {
                return { days: 0, hours: 0, duration: 0, totalPrice: 0 };
            }

            const diffTime = endDateTime - startDateTime;

            if (diffTime <= 0) {
                return { days: 0, hours: 0, duration: 0, totalPrice: 0 }; // Invalid if end is before start
            }

            hours = Math.ceil(diffTime / (1000 * 60 * 60)); // Convert to hours, round up
            if (hours > 24) {
                hours = 24;
                const limitedEndTime = new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000);
                setReturnTime(limitedEndTime.toTimeString().slice(0, 5)); // Cập nhật returnTime hiển thị
            }

            totalPrice = car.pricePerHour * hours;
        }

        return { days, hours, duration: rentalType === 'day' ? days : hours, totalPrice };
    };

    const { days, hours, totalPrice } = calculateDurationAndTotal();
    const calculatedSubtotal = totalPrice + SURCHARGE_FIXED;

    useEffect(() => {
        const currentDate = new Date();
        const defaultPickup = new Date(currentDate);
        const defaultReturn = new Date(currentDate);
        defaultReturn.setDate(currentDate.getDate() + 1); // Ngày trả mặc định là ngày tiếp theo
        setPickupDate(defaultPickup.toISOString().split('T')[0]);
        setReturnDate(defaultReturn.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getCarDetails(carId);
                if (response.httpStatus === 200) {
                    setCar(response.data);
                } else {
                    setError('Không thể tải thông tin xe.');
                }
            } catch (error) {
                console.error('Error fetching car details:', error);
                setError('Xe không tồn tại hoặc có lỗi xảy ra.');
            } finally {
                setLoading(false);
            }
        };
        fetchCarDetails();
    }, [carId]);

    const handleBookNow = async () => {
        // if (!car || car.status !== 'AVAILABLE') {
        //     alert("Xe hiện không có sẵn để đặt.");
        //     return;
        // }

        if (rentalType === 'day' && (!pickupDate || !returnDate || new Date(pickupDate) > new Date(returnDate))) {
            alert("Vui lòng chọn ngày nhận và ngày trả hợp lệ.");
            return;
        }

        if (rentalType === 'hour') {
            const startDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
            const endDateTime = new Date(`${pickupDate}T${returnTime}:00`);
            if (startDateTime.toString() === 'Invalid Date' || endDateTime.toString() === 'Invalid Date') {
                alert("Ngày hoặc giờ không hợp lệ.");
                return;
            }
            const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
            if (diffHours <= 0) {
                alert("Giờ kết thúc phải sau giờ bắt đầu.");
                return;
            }
            if (diffHours < 3) {
                alert("Thời gian thuê tối thiểu là 3 giờ.");
                return;
            }
            if (diffHours > 24) {
                alert("Thời gian thuê theo giờ không được vượt quá 24 giờ.");
                return;
            }
        }

        if (totalPrice <= 0) {
            alert("Vui lòng chọn thời gian thuê.");
            return;
        }

        // Tạo chuỗi thời gian không có múi giờ
        const startDate = `${pickupDate}T${pickupTime}:00`;
        const endDate = rentalType === 'day' ? `${returnDate}T${pickupTime}:00` : `${pickupDate}T${returnTime}:00`;

        console.log("Start Date (no timezone):", startDate);
        console.log("End Date (no timezone):", endDate);

        const bookingDetails = {
            vehicleId: car.id,
            customerId: customer.id,
            startDate: startDate,
            endDate: endDate,
            status: "PENDING",
            depositPaid: false,
            createdAt: new Date().toISOString(),
            createdBy: customer.username || "anonymous",
            brandId: car.brandId || "",
            categoryId: car.categoryId || "",
            rentType: rentalType,
            totalPrice: calculatedSubtotal,
            cccdFileName: cccdFile ? cccdFile.name : null,
            licenseFileName: licenseFile ? licenseFile.name : null,
            couponCode: selectedDiscountOption === 'coupon' ? couponCode : null,
            discountCode: selectedDiscountOption === 'discountCode' ? discountCode : null,
        };

        try {
            const response = await axios.post('http://localhost:8080/v1/user/bookings', bookingDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log("Booking successful:", response.data);
            // Lấy URL thanh toán từ phản hồi và chuyển hướng
            const paymentUrl = response.data.data.url;
            if (paymentUrl) {
                window.location.href = paymentUrl; // Chuyển hướng đến URL thanh toán
            } else {
                alert("Không tìm thấy URL thanh toán!");
                navigate(-1);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Đặt xe thất bại: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleFileChange = (e, setFileState) => {
        if (e.target.files && e.target.files[0]) {
            setFileState(e.target.files[0]);
        }
    };

    if (loading) {
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
                        onClick={fetchCarDetails}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={handleBack}
                        className="mt-4 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy thông tin xe.</p>
                    <button
                        onClick={handleBack}
                        className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header logOut={logOut} handleChangePassword={handleChangePassword} customer={customer} />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Quay lại
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin xe</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <img
                                        src={getFullImageUrl(car.imageUrl) || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        alt={car.vehicleName}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <p className="text-lg font-semibold text-gray-800">Tên xe: {car.vehicleName}</p>
                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                                        <span>Rating: {car.rating || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Địa điểm xe:</p>
                                        <p className="font-medium">{car.location || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số chỗ:</p>
                                        <p className="font-medium">{car.seatCount || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nhiên liệu:</p>
                                        <p className="font-medium">{car.fuelType || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Hộp số:</p>
                                        <p className="font-medium">{car.gearBox || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Biển số xe:</p>
                                        <p className="font-medium">{car.liecensePlate || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Điều khoản khi thuê xe</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Sử dụng xe đúng mục đích.</li>
                                <li>Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.</li>
                                <li>Không sử dụng xe thuê để cầm cố, thế chấp.</li>
                                <li>Không hút thuốc, nhả kẹo cao su, xả rác trong xe.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="mb-4">
                                <label htmlFor="cccdUpload" className="block text-sm font-medium text-gray-700 mb-2">CCCD:</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="file"
                                        id="cccdUpload"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, setCccdFile)}
                                        required
                                    />
                                    <button
                                        onClick={() => document.getElementById('cccdUpload').click()}
                                        className="flex-grow flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <Upload className="w-5 h-5 mr-2" />
                                        {cccdFile ? cccdFile.name : 'choose the file upload'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="licenseUpload" className="block text-sm font-medium text-gray-700 mb-2">Giấy phép lái xe:</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="file"
                                        id="licenseUpload"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, setLicenseFile)}
                                        required
                                    />
                                    <button
                                        onClick={() => document.getElementById('licenseUpload').click()}
                                        className="flex-grow flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <Upload className="w-5 h-5 mr-2" />
                                        {licenseFile ? licenseFile.name : 'choose the file upload'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thời gian thuê</h2>
                            <div className="space-y-4">
                                <div className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        id="rentByDay"
                                        name="rentalType"
                                        value="day"
                                        checked={rentalType === 'day'}
                                        onChange={() => {
                                            setRentalType('day');
                                            if (!returnDate) setReturnDate(new Date(pickupDate).toISOString().split('T')[0]);
                                        }}
                                        className="mr-2 text-red-600 focus:ring-red-500"
                                    />
                                    <label htmlFor="rentByDay" className="font-medium text-gray-700">Theo ngày:</label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="pickupDate" className="block text-xs text-gray-500 mb-1">từ</label>
                                        <input
                                            type="date"
                                            id="pickupDate"
                                            value={pickupDate}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="returnDate" className="block text-xs text-gray-500 mb-1">đến</label>
                                        <input
                                            type="date"
                                            id="returnDate"
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                            min={pickupDate}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center mt-4 mb-2">
                                    <input
                                        type="radio"
                                        id="rentByHour"
                                        name="rentalType"
                                        value="hour"
                                        checked={rentalType === 'hour'}
                                        onChange={() => {
                                            setRentalType('hour');
                                            // Reset returnTime khi chuyển sang giờ
                                            const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
                                            if (new Date(`${pickupDate}T${returnTime}`) <= startDateTime) {
                                                setReturnTime('10:00'); // Đặt giờ kết thúc mặc định sau 1 giờ
                                            }
                                        }}
                                        className="mr-2 text-red-600 focus:ring-red-500"
                                    />
                                    <label htmlFor="rentByHour" className="font-medium text-gray-700">Theo giờ:</label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="pickupDateHour" className="block text-xs text-gray-500 mb-1">Ngày thuê</label>
                                        <input
                                            type="date"
                                            id="pickupDateHour"
                                            value={pickupDate}
                                            onChange={(e) => {
                                                const newDate = e.target.value;
                                                setPickupDate(newDate);
                                                // Kiểm tra và cập nhật returnTime khi thay đổi pickupDate
                                                const startDateTime = new Date(`${newDate}T${pickupTime}`);
                                                const endDateTime = new Date(`${newDate}T${returnTime}`);
                                                if (endDateTime <= startDateTime) {
                                                    setReturnTime('10:00'); // Đặt giờ kết thúc mặc định sau 1 giờ
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'day'}
                                            min={new Date().toISOString().split('T')[0]} // Bắt đầu từ hôm nay
                                        />
                                    </div>
                                    <div></div> {/* Loại bỏ input ngày trả */}
                                    <div>
                                        <label htmlFor="pickupTimeInput" className="block text-xs text-gray-500 mb-1">Giờ bắt đầu</label>
                                        <input
                                            type="time"
                                            id="pickupTimeInput"
                                            value={pickupTime}
                                            onChange={(e) => {
                                                const newPickupTime = e.target.value;
                                                setPickupTime(newPickupTime);
                                                // Kiểm tra và cập nhật returnTime khi thay đổi pickupTime
                                                const startDateTime = new Date(`${pickupDate}T${newPickupTime}`);
                                                const endDateTime = new Date(`${pickupDate}T${returnTime}`);
                                                if (endDateTime <= startDateTime) {
                                                    const nextHour = new Date(startDateTime.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);
                                                    setReturnTime(nextHour);
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'day'}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="returnTimeInput" className="block text-xs text-gray-500 mb-1">Giờ kết thúc</label>
                                        <input
                                            type="time"
                                            id="returnTimeInput"
                                            value={returnTime}
                                            onChange={(e) => {
                                                const newReturnTime = e.target.value;
                                                const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
                                                const endDateTime = new Date(`${pickupDate}T${newReturnTime}`);

                                                if (endDateTime <= startDateTime) {
                                                    alert("Giờ kết thúc phải sau giờ bắt đầu.");
                                                    return;
                                                }

                                                const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);

                                                if (diffHours < 3) {
                                                    alert("Thời gian thuê tối thiểu là 3 giờ.");
                                                    return;
                                                }

                                                if (diffHours > 24) {
                                                    alert("Thời gian thuê theo giờ không được vượt quá 24 giờ.");
                                                    return;
                                                }

                                                setReturnTime(newReturnTime);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'day'}
                                            min={pickupTime} // Giới hạn giờ kết thúc không nhỏ hơn giờ bắt đầu
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thanh toán đơn thuê xe</h2>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Đơn giá thuê:</span>
                                    <span>
                                        {rentalType === 'day' ? car.pricePerDay?.toLocaleString() : car.pricePerHour?.toLocaleString()}đ/
                                        {rentalType === 'day' ? 'ngày' : 'giờ'}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Tổng cộng:</span>
                                    <span>{totalPrice.toLocaleString()}đ {days > 0 ? `x ${days} ngày` : hours > 0 ? `x ${hours} giờ` : ''}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phụ phí:</span>
                                    <span>{SURCHARGE_FIXED.toLocaleString()}đ</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 pt-4 mt-4">
                                <h3 className="font-bold text-gray-900 mb-3">Áp dụng giảm giá</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="couponRadio"
                                            name="discountOption"
                                            value="coupon"
                                            checked={selectedDiscountOption === 'coupon'}
                                            onChange={() => setSelectedDiscountOption('coupon')}
                                            className="mr-2 text-red-600 focus:ring-red-500"
                                        />
                                        <label htmlFor="couponRadio" className="text-gray-700 mr-2">Coupon: <span className="font-medium">200.000đ(Summer20)</span></label>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã coupon"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-grow px-3 py-1 border border-gray-300 rounded-lg text-sm"
                                            disabled={selectedDiscountOption !== 'coupon'}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="discountCodeRadio"
                                            name="discountOption"
                                            value="discountCode"
                                            checked={selectedDiscountOption === 'discountCode'}
                                            onChange={() => setSelectedDiscountOption('discountCode')}
                                            className="mr-2 text-red-600 focus:ring-red-500"
                                        />
                                        <label htmlFor="discountCodeRadio" className="text-gray-700 mr-2">Discount code:</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã giảm giá"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            className="flex-grow px-3 py-1 border border-gray-300 rounded-lg text-sm"
                                            disabled={selectedDiscountOption !== 'discountCode'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 pt-4 mt-4">
                                <div className="flex justify-between items-center font-bold text-lg text-gray-900 mb-2">
                                    <span>Thành tiền</span>
                                    <span>{calculatedSubtotal.toLocaleString()}đ</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Phụ phí có thể phát sinh</span>
                                        <Info className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Phí quá giờ</span>
                                        <span>{OVERTIME_FEE_PER_HOUR.toLocaleString()}đ/giờ</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Phụ phí phát sinh nếu hoàn trả muộn
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBookNow}
                            // disabled={car.status !== 'AVAILABLE'}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Chọn đặt xe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;