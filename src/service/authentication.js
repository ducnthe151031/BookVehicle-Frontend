import axios from "axios";
const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
});
export const login = async (usernameAndPassword) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/v1/auth/login`,
            usernameAndPassword
        )
    } catch (e) {
        throw e;
    }
}

export const register = async (info) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/v1/auth/register`,
            info
        )
    } catch (e) {
        throw e;
    }
}


export const createCar = async (formData) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/cars`,
            formData,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const getVehicles = async (page, size, filters = {}) => {
    try {
        const params = {
            page,
            size,
            brands: filters.brands || undefined,
            categories: filters.categories || undefined,
            vehicleName: filters.vehicleName || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            status: filters.status || undefined,
        };
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/list`,
            {
                ...getAuthConfig(),
                params: params,
            }
        );
    } catch (e) {
        throw e;
    }
};


export const getBrands = async () => {
    try {
        const response = await axios.get(
            'http://localhost:8080/v1/admin/brand-list', // Replace with VITE_API_BASE_URL if applicable
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const createBooking = async (bookingData) => {
    try {
        return await axios.post(
            'http://localhost:8080/v1/user/bookings', // Replace with VITE_API_BASE_URL if applicable
            bookingData,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};