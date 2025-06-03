import React, { useState } from 'react';
import '/src/css/BookingForm.css';

const BookingForm = () => {
    const [formData, setFormData] = useState({
        driver: '',
        pickUpLocation: '',
        dropOffLocation: '',
        car: '',
        fromDate: '',
        toDate: '',
        status: '',

    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name in formData.options) {
            setFormData({
                ...formData,
                options: {
                    ...formData.options,
                    [name]: checked,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Booking data submitted:', formData);
    };

    return (
        <div className="booking-page">
            <div className="booking-overlay">
                <h2 className="booking-header">Đặt xe mới</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="driver" placeholder="Người thuê xe *" required onChange={handleChange} />
                    <input type="text" name="car" placeholder="Xe *" required onChange={handleChange} />

                    <input type="text" name="pickUpLocation" placeholder="Điểm nhận xe *" required onChange={handleChange} />
                    <input type="text" name="dropOffLocation" placeholder="Điểm trả xe *" required onChange={handleChange} />

                    <input type="date" name="fromDate" required onChange={handleChange} />
                    <input type="date" name="toDate" required onChange={handleChange} />

                    <select name="status" required onChange={handleChange}>
                        <option value="">-- Chọn trạng thái --</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>



                    <button type="submit" className="booking-btn">TẠO</button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
