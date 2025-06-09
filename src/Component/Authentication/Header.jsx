import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import '/src/css/Header.css';

const Header = () => {
    const { customer, logOut } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="navbar">
            <div className="navbar-left" onClick={() => navigate("/home")}>
                <img
                    src="https://img.icons8.com/ios-filled/50/000000/car--v2.png"
                    alt="Logo"
                    className="navbar-logo"
                />
                <span className="navbar-title">Thuê Xe</span>
            </div>
            <nav className="navbar-menu">
                <Link to="/home">Trang chủ</Link>
                <Link to="/listVehicle">Các loại xe</Link>
                <Link to="#">Người cho thuê</Link>
                <Link to="#">Liên lạc với chúng tôi</Link>
            </nav>
            <div className="navbar-right">
                {customer ? (
                    <button className="navbar-btn" onClick={logOut}>
                        Đăng xuất
                    </button>
                ) : (
                    <button className="navbar-btn" onClick={() => navigate("/login")}>
                        Đăng nhập
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
