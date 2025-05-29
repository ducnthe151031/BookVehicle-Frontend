import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import '/src/css/Login.css'; // dùng chung CSS với login

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ADMIN'
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
        setMessage('');
        try {
            const res = await axios.post('http://localhost:8080/v1/auth/register', formData);
            setMessage('Đăng ký thành công!');
            setFormData({ username: '', email: '', password: '', role: 'ADMIN' });
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            setMessage('Đăng ký thất bại!');
        }
    };

    return (
        <div className="login-page">
            <div className="login-overlay">
                <div className="login-box">
                    <h2 className="login-header">Đăng ký</h2>
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
                            type="email"
                            name="email"
                            placeholder="Nhập email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>
                        </select>
                        <button type="submit" className="login-btn">Register</button>
                    </form>
                    {message && <p className="login-message">{message}</p>}
                    <p className="signup-text">
                        Đã có tài khoản? <Link to="/login" className="signup-link">Đăng nhập</Link> đấy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
