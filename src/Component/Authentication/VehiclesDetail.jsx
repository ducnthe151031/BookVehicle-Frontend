import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VehicleDetail.css';
//thu
const VehicleDetail = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/vehicles/${id}`);
                setVehicle(res.data);
            } catch (error) {
                console.error('Lỗi khi tải thông tin xe:', error);
            }
        };
        fetchVehicle();
    }, [id]);

    if (!vehicle) return <p>Đang tải thông tin xe...</p>;

    return (
        <div className="vehicle-detail-container">
            <div className="vehicle-info">
                <img src={vehicle.imageUrl} alt={vehicle.name} className="vehicle-image" />
                <p className="label">Tên xe</p>
                <p>{vehicle.name}</p>
                <p className="label">Hãng xe</p>
                <p>{vehicle.brand}</p>
            </div>

            <div className="vehicle-attributes">
                <p><b>Địa điểm xe:</b> {vehicle.location}</p>
                <p><b>Độ tuổi xe:</b> {vehicle.minimum_age}</p>
                <p><b>Giá thuê theo ngày:</b> {vehicle.daily_price} đ</p>
                <p><b>Loại nhiên liệu:</b> {vehicle.type}</p>
                <p><b>Hộp số:</b> {vehicle.gearbox}</p>
                <p><b>Số chỗ ngồi:</b> {vehicle.seats}</p>
                <p><b>Phân loại xe:</b> {vehicle.category}</p>
                <p><b>Biển số xe:</b> {vehicle.licensePlate}</p>
                <p><b>Mô tả thêm về xe:</b> {vehicle.description}</p>
            </div>

            <button className="book-button">Đặt xe</button>
        </div>
    );
};

export default VehicleDetail;
