import React from "react";
import "/src/css/VehicleDetail.css";
import { featuredCars } from "./Home";
import {useParams} from "react-router-dom";

const vehicle = {
    name: "Mercedes C200 2018",
    images: [
        "https://cdn.dealeraccelerate.com/graemehunt/1/734/23541/1920x1440/2020-porsche-cayenne-turbo-s-e-hybrid",
    ],
    price: "900k/1 ngày",
    location: "Đống Đa, Hà Nội",
    minAge: 23,
    fuel: "Xăng",
    gearbox: "Tự động",
    seats: 4,
    type: "Sedan",
    licensePlate: "29A-123.45",
    desc: "Mercedes C200 là lựa chọn lý tưởng cho chuyến đi cao cấp. Xe mới, sạch sẽ, nội thất da sang trọng, dàn lạnh cực sâu, bảo hiểm đầy đủ.",
    utilities: [
        "Bảo hiểm dân sự",
        "Định vị GPS",
        "Camera lùi",
        "Miễn phí giao xe trong bán kính 5km",
    ],
    owner: {
        name: "Nguyễn Văn A",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        rate: 4.9,
        trips: 126,
    }
};

const VehicleDetail = () => {
    const { id } = useParams();
    // Nếu là string thì nên parseInt, nếu id là số
    const car = featuredCars.find(v => String(v.id) === String(id));

    if (!car) return <div>Xe không tồn tại!</div>;
    return (
        <div className="vehicle-detail-container">
            <div className="vehicle-detail-main">
                <div className="vehicle-images">
                    <img src={vehicle.images[0]} alt={vehicle.name} />
                </div>
                <div className="vehicle-info">
                    <h2>{vehicle.name}</h2>
                    <div className="vehicle-attr">
                        <span className="price">{vehicle.price}</span>
                        <span>{vehicle.seats} chỗ</span>
                        <span>| {vehicle.fuel}</span>
                        <span>| {vehicle.gearbox}</span>
                        <span>| {vehicle.type}</span>
                    </div>
                    <div className="vehicle-location">📍 {vehicle.location}</div>
                    <div className="vehicle-license">Biển số: {vehicle.licensePlate}</div>
                    <div className="vehicle-age">Tuổi tối thiểu: {vehicle.minAge}</div>
                    <p className="vehicle-desc">{vehicle.desc}</p>
                    <ul className="vehicle-utilities">
                        {vehicle.utilities.map((item, idx) => (
                            <li key={idx}>✅ {item}</li>
                        ))}
                    </ul>
                    <button className="btn-book">Đặt xe ngay</button>
                </div>
                <div className="vehicle-owner-card">
                    <img src={vehicle.owner.avatar} alt={vehicle.owner.name} />
                    <div>
                        <div className="owner-name">{vehicle.owner.name}</div>
                        <div>⭐ {vehicle.owner.rate} | {vehicle.owner.trips} chuyến</div>
                    </div>
                </div>
            </div>
            {/* Option: Thêm phần đánh giá, các xe tương tự, hoặc policy nếu muốn */}
        </div>
    );
};

export default VehicleDetail;
