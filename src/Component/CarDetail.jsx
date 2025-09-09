import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Car, Users, Fuel, ArrowLeft, MapPin, Star, CheckCircle, Info,
    Settings, Upload, Clock, Calendar, User, XCircle, Tag, FileText
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    createReview, getCarDetails, getRating, getReviewsByVehicle, validateCoupon
} from '../service/authentication.js';
import Header from "./Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const CarDetail = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { customer, logOut } = useAuth();
    const [reviewsPage, setReviewsPage] = useState(0);
    const [bookingIdForReview, setBookingIdForReview] = useState('');
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [rentalType, setRentalType] = useState('day');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [returnTime, setReturnTime] = useState('14:00'); // Default to 5:00 PM
    const [cccdFile, setCccdFile] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [discountCode, setDiscountCode] = useState('');
    const [applyDiscount, setApplyDiscount] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [ratingInfo, setRatingInfo] = useState(null);
    const [ratingLoading, setRatingLoading] = useState(true);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);

    const SURCHARGE_AMOUNT = 0;
    const OVERTIME_FEE_PER_HOUR = 50000;
    const COUPON_DISCOUNT = 200000;

    useEffect(() => {
        const currentDateTime = new Date();
        const currentHours = currentDateTime.getHours();
        const currentMinutes = currentDateTime.getMinutes();
        const isWithinOperatingHours = currentHours >= 9 && currentHours < 17;

        let defaultPickupDate, defaultPickupTime, defaultReturnDate;

        if (isWithinOperatingHours) {
            // Current time is within 9:00 AM to 5:00 PM
            defaultPickupDate = currentDateTime;
            defaultPickupTime = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
        } else {
            // Current time is outside 9:00 AM to 5:00 PM, set to next day at 9:00 AM
            defaultPickupDate = new Date(currentDateTime);
            defaultPickupDate.setDate(currentDateTime.getDate() + 1);
            defaultPickupTime = '09:00';
        }

        defaultReturnDate = new Date(defaultPickupDate);
        if (rentalType === 'day') {
            defaultReturnDate.setDate(defaultPickupDate.getDate() + 2);
        }

        setPickupDate(defaultPickupDate.toISOString().split('T')[0]);
        setPickupTime(defaultPickupTime);
        setReturnDate(defaultReturnDate.toISOString().split('T')[0]);
    }, [rentalType]);

    // Validate time to ensure it's within 9:00 AM to 5:00 PM
    const isValidTime = (time) => {
        const [hours, minutes] = time.split(':').map(Number);

        // Giờ phải >= 7 và <= 17
        if (hours < 9 || hours > 17) {
            return false;
        }

        // Nếu là 17h thì chỉ cho phép 17:00 đúng
        if (hours === 17 && minutes > 0) {
            return false;
        }

        return true;
    };

    // Helper: check if a date is within 3 months from now
    const isWithin3Months = (dateStr) => {
        if (!dateStr) return false;
        const now = new Date();
        const maxAdvanceDate = new Date(now);
        maxAdvanceDate.setMonth(maxAdvanceDate.getMonth() + 3);
        const date = new Date(dateStr);
        return date <= maxAdvanceDate;
    };

    // Update pickup time input
    const handlePickupTimeChange = (e) => {
        setPickupTime(e.target.value);
    };

    // Update return time input
    const handleReturnTimeChange = (e) => {
        setReturnTime(e.target.value);
    };

    // Update pickup date input
    const handlePickupDateChange = (e) => {
        setPickupDate(e.target.value);
    };

    // Update return date input
    const handleReturnDateChange = (e) => {
        setReturnDate(e.target.value);
    };

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
            const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
            const endDateTime = new Date(`${returnDate}T${returnTime}`);
            if (startDateTime.toString() !== 'Invalid Date' && endDateTime.toString() !== 'Invalid Date' && endDateTime >= startDateTime) {
                // Calculate days difference, ignore hours
                const diffTime = endDateTime - startDateTime;
                days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (days < 1) days = 1; // Always charge at least 1 day
                totalPrice = car.pricePerDay * days;
            }
        } else {
            if (!car.pricePerHour) return { days: 0, hours: 0, duration: 0, totalPrice: 0 };
            const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
            const endDateTime = new Date(`${pickupDate}T${returnTime}`);
            if (startDateTime.toString() === 'Invalid Date' || endDateTime.toString() === 'Invalid Date') {
                return { days: 0, hours: 0, duration: 0, totalPrice: 0 };
            }
            const diffTime = endDateTime - startDateTime;
            if (diffTime <= 0) {
                return { days: 0, hours: 0, duration: 0, totalPrice: 0 };
            }
            hours = Math.ceil(diffTime / (1000 * 60 * 60));
            if (hours > 24) {
                hours = 24;
                const limitedEndTime = new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000).toTimeString().slice(0, 5);
                setReturnTime(limitedEndTime <= '17:00' ? limitedEndTime : '17:00');
            }
            totalPrice = car.pricePerHour * hours;
        }

        if (appliedCoupon) {
            totalPrice = Math.max(0, totalPrice - appliedCoupon.discountAmount);
        }

        return { days, hours, duration: rentalType === 'day' ? days : hours, totalPrice };
    };

    const { days, hours, totalPrice } = calculateDurationAndTotal();
    const calculatedSubtotal = totalPrice + SURCHARGE_AMOUNT;

    const handleApplyCoupon = async () => {
        if (!couponCodeInput.trim()) {
            setCouponError('Vui lòng nhập mã coupon.');
            return;
        }
        setCouponLoading(true);
        setCouponError('');
        try {
            const response = await validateCoupon(couponCodeInput);
            const data = response.data;
            if (data.httpStatus === 200) {
                setAppliedCoupon(data.data);
                toast.success(`Áp dụng mã giảm giá ${data.data.discountAmount.toLocaleString('vi-VN')} VNĐ thành công!`);
            } else {
                setCouponError(response.message || 'Mã giảm giá không hợp lệ.');
                setAppliedCoupon(null);
            }
        } catch (err) {
            setCouponError(err.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn.');
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getCarDetails(carId);
                if (response.httpStatus === 200) {
                    setCar(response.data);
                    fetchReviews(true);
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

    // Read initial date/time/rentalType from location.state if available
    useEffect(() => {
        let initialPickupDate = '';
        let initialPickupTime = '';
        let initialReturnDate = '';
        let initialReturnTime = '';
        let initialRentalType = 'day';
        if (location.state) {
            if (location.state.pickupDate) {
                const pickup = new Date(location.state.pickupDate);
                initialPickupDate = pickup.toISOString().split('T')[0];
                initialPickupTime = pickup.toTimeString().slice(0, 5);
            }
            if (location.state.returnDate) {
                const ret = new Date(location.state.returnDate);
                initialReturnDate = ret.toISOString().split('T')[0];
                initialReturnTime = ret.toTimeString().slice(0, 5);
            }
            if (location.state.rentalType) {
                initialRentalType = location.state.rentalType;
            }
        }
        setRentalType(initialRentalType);
        if (initialPickupDate) setPickupDate(initialPickupDate);
        if (initialPickupTime) setPickupTime(initialPickupTime);
        if (initialReturnDate) setReturnDate(initialReturnDate);
        if (initialReturnTime) setReturnTime(initialReturnTime);
    }, []);

    const handleBookNow = () => {
        // Show terms modal instead of immediate booking
        setShowTermsModal(true);
    };

    const handleConfirmBooking = async () => {
        if (!termsAgreed) {
            toast.error('Vui lòng đồng ý với điều khoản hợp đồng trước khi đặt xe.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        const startDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
        const endDateTime = rentalType === 'day' ? new Date(`${returnDate}T${returnTime}:00`) : new Date(`${pickupDate}T${returnTime}:00`);

        // Centralized validation
        if (startDateTime.toString() === 'Invalid Date' || endDateTime.toString() === 'Invalid Date') {
            toast.error('Ngày hoặc giờ không hợp lệ.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!isValidTime(pickupTime) || !isValidTime(returnTime)) {
            toast.error('Giờ nhận và trả xe phải từ 9:00 sáng đến 5:00 chiều.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (endDateTime <= startDateTime) {
            toast.error('Thời gian trả phải sau thời gian thuê', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        // Validate minimum 3 hours for same-day rentals
        if (rentalType === 'day' && pickupDate === returnDate) {
            const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
            if (diffHours < 3) {
                toast.error('Thời gian thuê trong ngày phải tối thiểu 3 tiếng.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
        }

        // Validate minimum duration for hour rental
        if (rentalType === 'hour') {
            const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
            if (diffHours < 3) {
                toast.error('Thời gian thuê tối thiểu là 3 giờ.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
            if (diffHours > 24) {
                toast.error('Thời gian thuê theo giờ không được vượt quá 24 giờ.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
        }

        // Validate minimum duration for multi-day rental
        // if (rentalType === 'day' && pickupDate !== returnDate) {
        //     const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
        //     if (diffHours <= 24) {
        //         toast.error('Thời gian thuê theo ngày phải lớn hơn 24 giờ.', {
        //             position: 'top-right',
        //             autoClose: 3000,
        //         });
        //         return;
        //     }
        // }

        if (totalPrice === 0) {
            toast.error('Vui lòng chọn thời gian thuê hợp lệ.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        const startDate = `${pickupDate}T${pickupTime}:00`;
        const endDate = rentalType === 'day' ? `${returnDate}T${returnTime}:00` : `${pickupDate}T${returnTime}:00`;

        const bookingDetails = {
            vehicleId: car.id,
            customerId: customer.id,
            startDate: startDate,
            endDate: endDate,
            status: 'PENDING',
            depositPaid: false,
            createdAt: new Date().toISOString(),
            createdBy: customer.username || 'anonymous',
            brandId: car.brandId || '',
            categoryId: car.categoryId || '',
            rentType: rentalType,
            totalPrice: calculatedSubtotal,
            cccdFileName: cccdFile ? cccdFile.name : null,
            licenseFileName: licenseFile ? licenseFile.name : null,
            couponCode: appliedCoupon ? appliedCoupon.couponCode : null,
            discountCode: applyDiscount ? discountCode : null,
        };

        try {
            const response = await axios.post('http://localhost:8080/v1/user/bookings', bookingDetails, {
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
        } finally {
            setShowTermsModal(false);
            setTermsAgreed(false);
        }
    };

    useEffect(() => {
        if (!carId) return;

        const fetchRatingData = async () => {
            try {
                setRatingLoading(true);
                const response = await getRating(carId);
                if (response.code === 'MSG000000') {
                    setRatingInfo(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải rating:", error);
                setRatingInfo(null);
            } finally {
                setRatingLoading(false);
            }
        };

        fetchRatingData();
    }, [carId]);

    const fetchReviews = useCallback(async (reset = false) => {
        if (!carId) return;
        setReviewsLoading(true);
        try {
            const pageToFetch = reset ? 0 : reviewsPage;
            const response = await getReviewsByVehicle(carId, pageToFetch, 5);
            if (response.code === "MSG000000" && response.data) {
                const newReviews = response.data.content;
                setReviews(prev => reset ? newReviews : [...prev, ...newReviews]);
                setHasMoreReviews(!response.data.last);
                setReviewsPage(pageToFetch + 1);
            } else {
                setHasMoreReviews(false);
            }
        } catch (error) {
            console.error("Lỗi khi tải đánh giá:", error);
            toast.error(error.response?.data?.message || "Không thể tải danh sách đánh giá.");
        } finally {
            setReviewsLoading(false);
        }
    }, [carId, reviewsPage]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (newRating === 0) {
            toast.error('Vui lòng chọn số sao để đánh giá.');
            return;
        }

        setIsSubmittingReview(true);
        try {
            const reviewData = {
                vehicleId: carId,
                rating: newRating,
                comment: newComment,
            };
            const response = await createReview(reviewData);
            if (response.code === 'MSG000000') {
                toast.success('Cảm ơn bạn đã gửi đánh giá!');
                setNewRating(0);
                setNewComment('');
                setBookingIdForReview('');
                setReviewsPage(0);
                fetchReviews(true);
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi gửi đánh giá.');
            }
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
            toast.error(error.response?.data?.message || 'Không thể gửi đánh giá.');
        } finally {
            setIsSubmittingReview(false);
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

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCodeInput('');
        setCouponError('');
    };

    // Thêm hàm thuật toán ở ngoài render
    function handleDayRentalLogic() {
        setRentalType('day');
        const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
        const endDateTime = new Date(`${returnDate}T${returnTime}`);
        if (endDateTime <= startDateTime || (endDateTime - startDateTime) / (1000 * 60 * 60) <= 24) {
            const nextDay = new Date(startDateTime);
            nextDay.setDate(startDateTime.getDate() + 2);
            setReturnDate(nextDay.toISOString().split('T')[0]);
            setReturnTime(pickupTime <= '17:00' ? pickupTime : '17:00');
        }
    }

    // Prevent manual input for date/time fields
    const preventManualInput = (e) => {
        e.preventDefault();
    };

    // Validate rental time and show errors immediately
    const handleCheckRentalTime = () => {
        const startDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
        const endDateTime = rentalType === 'day' ? new Date(`${returnDate}T${returnTime}:00`) : new Date(`${pickupDate}T${returnTime}:00`);

        if (startDateTime.toString() === 'Invalid Date' || endDateTime.toString() === 'Invalid Date') {
            toast.error('Ngày hoặc giờ không hợp lệ.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        if (!isValidTime(pickupTime) || !isValidTime(returnTime)) {
            toast.error('Giờ nhận và trả xe phải từ 9:00 sáng đến 5:00 chiều.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        if (endDateTime <= startDateTime) {
            toast.error('Thời gian trả phải sau thời gian thuê', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        if (rentalType === 'day' && pickupDate === returnDate) {
            const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
            if (diffHours < 3) {
                toast.error('Thời gian thuê trong ngày phải tối thiểu 3 tiếng.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
        }
        if (rentalType === 'hour') {
            const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
            if (diffHours < 3) {
                toast.error('Thời gian thuê tối thiểu là 3 giờ.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
            if (diffHours > 24) {
                toast.error('Thời gian thuê theo giờ không được vượt quá 24 giờ.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
        }
        if (totalPrice === 0) {
            toast.error('Vui lòng chọn thời gian thuê hợp lệ.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        toast.success('Thời gian thuê hợp lệ!', {
            position: 'top-right',
            autoClose: 2000,
        });
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
                            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-200 hover:shadow-xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3 flex items-center gap-2">
                                    <Car className="w-6 h-6 text-blue-600" />
                                    Thông tin xe
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            {car.imageUrl?.split(',').map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="relative cursor-pointer group rounded-lg overflow-hidden"
                                                    onClick={() => openImageGallery(index)}
                                                    role="button"
                                                    aria-label={`Xem ảnh xe ${index + 1}`}
                                                >
                                                    <img
                                                        src={getFullImageUrl(img)}
                                                        alt={`Ảnh xe ${index + 1}`}
                                                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                                                        onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                                                    />
                                                    {index === 3 && car.imageUrl.split(',').length > 4 && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg transition-opacity duration-200">
                                                            <span className="text-white font-semibold text-sm">
                                                                +{car.imageUrl.split(',').length - 4}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )).slice(0, 4)}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-semibold text-gray-800">{car.vehicleName || 'N/A'}</h3>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Star className="w-5 h-5 text-yellow-500 mr-1 fill-current" />
                                                <span className="font-medium">Đánh giá: {ratingInfo ? `${ratingInfo} / 5` : 'Chưa có đánh giá'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Địa điểm xe</p>
                                                <p className="font-medium text-gray-800">{car.location || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Users className="w-5 h-5 text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Số chỗ</p>
                                                <p className="font-medium text-gray-800">{car.seatCount || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Fuel className="w-5 h-5 text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Nhiên liệu</p>
                                                <p className="font-medium text-gray-800">
                                                    {car.fuelType === 'Gasoline' ? 'Xăng' :
                                                        car.fuelType === 'Diesel' ? 'Dầu' :
                                                            car.fuelType === 'Electric' ? 'Điện' :
                                                                car.fuelType === 'Hybrid' ? 'Hybrid' :
                                                                    car.fuelType || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Settings className="w-5 h-5 text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Hộp số</p>
                                                <p className="font-medium text-gray-800">
                                                    {car.gearBox === 'AUTOMATIC' ? 'Tự động' :
                                                        car.gearBox === 'MANUAL' ? 'Số sàn' :
                                                            car.gearBox || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Tag className="w-5 h-5 text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Biển số xe</p>
                                                <p className="font-medium text-gray-800">{car.liecensePlate || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-200 hover:shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-blue-600" />
                                Điều khoản khi thuê xe
                            </h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Sử dụng xe đúng mục đích đã đăng ký khi thuê.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Không sử dụng xe vào các hoạt động phi pháp hoặc trái với quy định pháp luật.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Không cầm cố, thế chấp, hoặc chuyển nhượng xe thuê dưới bất kỳ hình thức nào.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Không hút thuốc, nhả kẹo cao su, xả rác, hoặc làm bẩn nội thất xe.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Trả xe đúng thời hạn theo hợp đồng; phí trễ hạn sẽ được áp dụng nếu trả muộn.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Đảm bảo xe được sử dụng trong tình trạng kỹ thuật tốt; báo cáo ngay mọi hư hỏng cho công ty.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Chỉ người đăng ký thuê hoặc tài xế được chỉ định mới được phép lái xe.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Tuân thủ luật giao thông và chịu trách nhiệm với mọi vi phạm trong thời gian thuê.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá từ khách hàng</h2>
                            {customer && (
                                <form onSubmit={handleSubmitReview} className="mb-8 p-4 border rounded-lg">
                                    <h3 className="font-semibold text-lg mb-3">Để lại đánh giá của bạn</h3>
                                    <div className="flex items-center mb-4">
                                        <span className="mr-4 text-gray-700">Đánh giá:</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, index) => {
                                                const ratingValue = index + 1;
                                                return (
                                                    <Star
                                                        key={ratingValue}
                                                        className={`w-6 h-6 cursor-pointer transition-colors ${ratingValue <= (hoverRating || newRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        fill="currentColor"
                                                        onClick={() => setNewRating(ratingValue)}
                                                        onMouseEnter={() => setHoverRating(ratingValue)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Hãy chia sẻ cảm nhận của bạn..."
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        rows="3"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                                    >
                                        {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                    </button>
                                </form>
                            )}

                            <div className="space-y-6">
                                {reviews.map(review => (
                                    <div key={review.id} className="flex items-start space-x-4 border-b pb-4 last:border-b-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                            <User className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-gray-800">
                                                    {review.username ? review.username : 'Người dùng ẩn danh'}
                                                </p>
                                                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div className="flex items-center my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        fill="currentColor"
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm">{review.comment}</p>
                                        </div>
                                    </div>
                                ))}
                                {reviewsLoading && <p className="text-center text-gray-500">Đang tải...</p>}
                                {!reviewsLoading && reviews.length === 0 && <p className="text-center text-gray-500">Chưa có đánh giá nào cho xe này.</p>}
                                {hasMoreReviews && !reviewsLoading && (
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={() => fetchReviews(false)}
                                            className="text-red-600 font-semibold hover:underline disabled:text-gray-400"
                                            disabled={reviewsLoading}
                                        >
                                            Tải thêm bình luận
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thời gian thuê</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="pickupTimeDay" className="block text-xs text-gray-500 mb-1">
                                            Giờ nhận
                                        </label>
                                        <input
                                            type="time"
                                            id="pickupTimeDay"
                                            value={pickupTime}
                                            onChange={handlePickupTimeChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                            min={pickupDate === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : '07:00'}
                                            max="17:00"
                                            onKeyDown={preventManualInput}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="pickupDate" className="block text-xs text-gray-500 mb-1">
                                            Ngày nhận
                                        </label>
                                        <input
                                            type="date"
                                            id="pickupDate"
                                            value={pickupDate}
                                            onChange={handlePickupDateChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                            min={new Date().toISOString().split('T')[0]}
                                            onKeyDown={preventManualInput}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="returnTimeDay" className="block text-xs text-gray-500 mb-1">
                                            Giờ trả
                                        </label>
                                        <input
                                            type="time"
                                            id="returnTimeDay"
                                            value={returnTime}
                                            onChange={handleReturnTimeChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                            min="09:00"
                                            max="17:00"
                                            onKeyDown={preventManualInput}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="returnDate" className="block text-xs text-gray-500 mb-1">
                                            Ngày trả
                                        </label>
                                        <input
                                            type="date"
                                            id="returnDate"
                                            value={returnDate}
                                            onChange={(e) => {
                                                const newReturnDate = e.target.value;
                                                setReturnDate(newReturnDate);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                            min={pickupDate}
                                            onKeyDown={preventManualInput}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={handleCheckRentalTime}
                                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200"
                                    >
                                        Kiểm tra
                                    </button>
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
                                <div className="flex justify-between">
                                    <span>Số ngày thuê:</span>
                                    <span>{days} ngày</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phụ phí:</span>
                                    <span>{SURCHARGE_AMOUNT.toLocaleString()}đ</span>
                                </div>
                                {applyDiscount && (couponCode || discountCode) && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá:</span>
                                        <span>-{COUPON_DISCOUNT.toLocaleString()}đ</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <label htmlFor="couponCodeInput" className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="couponCodeInput"
                                        placeholder="Nhập mã của bạn"
                                        value={couponCodeInput}
                                        onChange={(e) => setCouponCodeInput(e.target.value)}
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:outline-none"
                                        disabled={!!appliedCoupon || couponLoading}
                                    />
                                    {!appliedCoupon ? (
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading}
                                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                                        >
                                            {couponLoading ? '...' : 'Áp dụng'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="p-2 text-gray-500 hover:text-red-600"
                                            title="Xóa mã giảm giá"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                            </div>

                            <div className="border-t border-gray-300 pt-4 mt-4">
                                <div className="flex justify-between items-center font-bold text-lg text-gray-900 mb-2">
                                    <span>Thành tiền</span>
                                    <span>{calculatedSubtotal.toLocaleString()}đ</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBookNow}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Chọn đặt xe
                        </button>
                    </div>
                </div>
            </div>

            {/* Terms Agreement Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-blue-600" />
                                Hợp đồng thuê xe
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">Thông tin hợp đồng</h3>
                                <p className="text-sm text-gray-600">
                                    Hợp đồng này được lập giữa <span className="font-medium">Công ty Cho thuê xe ABC</span> (Bên cho thuê) và
                                    <span className="font-medium"> {customer?.username || 'Khách hàng'}</span> (Bên thuê) cho việc thuê xe dưới đây:
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Loại xe</p>
                                        <p className="font-medium">{car.vehicleName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Biển số</p>
                                        <p className="font-medium">{car.liecensePlate || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Thời gian thuê</p>
                                        <p className="font-medium">
                                            Từ {pickupDate} {pickupTime} đến {rentalType === 'day' ? returnDate : pickupDate} {returnTime}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Tổng chi phí</p>
                                        <p className="font-medium">{calculatedSubtotal.toLocaleString()} VNĐ</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">Điều khoản hợp đồng</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span>Bên thuê cam kết sử dụng xe đúng mục đích và tuân thủ mọi quy định giao thông.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span>Bên thuê chịu trách nhiệm bồi thường thiệt hại nếu xe bị hư hỏng do lỗi sử dụng.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span>Nếu bạn trả xe muộn, phí phạt sẽ được tính theo công thức: (giá thuê theo giờ) × (số giờ muộn)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span>Bên cho thuê có quyền thu hồi xe nếu phát hiện vi phạm hợp đồng.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">Cam kết của các bên</h3>
                                <p className="text-sm text-gray-600">
                                    Cả hai bên cam kết thực hiện đúng các điều khoản trong hợp đồng này. Mọi tranh chấp sẽ được giải quyết thông qua thương lượng hoặc tại tòa án có thẩm quyền.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="termsAgree"
                                    checked={termsAgreed}
                                    onChange={() => setTermsAgreed(!termsAgreed)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="termsAgree" className="text-sm text-gray-700">
                                    Tôi đã đọc và đồng ý với các điều khoản của hợp đồng thuê xe.
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowTermsModal(false);
                                    setTermsAgreed(false);
                                }}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={!termsAgreed}
                            >
                                Xác nhận đặt xe
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetail;

