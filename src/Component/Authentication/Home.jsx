import '/src/css/HomePage.css';
import {useAuth} from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Header from 'src/Component/Header.jsx';



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
    return (
        <>
            <h1>Màn home đang làm.......</h1>
            <button
                onClick={logOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                Đăng xuất
            </button>
        </>
    );
};

export default HomePage;
