import React from "react";
import "/src/css/VehicleDetail.css";
import { featuredCars } from "./Authentication/Home.jsx";
import { useParams } from "react-router-dom";

const VehicleDetail = () => {
    const { id } = useParams();
    const car = featuredCars.find((v) => String(v.id) === String(id));

    if (!car) return <div>Xe không tồn tại!</div>;

    return (
        <div className="vehicle-detail-container">
            <div className="vehicle-detail-main">
                <div className="vehicle-images">
                    <img src={car.img} alt={car.name} />
                </div>
                <div className="vehicle-info">
                    <h2>{car.name}</h2>
                    <div className="vehicle-attr">
                        <span className="price">{car.price}</span>
                        <span>{car.desc}</span>
                    </div>
                    <div className="vehicle-location">📍 {car.location}</div>
                    {/* Bạn có thể bổ sung các field như car.licensePlate nếu có */}
                    <p className="vehicle-desc">
                        {/* Nếu car.desc ngắn, bạn có thể thêm mô tả dài */}
                        Đây là một chiếc xe tuyệt vời dành cho các chuyến đi ngắn hoặc dài. Xe được bảo trì tốt và đã phục vụ nhiều khách hàng hài lòng.
                    </p>
                    <ul className="vehicle-utilities">
                        <li>✅ Bảo hiểm dân sự</li>
                        <li>✅ Định vị GPS</li>
                        <li>✅ Camera lùi</li>
                        <li>✅ Giao xe tận nơi</li>
                    </ul>
                    <button className="btn-book">Đặt xe ngay</button>
                </div>
                <div className="vehicle-owner-card">
                    <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Nguyễn Văn A" />
                    <div>
                        <div className="owner-name">Nguyễn Văn A</div>
                        <div>⭐ 4.9 | 126 chuyến</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetail;
