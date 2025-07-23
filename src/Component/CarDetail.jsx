import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
// Thêm icon User để làm avatar
import {
    Car,
    Users,
    Fuel,
    ArrowLeft,
    MapPin,
    Star,
    CheckCircle,
    Info,
    Settings,
    Upload,
    Clock,
    Calendar,
    User,
    XCircle,
    Tag,
    FileText
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    createReview,
    getCarDetails,
    getRating,
    getReviewsByVehicle,
    validateCoupon
} from '../service/authentication.js';
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

    // --- STATE MỚI CHO COUPON ---
    const [couponCodeInput, setCouponCodeInput] = useState(''); // State cho ô input
    const [appliedCoupon, setAppliedCoupon] = useState(null); // Lưu thông tin coupon đã áp dụng
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

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

        // Áp dụng giảm giá từ coupon đã xác thực
        if (appliedCoupon) {
            totalPrice = Math.max(0, totalPrice - appliedCoupon.discountAmount);
        }

        return { days, hours, duration: rentalType === 'day' ? days : hours, totalPrice };
    };

    const { days, hours, totalPrice } = calculateDurationAndTotal();
    const calculatedSubtotal = totalPrice + SURCHARGE_AMOUNT;

    // --- HÀM MỚI ĐỂ XỬ LÝ COUPON ---
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


    const handleRemoveCoupon = () => {
        // 1. Xóa thông tin coupon đã áp dụng khỏi state
        setAppliedCoupon(null);

        // 2. Xóa mã coupon trong ô nhập liệu
        setCouponCodeInput('');

        // 3. Xóa bất kỳ thông báo lỗi nào liên quan đến coupon
        setCouponError('');
    };

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
                            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-200 hover:shadow-xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3 flex items-center gap-2">
                                    <Car className="w-6 h-6 text-blue-600" />
                                    Thông tin xe
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left: Image Gallery and Basic Info */}
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
                                    {/* Right: Detailed Information */}
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
                            </div>                        </div>


                        {/* ... (Phần điều khoản) ... */}
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
        </div>
    );
};

export default CarDetail;