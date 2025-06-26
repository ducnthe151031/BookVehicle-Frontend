import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
// Thêm icon User để làm avatar
import { Car, Users, Fuel, ArrowLeft, MapPin, Star, CheckCircle, Info, Settings, Upload, Clock, Calendar, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {createReview, getCarDetails, getRating, getReviewsByVehicle} from '../service/authentication.js';
import Header from "./Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";



const CarDetail = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { customer, logOut } = useAuth();
    const [reviewsPage, setReviewsPage] = useState(0);
    const [bookingIdForReview, setBookingIdForReview] = useState(''); // State cho ô nhập bookingId
    const [hasMoreReviews, setHasMoreReviews] = useState(true); // Để biết còn review để tải thêm không

    // ... (các state cũ giữ nguyên)
    const [rentalType, setRentalType] = useState('day');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [pickupTime, setPickupTime] = useState('09:00');
    const [returnTime, setReturnTime] = useState('09:00');
    const [cccdFile, setCccdFile] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [discountCode, setDiscountCode] = useState('');
    const [applyDiscount, setApplyDiscount] = useState(false);


    // --- STATE MỚI CHO PHẦN ĐÁNH GIÁ ---
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [ratingInfo, setRatingInfo] = useState(null);
    const [ratingLoading, setRatingLoading] = useState(true);
    const SURCHARGE_AMOUNT = 0;
    const OVERTIME_FEE_PER_HOUR = 50000;
    const COUPON_DISCOUNT = 200000;

    const getFullImageUrl = (filename) => {
        if (!filename) return null;
        return `http://localhost:8080/v1/user/images/${filename}`;
    };

    // ... (hàm calculateDurationAndTotal giữ nguyên)
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
                const diffTime = Math.abs(endDateTime - startDateTime);
                const diffHours = diffTime / (1000 * 60 * 60);
                if (diffHours <= 24) {
                    return { days: 0, hours: 0, duration: 0, totalPrice: 0 }; // Thời gian thuê phải > 24 giờ
                }
                days = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Tính số ngày
                hours = Math.ceil((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Tính số giờ lẻ
                totalPrice = car.pricePerDay * days;
                if (hours > 0) {
                    totalPrice += car.pricePerHour * hours; // Tính thêm giá giờ lẻ
                }
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
                setReturnTime(limitedEndTime.toTimeString().slice(0, 5));
            }

            totalPrice = car.pricePerHour * hours;
        }

        // Áp dụng giảm giá nếu được chọn
        if (applyDiscount && (couponCode || discountCode)) {
            totalPrice = Math.max(0, totalPrice - COUPON_DISCOUNT);
        }

        return { days, hours, duration: rentalType === 'day' ? days : hours, totalPrice };
    };

    const { days, hours, totalPrice } = calculateDurationAndTotal();
    const calculatedSubtotal = totalPrice + SURCHARGE_AMOUNT;




    useEffect(() => {
        const currentDate = new Date();
        const defaultPickup = new Date(currentDate);
        const defaultReturn = new Date(currentDate);
        defaultReturn.setDate(currentDate.getDate() + 2); // Mặc định trả sau 2 ngày để > 24h
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
                    // Lấy reviews sau khi có thông tin xe
                    fetchReviews();
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

    // ... (các hàm xử lý cũ giữ nguyên)
    const handleBookNow = async () => {
        const startDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
        const endDateTime = rentalType === 'day' ? new Date(`${returnDate}T${returnTime}:00`) : new Date(`${pickupDate}T${returnTime}:00`);

        if (startDateTime.toString() === 'Invalid Date' || endDateTime.toString() === 'Invalid Date') {
            toast.error('Ngày hoặc giờ không hợp lệ.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
        if (diffHours <= 0) {
            toast.error('Thời gian kết thúc phải sau thời gian bắt đầu.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (rentalType === 'day' && diffHours <= 24) {
            toast.error('Thời gian thuê theo ngày phải lớn hơn 24 giờ.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (diffHours < 3) {
            toast.error('Thời gian thuê tối thiểu là 3 giờ.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (rentalType === 'hour' && diffHours > 24) {
            toast.error('Thời gian thuê theo giờ không được vượt quá 24 giờ.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

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
            couponCode: applyDiscount ? couponCode : null,
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
        }
    };

    useEffect(() => {
        // Không chạy nếu không có carId
        if (!carId) return;

        const fetchRatingData = async () => {
            try {
                setRatingLoading(true);
                const response = await getRating(carId);

                // Dữ liệu xe nằm trong response.data
                if (response.code === 'MSG000000') {
                    setRatingInfo(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải rating:", error);
                // Có thể không cần báo lỗi, chỉ cần không hiển thị
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
            const response = await getReviewsByVehicle(carId, pageToFetch, 5); // Lấy 5 review mỗi lần

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
                // Reset form và tải lại trang đầu tiên của review
                setNewRating(0);
                setNewComment('');
                setBookingIdForReview('');
                setReviewsPage(0); // Reset page để fetchReviews(true) gọi đúng trang
                fetchReviews(true); // reset = true
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



    // Các hàm render loading, error, ... giữ nguyên
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
                        {/* ... (Phần thông tin xe) ... */}
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
                                        <span>Đánh giá trung bình: {ratingInfo || 'N/A'}</span>
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


                        {/* ... (Phần điều khoản) ... */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Điều khoản khi thuê xe</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Sử dụng xe đúng mục đích.</li>
                                <li>Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.</li>
                                <li>Không sử dụng xe thuê để cầm cố, thế chấp.</li>
                                <li>Không hút thuốc, nhả kẹo cao su, xả rác trong xe.</li>
                            </ul>
                        </div>

                        {/* --- PHẦN ĐÁNH GIÁ MỚI --- */}
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
                                                return <Star key={ratingValue} className={`w-6 h-6 cursor-pointer transition-colors ${ratingValue <= (hoverRating || newRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" onClick={() => setNewRating(ratingValue)} onMouseEnter={() => setHoverRating(ratingValue)} onMouseLeave={() => setHoverRating(0)} />;
                                            })}
                                        </div>
                                    </div>
                                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Hãy chia sẻ cảm nhận của bạn..." className="w-full p-2 border border-gray-300 rounded-md" rows="3" />
                                    <button type="submit" disabled={isSubmittingReview} className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400">
                                        {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                    </button>
                                </form>
                            )}

                            <div className="space-y-6">
                                {reviews.map(review => (
                                    <div key={review.id} className="flex items-start space-x-4 border-b pb-4 last:border-b-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><User className="w-6 h-6 text-gray-500" /></div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-gray-800">Người dùng ẩn danh</p>
                                                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div className="flex items-center my-1">
                                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor"/>)}
                                            </div>
                                            <p className="text-gray-600 text-sm">{review.comment}</p>
                                        </div>
                                    </div>
                                ))}
                                {reviewsLoading && <p className="text-center text-gray-500">Đang tải...</p>}
                                {!reviewsLoading && reviews.length === 0 && <p className="text-center text-gray-500">Chưa có đánh giá nào cho xe này.</p>}
                                {hasMoreReviews && !reviewsLoading && (
                                    <div className="text-center mt-6">
                                        <button onClick={() => fetchReviews(false)} className="text-red-600 font-semibold hover:underline disabled:text-gray-400" disabled={reviewsLoading}>
                                            Tải thêm bình luận
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* --- CỘT BÊN PHẢI (THANH TOÁN) --- */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* ... (Phần upload file) ... */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="mb-4">
                                <label htmlFor="cccdUpload" className="block text-sm font-medium text-gray-700 mb-2">CCCD:</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="file"
                                        id="cccdUpload"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, setCccdFile)}
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

                        {/* ... (Phần thời gian thuê) ... */}
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
                                            const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
                                            const endDateTime = new Date(`${returnDate}T${returnTime}`);
                                            if (endDateTime <= startDateTime || (endDateTime - startDateTime) / (1000 * 60 * 60) <= 24) {
                                                const nextDay = new Date(startDateTime);
                                                nextDay.setDate(startDateTime.getDate() + 2);
                                                setReturnDate(nextDay.toISOString().split('T')[0]);
                                                setReturnTime(pickupTime);
                                            }
                                        }}
                                        className="mr-2 text-red-600 focus:ring-red-500"
                                    />
                                    <label htmlFor="rentByDay" className="font-medium text-gray-700">Theo ngày</label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="pickupDate" className="block text-xs text-gray-500 mb-1">Ngày nhận</label>
                                        <input
                                            type="date"
                                            id="pickupDate"
                                            value={pickupDate}
                                            onChange={(e) => {
                                                const newDate = e.target.value;
                                                setPickupDate(newDate);
                                                const startDateTime = new Date(`${newDate}T${pickupTime}`);
                                                const endDateTime = new Date(`${returnDate}T${returnTime}`);
                                                if (endDateTime <= startDateTime || (endDateTime - startDateTime) / (1000 * 60 * 60) <= 24) {
                                                    const nextDay = new Date(startDateTime);
                                                    nextDay.setDate(startDateTime.getDate() + 2);
                                                    setReturnDate(nextDay.toISOString().split('T')[0]);
                                                    setReturnTime(pickupTime);
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="returnDate" className="block text-xs text-gray-500 mb-1">Ngày trả</label>
                                        <input
                                            type="date"
                                            id="returnDate"
                                            value={returnDate}
                                            onChange={(e) => {
                                                const newReturnDate = e.target.value;
                                                const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
                                                const endDateTime = new Date(`${newReturnDate}T${returnTime}`);
                                                if ((endDateTime - startDateTime) / (1000 * 60 * 60) <= 24) {
                                                    toast.error('Thời gian thuê theo ngày phải lớn hơn 24 giờ.', {
                                                        position: "top-right",
                                                        autoClose: 3000,
                                                    });
                                                    return;
                                                }
                                                setReturnDate(newReturnDate);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                            min={new Date(new Date(pickupDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="pickupTimeDay" className="block text-xs text-gray-500 mb-1">Giờ nhận</label>
                                        <input
                                            type="time"
                                            id="pickupTimeDay"
                                            value={pickupTime}
                                            onChange={(e) => {
                                                const newPickupTime = e.target.value;
                                                setPickupTime(newPickupTime);
                                                const startDateTime = new Date(`${pickupDate}T${newPickupTime}`);
                                                const endDateTime = new Date(`${returnDate}T${returnTime}`);
                                                if (endDateTime <= startDateTime || (endDateTime - startDateTime) / (1000 * 60 * 60) <= 24) {
                                                    const nextHour = new Date(startDateTime.getTime() + 25 * 60 * 60 * 1000).toTimeString().slice(0, 5);
                                                    setReturnTime(nextHour);
                                                    const nextDay = new Date(startDateTime);
                                                    nextDay.setDate(startDateTime.getDate() + 2);
                                                    setReturnDate(nextDay.toISOString().split('T')[0]);
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="returnTimeDay" className="block text-xs text-gray-500 mb-1">Giờ trả</label>
                                        <input
                                            type="time"
                                            id="returnTimeDay"
                                            value={returnTime}
                                            onChange={(e) => {
                                                const newReturnTime = e.target.value;
                                                const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
                                                const endDateTime = new Date(`${returnDate}T${newReturnTime}`);
                                                if (endDateTime <= startDateTime) {
                                                    toast.error('Giờ trả phải sau giờ nhận.', {
                                                        position: "top-right",
                                                        autoClose: 3000,
                                                    });
                                                    return;
                                                }
                                                if ((endDateTime - startDateTime) / (1000 * 60 * 60) <= 24) {
                                                    toast.error('Thời gian thuê theo ngày phải lớn hơn 24 giờ.', {
                                                        position: "top-right",
                                                        autoClose: 3000,
                                                    });
                                                    return;
                                                }
                                                setReturnTime(newReturnTime);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'hour'}
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
                                            const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
                                            const endDateTime = new Date(`${pickupDate}T${returnTime}`);
                                            if (endDateTime <= startDateTime) {
                                                const nextHour = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000).toTimeString().slice(0, 5);
                                                setReturnTime(nextHour);
                                            }
                                        }}
                                        className="mr-2 text-red-600 focus:ring-red-500"
                                    />
                                    <label htmlFor="rentByHour" className="font-medium text-gray-700">Theo giờ</label>
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
                                                const startDateTime = new Date(`${newDate}T${pickupTime}`);
                                                const endDateTime = new Date(`${newDate}T${returnTime}`);
                                                if (endDateTime <= startDateTime) {
                                                    const nextHour = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000).toTimeString().slice(0, 5);
                                                    setReturnTime(nextHour);
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'day'}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div></div>
                                    <div>
                                        <label htmlFor="pickupTimeHour" className="block text-xs text-gray-500 mb-1">Giờ bắt đầu</label>
                                        <input
                                            type="time"
                                            id="pickupTimeHour"
                                            value={pickupTime}
                                            onChange={(e) => {
                                                const newPickupTime = e.target.value;
                                                setPickupTime(newPickupTime);
                                                const startDateTime = new Date(`${pickupDate}T${newPickupTime}`);
                                                const endDateTime = new Date(`${pickupDate}T${returnTime}`);
                                                if (endDateTime <= startDateTime) {
                                                    const nextHour = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000).toTimeString().slice(0, 5);
                                                    setReturnTime(nextHour);
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'day'}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="returnTimeHour" className="block text-xs text-gray-500 mb-1">Giờ kết thúc</label>
                                        <input
                                            type="time"
                                            id="returnTimeHour"
                                            value={returnTime}
                                            onChange={(e) => {
                                                const newReturnTime = e.target.value;
                                                const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
                                                const endDateTime = new Date(`${pickupDate}T${newReturnTime}`);
                                                if (endDateTime <= startDateTime) {
                                                    toast.error('Giờ kết thúc phải sau giờ bắt đầu.', {
                                                        position: "top-right",
                                                        autoClose: 3000,
                                                    });
                                                    return;
                                                }
                                                const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
                                                if (diffHours < 3) {
                                                    toast.error('Thời gian thuê tối thiểu là 3 giờ.', {
                                                        position: "top-right",
                                                        autoClose: 3000,
                                                    });
                                                    return;
                                                }
                                                if (diffHours > 24) {
                                                    toast.error('Thời gian thuê theo giờ không được vượt quá 24 giờ.', {
                                                        position: "top-right",
                                                        autoClose: 3000,
                                                    });
                                                    return;
                                                }
                                                setReturnTime(newReturnTime);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            disabled={rentalType === 'day'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ... (Phần thanh toán) ... */}
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
                                    <span>
                                        {totalPrice.toLocaleString()}đ
                                        {days > 0 && ` x ${days} ngày`}
                                        {hours > 0 && ` ${days > 0 ? '+' : ''} ${hours} giờ`}
                                    </span>
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

                            <div className="border-t border-gray-300 pt-4 mt-4">
                                <h3 className="font-bold text-gray-900 mb-3">Áp dụng giảm giá</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="applyDiscount"
                                            checked={applyDiscount}
                                            onChange={(e) => setApplyDiscount(e.target.checked)}
                                            className="mr-2 text-red-600 focus:ring-red-500"
                                        />
                                        <label htmlFor="applyDiscount" className="text-gray-700">Áp dụng giảm giá</label>
                                    </div>
                                    {applyDiscount && (
                                        <>
                                            <div className="flex items-center">
                                                <label htmlFor="couponCode" className="text-gray-700 mr-2">Coupon:</label>
                                                <input
                                                    type="text"
                                                    id="couponCode"
                                                    placeholder="Nhập mã coupon"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    className="flex-grow px-3 py-1 border border-gray-300 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <label htmlFor="discountCode" className="text-gray-700 mr-2">Mã giảm giá:</label>
                                                <input
                                                    type="text"
                                                    id="discountCode"
                                                    placeholder="Nhập mã giảm giá"
                                                    value={discountCode}
                                                    onChange={(e) => setDiscountCode(e.target.value)}
                                                    className="flex-grow px-3 py-1 border border-gray-300 rounded-lg text-sm"
                                                />
                                            </div>
                                        </>
                                    )}
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