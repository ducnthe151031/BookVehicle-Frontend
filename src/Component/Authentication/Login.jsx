import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/src/css/Login.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/v1/auth/login', formData);
            setMessage('Đăng nhập thành công!');
            setTimeout(() => navigate('/home'), 1000);
        } catch {
            setMessage('Đăng nhập thất bại!');
        }
    };

    return (
        <div className="login-root">
            <div className="login-container">
                <div className="login-form-block">
                    <div className="login-logo-row">
                        <img src="https://cdn-icons-png.flaticon.com/128/1178/1178431.png" alt="logo" className="login-logo" />
                        <span className="login-logo-title">Thuê Xe</span>
                    </div>
                    <h3 className="login-welcome">Chào mừng</h3>
                    <h2 className="login-title">Đăng nhập</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <label>Tên người dùng</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nhập tên của bạn"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />
                        <label>Mật khẩu</label>
                        <div className="login-password-row">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Nhập mật khẩu của bạn"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword((show) => !show)}
                                title={showPassword ? "Ẩn" : "Hiện mật khẩu"}
                            >{showPassword ? "🙈" : "👁️"}</span>
                        </div>
                        <div className="login-options-row">
                            <label>
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                />
                                Ghi nhớ
                            </label>
                            <Link to="/forgot" className="login-forgot">Quên mật khẩu?</Link>
                        </div>
                        <button type="submit" className="login-btn">Đăng nhập</button>
                    </form>
                    {message && <div className="login-message">{message}</div>}
                    <div className="login-register">
                        Bạn không có tài khoản? <Link to="/register">Đăng kí</Link>
                    </div>
                </div>
                <div className="login-img-block">
                    <img
                        src="https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2022/grand-cherokee/vlp/gallery/2022-Jeep-Grand-Cherokee-Overview-Gallery-02.jpg.image.1440.jpg"
                        alt="Car"
                        className="login-car-img"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
