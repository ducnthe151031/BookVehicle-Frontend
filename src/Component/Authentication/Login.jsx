import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import '/src/css/Login.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    const navigate = useNavigate(); // ✅ Hook điều hướng

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/v1/auth/login', formData);
            setMessage('Đăng nhập thành công!');
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } catch (error) {
            setMessage('Đăng nhập thất bại!');
        }
    };

    return (
        <div className="login-page">
            <div className="login-overlay">
                <div className="login-box">
                    <h2 className="login-header">Đăng nhập</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nhập username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="login-btn">Login</button>
                    </form>
                    {message && <p className="login-message">{message}</p>}
                    <p className="signup-text">
                        Không có tài khoản? <Link to="/register" className="signup-link">Đăng ký</Link> đây
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
