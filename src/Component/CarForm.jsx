import React, { useState } from 'react';
import { createCar } from '../service/authentication.js';
import '/src/css/CarForm.css';

const CarForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        minimum_age: '',
        daily_price: '',
        type: 'Gasoline',
        gearbox: 'Automatic',
        seats: '',
        category: '',
        brand: '',
        licensePlate: '',
        description: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // Chuyển các giá trị number thành số đúng
            const payload = {
                ...formData,
                minimum_age: Number(formData.minimum_age),
                daily_price: Number(formData.daily_price),
                seats: Number(formData.seats),
            };

            await createCar(payload); // Gửi JSON

            setMessage('Tạo xe thành công!');
            setFormData({
                name: '',
                location: '',
                minimum_age: '',
                daily_price: '',
                type: 'Gasoline',
                gearbox: 'Automatic',
                seats: '',
                category: '',
                brand: '',
                licensePlate: '',
                description: '',
            });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi tạo xe.');
        }
    };

    return (
        <div className="car-page">
            <div className="car-overlay">
                <div className="car-box">
                    <h2 className="car-header">Tạo Xe Mới</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Tên xe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Địa điểm của xe"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="minimum_age"
                            placeholder="Độ tuổi của xe"
                            value={formData.minimum_age}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="daily_price"
                            placeholder="Giá thuê theo ngày"
                            value={formData.daily_price}
                            onChange={handleChange}
                            required
                        />

                        <label>
                            Loại nhiên liệu:
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="Diesel">Diesel</option>
                                <option value="Gasoline">Xăng</option>
                                <option value="Electric">Điện</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="PlugInHybrid">Plug-in Hybrid</option>
                                <option value="Unknown">Không rõ</option>
                            </select>
                        </label>

                        <label>
                            Hộp số:
                            <select
                                name="gearbox"
                                value={formData.gearbox}
                                onChange={handleChange}
                                required
                            >
                                <option value="Manual">Số sàn</option>
                                <option value="Automatic">Số tự động</option>
                            </select>
                        </label>

                        <input
                            type="number"
                            name="seats"
                            placeholder="Số chỗ ngồi"
                            value={formData.seats}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="Phân loại xe (VD: Sedan, SUV...)"
                            value={formData.category}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="brand"
                            placeholder="Hãng xe (VD: Toyota, Honda...)"
                            value={formData.brand}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="licensePlate"
                            placeholder="Biển số xe"
                            value={formData.licensePlate}
                            onChange={handleChange}
                        />

                        <textarea
                            name="description"
                            placeholder="Mô tả thêm về xe"
                            value={formData.description}
                            onChange={handleChange}
                        />

                        <button type="submit" className="car-btn">
                            Tạo Xe
                        </button>
                    </form>

                    {message && <p className="car-message">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default CarForm;
