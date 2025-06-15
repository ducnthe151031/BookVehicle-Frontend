import React, { useState, useEffect } from 'react';
import { Car, Users, Fuel, ArrowLeft, MapPin, Star, CheckCircle, Info, Settings } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarDetails } from '../service/authentication.js';
import Header from "./Header.jsx";
import {useAuth} from "../context/AuthContext.jsx";

const CarDetail = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { customer, logOut } = useAuth();

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

    const handleBookNow = () => {
        if (car && car.status === 'AVAILABLE') {
            navigate(`/vehicle/bookings/${carId}`);
        }
    };
    const handleChangePassword = () => {
        navigate('/change-password');
    };
    const handleBack = () => {
        navigate('/home');
    };

    const today = new Date().toISOString().split('T')[0]; // Current date: 2025-06-14
    const defaultStartDate = new Date(today);
    defaultStartDate.setDate(defaultStartDate.getDate() + 5); // 5 days from now: 2025-06-19
    const defaultEndDate = new Date(defaultStartDate);
    defaultEndDate.setDate(defaultEndDate.getDate() + 3); // 3 days later: 2025-06-22

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
            {/* Header */}
            <Header logOut={logOut} handleChangePassword={handleChangePassword} customer={customer} />



            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">


                        {/* Car Details Card */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Lựa chọn hàng đầu</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Car Image */}
                                    <div>
                                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                            {car.imageUrl ? (
                                                <img
                                                    src={car.imageUrl}
                                                    alt={car.vehicleName}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Car className="w-32 h-32 text-gray-400" />
                                            )}
                                        </div>

                                        {/* Car Features */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Users className="w-4 h-4 text-gray-600" />
                                                <span>{car.seatCount} chỗ ngồi</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Settings className="w-4 h-4 text-gray-600" />
                                                <span>{car.gearBox || 'Số tự động'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Fuel className="w-4 h-4 text-gray-600" />
                                                <span>{car.fuelType || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span>🛡️ Không giới hạn số km/km</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Car Info */}
                                    <div>
                                        <h2 className="text-xl font-bold mb-2">{car.vehicleName}</h2>
                                        <p className="text-sm text-gray-600 mb-2">Hoặc xe cùng loại tương tự</p>

                                        <div className="mb-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <MapPin className="w-4 h-4 text-gray-600" />
                                                <span>{car.location || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 mb-4">
                                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">9.4</span>
                                            <span className="text-sm font-medium">Xuất sắc</span>
                                            <span className="text-xs text-gray-500">42 đánh giá</span>
                                            <Info className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-medium mb-2">Lựa chọn tuyệt vời!</h3>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span>Đánh giá của khách hàng:  x / 10</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span>Chính sách nhiên liệu phổ biến nhất</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span>Quầy thành toán đễ tìm</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Included Features */}
                            <div className="border-t p-6">
                                <h3 className="font-medium mb-3">Giá đã bao gồm</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Miễn phí hủy tới 48 giờ trước khi nhận xe</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Bảo hiểm tai nạn đơn và cháy với mức miễn thường bằng 0 VND</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Bảo hiểm vật chất với mức miễn thường bằng 0 VND</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Số dặm/kilomét không giới hạn</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Features */}
                            <div className="border-t p-6">
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div>✓ Công ty nổi tiếng nhất tại đây</div>
                                    <div>✓ Không phải chờ đội lâu</div>
                                    <div>✓ Hủy đặt thuê miễn phí</div>
                                    <div>✓ Số dặm/kilomét không giới hạn</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pickup/Return Info */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-medium mb-4">Nhận xe và trả xe</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <span className="text-sm font-medium">
                                            {defaultStartDate.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'long' })} • 10:00
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-4">{car.location || 'N/A'}</p>
                                </div>

                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                        <span className="text-sm font-medium">
                                            {defaultEndDate.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'long' })} • 10:00
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-4">{car.location || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-medium mb-4">Chi tiết giá xe</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Phí thuê xe</span>
                                    <span>{car.pricePerDay?.toLocaleString()} VND</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Giá VND được quy đổi thành đơn hàng định luật USD của bạn
                                </div>

                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-medium">
                                        <span>Giá cho 3 ngày:</span>
                                        <span>{(car.pricePerDay * 3)?.toLocaleString()} VND</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                                <p className="text-sm font-medium text-green-800">
                                    Bạn đã tiết kiệm khoảng xxxxxx VND cho xe này - giá giảm tốt!
                                </p>
                                <p className="text-xs text-green-700 mt-1">
                                    Giá xe hàng đầu ở khu vực {car.location || 'N/A'}. Chỉ có xxxxx VND ở chỗ đâm rây thay vì trong năm!
                                </p>
                            </div>

                            <button
                                onClick={handleBookNow}
                                disabled={car.status !== 'AVAILABLE'}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                            >
                                Đến bước thanh toán
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-medium mb-2">Thông tin thêm</h3>
                            <div className="text-sm text-gray-600">
                                <p>Biển số: {car.liecensePlate}</p>
                                <p>Loại nhiên liệu: {car.fuelType}</p>
                                <p>Trạng thái: {car.status === 'AVAILABLE' ? 'Có sẵn' : 'Đã thuê'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;