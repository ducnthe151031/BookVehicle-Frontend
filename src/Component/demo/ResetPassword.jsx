import React from 'react';
import '/src/css/ResetPassword.css';

const ResetPassword = () => {
    return (
        <div className="reset-page">
            <div className="reset-overlay">
                <div className="reset-header">Đặt lại mật khẩu</div>
                <div className="reset-box">
                    <input type="email" placeholder="Nhập email đã đăng ký" />
                    <button className="reset-btn">Gửi liên kết đặt lại</button>
                    <div className="back-login-text">
                        <a href="/login" className="back-login-link">← Quay lại đăng nhập</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
