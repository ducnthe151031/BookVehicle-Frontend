import '/src/css/HomePage.css';
import {useAuth} from "../../context/AuthContext.jsx";

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
