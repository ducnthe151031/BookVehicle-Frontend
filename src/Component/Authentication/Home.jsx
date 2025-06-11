import React from 'react';
import '/src/css/HomePage.css';
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Header from '../Header.jsx';

const carBrands = [
    { name: 'Toyota', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/toyota.svg' },
    { name: 'Ford', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ford.svg' },
    { name: 'Tesla', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tesla.svg' },
    { name: 'Volkswagen', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/volkswagen.svg' },
    { name: 'Honda', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/honda.svg' },
    { name: 'Nissan', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nissan.svg' },
    { name: 'Chevrolet', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/chevrolet.svg' },
    { name: 'BMW', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bmw.svg' },
    { name: 'Mercedes-Benz', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mercedes.svg' },
    { name: 'Hyundai', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/hyundai.svg' },
    { name: 'Audi', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/audi.svg' },
    { name: 'KIA', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/kia.svg' }
];

export const featuredCars = [
    {
        id:1,
        name: "Porsche Cayenne 2020",
        price: "500k/1 giờ",
        img: "https://cdn.dealeraccelerate.com/graemehunt/1/734/23541/1920x1440/2020-porsche-cayenne-turbo-s-e-hybrid",
        desc: "4 chỗ | Xăng | Tự động",
        location: "Đống Đa, Hà Nội",
        rating: 4.9,
        trips: 120,
        fuel: "Xăng",
        type: "Ô tô",
    },
    {
        id:2,
        name: "Maserati Levante 2021",
        price: "500k/1 giờ",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Maserati_Levante_S_%2801%29.jpg/1200px-Maserati_Levante_S_%2801%29.jpg",
        desc: "4 chỗ | Xăng | Tự động",
        location: "Hoàn Kiếm, Hà Nội",
        rating: 4.8,
        trips: 98,
        fuel: "⛽ Xăng",
        type: "Ô tô",
    },
    {
        id:3,
        name: "Bentley Flying Spur",
        price: "700k/1 giờ",
        img: "https://www.topgear.com/sites/default/files/2025/03/1-Bentley-Flying-Spur-review-2025-UK.jpg",
        desc: "4 chỗ | Xăng | Tự động",
        location: "Hoàn Kiếm, Hà Nội",
        rating: 4.9,
        trips: 60,
        fuel: "⛽ Xăng",
        type: "Ô tô",
    },
    {
        id:4,
        name: "Honda SH 2023",
        price: "250k/1 giờ",
        img: "https://images.pexels.com/photos/2237808/pexels-photo-2237808.jpeg?auto=compress&w=600",
        desc: "2 chỗ | Xăng | Xe ga",
        location: "Nam Từ Liêm, Hà Nội",
        rating: 4.8,
        trips: 134,
        fuel: "⛽ Xăng",
        type: "Xe máy",
    },
    {
        id:5,
        name: "Yamaha NVX 2022",
        price: "200k/1 giờ",
        img: "https://images.pexels.com/photos/2044871/pexels-photo-2044871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        desc: "2 chỗ | Xăng | Xe ga",
        location: "Ba Đình, Hà Nội",
        rating: 4.7,
        trips: 85,
        fuel: "⛽ Xăng",
        type: "Xe máy",
    },
    {
        id:6,
        name: "VinFast Klara S 2023",
        price: "180k/1 giờ",
        img: "https://images.pexels.com/photos/14404264/pexels-photo-14404264.jpeg?auto=compress&w=600",
        desc: "2 chỗ | Điện | Xe ga",
        location: "Hà Đông, Hà Nội",
        rating: 4.9,
        trips: 59,
        fuel: "🔋 Điện",
        type: "Xe máy điện",
    }
];

const news = [
    {
        title: "2024 Porsche 911 S/T",
        desc: "Giảm giá 200k cho xe thuê 2024 Porsche 911 S/T khi đặt xe lần đầu tiên thuê.",
        date: "12 tháng 8, 2025",
        img: "https://images.pexels.com/photos/30108435/pexels-photo-30108435/free-photo-of-red-porsche-911-at-southampton-car-show.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        title: "2017 Alfa Romeo Giulia Quadrifoglio",
        desc: "Giảm ngay 10% cho xe thuê 2017 Alfa Romeo Giulia Quadrifoglio khi đặt thuê web cho bạn bè lần đầu tiên...",
        date: "10 tháng 3, 2025",
        img: "https://images.pexels.com/photos/32358822/pexels-photo-32358822/free-photo-of-red-sports-car-driving-through-mountain-highway.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
        title: "2024 Buick Envision S",
        desc: "Giảm ngay 10% cho xe thuê 2024 Buick Envision S khi đặt lịch thuê web cho bạn bè ngày 8/3 năm 2025.",
        date: "8 tháng 3, 2025",
        img: "https://images.pexels.com/photos/25758467/pexels-photo-25758467/free-photo-of-american-car.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
];

const HomePage = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();
    return (
        <>
            <Header />
            <div className="homepage-wrapper">

            {/* Banner */}
            <section className="banner">
                {/* Container để xếp hình ảnh lên chữ */}
                <div className="banner-full-bg">
                    <img
                        src="https://images.pexels.com/photos/32392628/pexels-photo-32392628/free-photo-of-vintage-vehicles-jeep-suv-and-motorcycle.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Bike Banner"
                        className="banner-full-bg-img"
                    />
                    <div className="banner-full-overlay">
                        <h2>An Toàn, Nhanh Chóng,<br />Thoải Mái</h2>
                        <span className="banner-sub">Tự do di chuyển</span>
                        <button className="banner-btn" onClick={() => navigate('/vehicle')}>Thuê ngay</button>
                    </div>
                </div>
                <div className="search-bar">
                    {/* Dropdown loại xe */}
                    <div className="search-dropdown">
                        <select>
                            <option value="">🚗 Tất cả loại xe</option>
                            <option value="gasoline">⛽ Xăng</option>
                            <option value="electric">🔋 Điện</option>
                        </select>
                    </div>

                    <div className="search-input">
                        <span role="img" aria-label="location">📍</span>
                        <input type="text" placeholder="Địa điểm nhận xe" />
                    </div>
                    <div className="search-input">
                        <span role="img" aria-label="calendar">📅</span>
                        <input type="date" />
                    </div>
                    <div className="search-input">
                        <span role="img" aria-label="calendar">📅</span>
                        <input type="date" />
                    </div>
                    <button className="search-bar-btn">
                        <span role="img" aria-label="search">🔍</span> Tìm một chiếc xe
                    </button>
                </div>

            </section>

            {/*Chọn theo hãng xe */}
            <section className="brand-section">
                <h3>Thuê theo hãng xe</h3>
                <div className="brand-list">
                    {carBrands.map((brand, idx) => (
                        <div className="brand-item" key={idx}>
                            <img src={brand.logo} alt={brand.name} />
                            <span>{brand.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bộ lọc & danh sách xe */}
            <section className="car-list-section">
                <h2>Bạn muốn tìm xe như thế nào</h2>
                <div className="car-filter">
                    <button className="active">Tất cả xe</button>
                    <button>Số chỗ</button>
                    <button>Nhiên liệu</button>
                    <button>Loại xe</button>
                    <button>Khu vực</button>
                </div>

                <div className="car-list">
                    {featuredCars.map((car, idx) => (
                        <div className="car-card" key={idx}>
                            <img src={car.img} alt={car.name} />
                            <h4>{car.name}</h4>
                            <div style={{color:'#a37d44', fontSize:'1.1rem', margin:'6px 0 2px'}}><b>{car.desc}</b></div>
                            <div style={{fontSize:'0.93rem', color:'#666', marginBottom:4}}>
                                <span>⭐ {car.rating} ({car.trips} chuyến) &nbsp; | &nbsp; {car.location}</span>
                            </div>
                            {/*xem chi tiết 1 xe */}
                            <div className="car-card-footer">
                                <span style={{fontWeight:'bold'}}>{car.price}</span>
                                <button onClick={() => navigate(`/vehicledetail/${car.id}`)}
                                        className="btn-detail">Xem chi tiết</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Xe nổi bật */}
            <section className="featured-section">
                <h2>Xe nổi bật nhất</h2>
                <div className="featured-list">
                    {featuredCars.map((car, idx) => (
                        <div className="car-card" key={idx}>
                            <img src={car.img} alt={car.name} />
                            <h4>{car.name}</h4>
                            <div>{car.desc}</div>
                            <div className="car-card-footer">
                                <span>{car.price}</span>
                                <button>Xem chi tiết</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tin tức */}
            <section className="news-section">
                <h2>Tin tức</h2>
                <div className="news-list">
                    {news.map((item, idx) => (
                        <div className="news-card" key={idx}>
                            <img src={item.img} alt={item.title} />
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                            <span>{item.date}</span>
                            <button>Đọc thêm</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Cách thuê xe */}
            <section className="howto-section">
                <h2>Cách Thuê Xe</h2>
                <div className="howto-list">
                    <div className="howto-step">
                        <span>🔍</span>
                        <div>
                            <h4>Tìm và chọn</h4>
                            <p>Chọn trong hàng nhiều chiếc xe của chúng tôi, chọn thời gian, địa điểm phù hợp nhất</p>
                        </div>
                    </div>
                    <div className="howto-step">
                        <span>📅</span>
                        <div>
                            <h4>Đặt và xác nhận</h4>
                            <p>Đặt chiếc xe mà bạn mong muốn chỉ với 1 vài cú nhấp chuột và nhận thông tin từ chúng tôi qua email và SMS</p>
                        </div>
                    </div>
                    <div className="howto-step">
                        <span>🧳</span>
                        <div>
                            <h4>Tận hưởng chuyến đi của bạn</h4>
                            <p>Nhận chiếc xe của bạn ở địa điểm mong muốn và tận hưởng chuyến đi của bạn</p>
                        </div>
                    </div>
                </div>
                <img className="howto-img" src="https://images.pexels.com/photos/3551614/pexels-photo-3551614.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Jeep Car" />
            </section>

            {/* Nhận xét khách hàng */}
            <section className="review-section">
                <h3>Nhận xét của khách hàng</h3>
                <blockquote>
                    “Tôi thật sự ấn tượng với chất lượng dịch vụ mà tôi nhận được từ công ty cho thuê xe này. Quy trình thuê xe diễn ra suôn sẻ và dễ dàng, và chiếc xe tôi thuê thì trong tình trạng tuyệt vời. Nhân viên rất thân thiện và nhiệt tình, khiến tôi cảm thấy được chăm sóc chu đáo trong suốt thời gian thuê xe. Tôi chắc chắn sẽ giới thiệu công ty này đến bất kỳ ai đang tìm kiếm trải nghiệm thuê xe cao cấp.”
                </blockquote>
                <div className="review-author">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
                    <div>
                        <b>Loki Nguyen</b>
                        <span>Hà Nội</span>
                    </div>
                </div>
            </section>

            {/* Form cho thuê xe */}
            <section className="rentout-section">
                <h2>Bạn muốn cho thuê xe? Hãy đăng kí ngay</h2>
                <form className="rentout-form">
                    <div className="row">
                        <input type="text" placeholder="Nhập tên của bạn" />
                        <input type="text" placeholder="Số điện thoại" />
                    </div>
                    <div className="row">
                        <input type="text" placeholder="Thành phố" />
                        <input type="text" placeholder="Quận / Huyện" />
                    </div>
                    <input type="text" placeholder="Địa chỉ" />
                    <div className="row">
                        <input type="text" placeholder="Hãng xe" />
                        <input type="text" placeholder="Mẫu xe" />
                    </div>
                    <button type="submit">Cho thuê ngay</button>
                </form>
            </section>
        </div>
        </>
    );
};

export default HomePage