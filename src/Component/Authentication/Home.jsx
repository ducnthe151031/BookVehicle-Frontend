import React from 'react';
import '/src/css/HomePage.css';
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const carBrands = [
    { name: 'Toyota', logo: 'https://cdn-icons-png.flaticon.com/128/731/731975.png' },
    { name: 'Ford', logo: 'https://cdn-icons-png.flaticon.com/128/882/882747.png' },
    { name: 'Tesla', logo: 'https://cdn-icons-png.flaticon.com/128/5968/5968581.png' },
    { name: 'Volkswagen', logo: 'https://cdn-icons-png.flaticon.com/128/882/882706.png' },
    { name: 'Honda', logo: 'https://cdn-icons-png.flaticon.com/128/882/882735.png' },
    { name: 'Nissan', logo: 'https://cdn-icons-png.flaticon.com/128/882/882777.png' },
    { name: 'Chevrolet', logo: 'https://cdn-icons-png.flaticon.com/128/882/882752.png' },
    { name: 'BMW', logo: 'https://cdn-icons-png.flaticon.com/128/882/882710.png' },
    { name: 'Mercedes-Benz', logo: 'https://cdn-icons-png.flaticon.com/128/882/882728.png' },
    { name: 'Hyundai', logo: 'https://cdn-icons-png.flaticon.com/128/882/882748.png' },
    { name: 'Audi', logo: 'https://cdn-icons-png.flaticon.com/128/882/882705.png' },
    { name: 'KIA', logo: 'https://cdn-icons-png.flaticon.com/128/882/882743.png' }
];

const featuredCars = [
    {
        name: "Porsche Cayenne 2020",
        price: "500k/1 ngày",
        img: "https://cdn.dealeraccelerate.com/graemehunt/1/734/23541/1920x1440/2020-porsche-cayenne-turbo-s-e-hybrid",
        desc: "4 chỗ | Xăng | Tự động"
    },
    {
        name: "Maserati Levante 2021",
        price: "500k/1 ngày",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Maserati_Levante_S_%2801%29.jpg/1200px-Maserati_Levante_S_%2801%29.jpg",
        desc: "4 chỗ | Xăng | Tự động"
    },
    {
        name: "Bentley Flying Spur",
        price: "700k/1 ngày",
        img: "https://www.topgear.com/sites/default/files/2025/03/1-Bentley-Flying-Spur-review-2025-UK.jpg",
        desc: "4 chỗ | Xăng | Tự động"
    }
];

const news = [
    {
        title: "2024 Porsche 911 S/T",
        desc: "Giảm giá 200k cho xe thuê 2024 Porsche 911 S/T khi đặt xe lần đầu tiên thuê.",
        date: "12 tháng 8, 2025",
        img: "https://i.ytimg.com/vi/z4uKU43HtGc/maxresdefault.jpg"
    },
    {
        title: "2017 Alfa Romeo Giulia Quadrifoglio",
        desc: "Giảm ngay 10% cho xe thuê 2017 Alfa Romeo Giulia Quadrifoglio khi đặt thuê web cho bạn bè lần đầu tiên...",
        date: "10 tháng 3, 2025",
        img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Alfa_Romeo_Giulia_Quadrifoglio_Genf_2018.jpg"
    },
    {
        title: "2024 Buick Envision S",
        desc: "Giảm ngay 10% cho xe thuê 2024 Buick Envision S khi đặt lịch thuê web cho bạn bè ngày 8/3 năm 2025.",
        date: "8 tháng 3, 2025",
        img: "https://www.buick.com/content/dam/buick/na/us/english/index/vehicles/2024/suvs/envision/01-images/2024-buick-envision-masthead-1.jpg"
    }
];

const HomePage = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();
    return (
        <div className="homepage-wrapper">
            <div className="logout-btn-wrapper">
                <button
                    onClick={logOut}
                    className="logout-btn">
                    Đăng xuất
                </button>
            </div>
            {/* Banner */}
            <section className="banner">
                <div className="banner-main">
                    <div className="banner-img">
                        <img src="https://www.autoshippers.co.uk/blog/wp-content/uploads/bugatti-centodieci.jpg" alt="banner car" />
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRz-iyV_83QJrVhs6Tj9ZNGP9k6-0vqScZPg&s" alt="banner bike" />
                    </div>
                    <div className="banner-content">
                        <h2>An Toàn, Nhanh Chóng, Thoải Mái</h2>
                        <p>Tự do di chuyển</p>
                        <button onClick={() => navigate('/booking')}>Thuê ngay</button>
                    </div>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Chọn loại xe" />
                    <input type="text" placeholder="Địa điểm nhận xe" />
                    <input type="date" />
                    <input type="date" />
                    <button>Tìm một chiếc xe &rarr;</button>
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
                            <div>{car.desc}</div>
                            <div className="car-card-footer">
                                <span>{car.price}</span>
                                <button>Xem chi tiết</button>
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
                <img className="howto-img" src="https://cdn.tgdd.vn/Files/2021/07/23/1370041/xe-jeep-la-gi-5_1280x720-800-resize.jpg" alt="Jeep Car" />
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
    );
};

export default HomePage