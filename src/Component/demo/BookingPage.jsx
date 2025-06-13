import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { featuredCars } from './HomePage';
import Header from './Header';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const car = featuredCars.find((c) => c.id === Number(id));
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        startDate: '',
        endDate: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Thông tin đặt xe:", formData);
        navigate('/payment');
    };

    if (!car) return <div>Xe không tồn tại</div>;

    return (
        <>
            <Header />
            <div className="booking-container">
                <h2>Đặt xe: {car.name}</h2>
                <img src={car.img} alt={car.name} style={{ maxWidth: 300 }} />
                <form onSubmit={handleSubmit} className="booking-form">
                    <input type="text" name="name" placeholder="Họ tên" onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} required />
                    <label>Ngày nhận xe:</label>
                    <input type="date" name="startDate" onChange={handleChange} required />
                    <label>Ngày trả xe:</label>
                    <input type="date" name="endDate" onChange={handleChange} required />
                    <button type="submit">Tiếp tục thanh toán</button>
                </form>
            </div>
        </>
    );
};

export default BookingPage;
