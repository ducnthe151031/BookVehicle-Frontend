import React, { useState } from "react";
import { featuredCars } from "../Authentication/Home.jsx"; // Đường dẫn đúng tới file export featuredCars
import "/src/css/ListVehicle.css";
import Header from './Header.jsx';

const ListVehicle = () => {
    const [filters, setFilters] = useState({
        brand: "",
        type: "",
        location: "",
        seats: "",
        fuel: "",
        gearbox: ""
    });

    // Tách thêm brand/type/seats/fuel từ desc cho filter nếu cần.
    const vehicles = featuredCars.map(car => ({
        ...car,
        seats: car.desc.match(/(\d+) chỗ/)?.[1] || "",
        fuel: car.desc.match(/(Xăng|Điện)/)?.[1] || "",
        gearbox: car.desc.match(/(Tự động|Xe ga)/)?.[1] || "",
        brand: car.name.split(" ")[0] // Lấy brand từ tên xe
    }));

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredVehicles = vehicles.filter((v) => {
        return (
            (!filters.brand || v.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
            (!filters.type || v.type.toLowerCase().includes(filters.type.toLowerCase())) &&
            (!filters.location || v.location.toLowerCase().includes(filters.location.toLowerCase())) &&
            (!filters.seats || String(v.seats) === filters.seats) &&
            (!filters.fuel || v.fuel.includes(filters.fuel)) &&
            (!filters.gearbox || v.gearbox.includes(filters.gearbox))
        );
    });

    return (
        <div className="list-vehicle-page">
            <Header />
            <h2>Danh sách các xe</h2>
            <div className="filters">
                <input
                    type="text"
                    name="brand"
                    placeholder="VD: Toyota, Honda"
                    value={filters.brand}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="type"
                    placeholder="VD: Sedan, SUV"
                    value={filters.type}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Địa điểm"
                    value={filters.location}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="seats"
                    placeholder="Số chỗ"
                    value={filters.seats}
                    onChange={handleFilterChange}
                />
                <select name="fuel" value={filters.fuel} onChange={handleFilterChange}>
                    <option value="">Nhiên liệu</option>
                    <option value="Xăng">Xăng</option>
                    <option value="Điện">Điện</option>
                </select>
                <select name="gearbox" value={filters.gearbox} onChange={handleFilterChange}>
                    <option value="">Hộp số</option>
                    <option value="Tự động">Tự động</option>
                    <option value="Xe ga">Xe ga</option>
                </select>
            </div>
            <div className="vehicle-grid">
                {filteredVehicles.length === 0 ? (
                    <div style={{textAlign:'center', gridColumn:'1/-1', color:'#666', fontSize:'1.1rem'}}>Không tìm thấy xe phù hợp.</div>
                ) : (
                    filteredVehicles.map((car) => (
                        <div className="vehicle-card" key={car.id}>
                            <img src={car.img} alt={car.name} />
                            <h4>{car.name}</h4>
                            <div style={{ color: '#a37d44', fontSize: '1.05rem', margin: '6px 0 2px' }}><b>{car.desc}</b></div>
                            <div style={{ fontSize: '0.93rem', color: '#666', marginBottom: 4 }}>
                                <span>⭐ {car.rating} ({car.trips} chuyến) &nbsp; | &nbsp; {car.location}</span>
                            </div>
                            <div className="car-card-footer">
                                <span className="price">{car.price}</span>
                                <button className="btn-detail" onClick={() => window.location.href = `/vehicledetail/${car.id}`}>
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListVehicle;
