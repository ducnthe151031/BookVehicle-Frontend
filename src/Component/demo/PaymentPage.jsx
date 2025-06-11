import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const PaymentPage = () => {
    const navigate = useNavigate();

    const handlePayment = () => {
        alert('Thanh toán thành công!');
        navigate('/');
    };

    return (
        <>
            <Header />
            <div className="payment-container">
                <h2>Xác nhận & Thanh toán</h2>
                <p><strong>Phương thức:</strong> Quét mã QR Momo/VNPay</p>
                <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ThanhToanXe"
                    alt="QR Code"
                    style={{ margin: '20px 0' }}
                />
                <button onClick={handlePayment}>Xác nhận đã thanh toán</button>
            </div>
        </>
    );
};

export default PaymentPage;
