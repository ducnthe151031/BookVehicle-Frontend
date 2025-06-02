import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '/src/css/Login.css';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        // Kiểm tra xác nhận mật khẩu
        if (formData.password !== formData.confirmPassword) {
            setMessage('Mật khẩu không khớp!');
            return;
        }
        try {
            await axios.post('http://localhost:8080/v1/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            setMessage('Đăng ký thành công!');
            setTimeout(() => navigate('/login'), 1200);
        } catch (error) {
            setMessage('Đăng ký thất bại!');
        }
    };

    return (
        <div className="login-root">
            <div className="login-container">
                <div className="login-form-block">
                    <div className="login-logo-row">
                        <img src="https://cdn-icons-png.flaticon.com/128/854/854866.png" alt="logo" className="login-logo" />
                        <span className="login-logo-title">Thuê Xe</span>
                    </div>
                    <h3 className="login-welcome">Chào mừng</h3>
                    <h2 className="login-title">Đăng kí</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Nhập email của bạn"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label>Tên người dùng</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nhập tên của bạn"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <label>Mật khẩu</label>
                        <div className="login-password-row">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword((v) => !v)}
                                title={showPassword ? "Ẩn" : "Hiện mật khẩu"}
                            >{showPassword ? "🙈" : "👁️"}</span>
                        </div>
                        <label>Nhập lại mật khẩu</label>
                        <div className="login-password-row">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowConfirm((v) => !v)}
                                title={showConfirm ? "Ẩn" : "Hiện mật khẩu"}
                            >{showConfirm ? "🙈" : "👁️"}</span>
                        </div>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required>
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>
                        </select>
                        <button type="submit" className="login-btn">Đăng kí</button>
                    </form>
                    {message && <div className="login-message">{message}</div>}
                    <div className="login-register">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </div>
                </div>
                <div className="login-img-block">
                    <img
                        src="https://www.directasia.com/sites/default/files/styles/dc_article__laptop/public/media_images/ncd-for-cars-and-bikes.jpg"
                        alt="Car"
                        className="login-car-img"
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
