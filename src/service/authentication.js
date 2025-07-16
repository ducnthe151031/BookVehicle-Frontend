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

export const getVehiclesIsApproved = async (page, size, filters = {}) => {
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
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/list/approved`,
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

export const deleteVehicle = async (vehicleId) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/cars`,
            {
                ...getAuthConfig(),
                data: { id: vehicleId }, // Send id in body as per your API
            }
        );
    } catch (e) {
        throw e;
    }
};

export const approveVehicle = async (vehicleId) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/approve-vehicle`,
            {
                ...getAuthConfig(),
                data: { id: vehicleId }, // Send id in body as per your API
            }
        );
    } catch (e) {
        throw e;
    }
};


export const updateVehicle = async (vehicleId, vehicleData) => {
    try {
        return await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/cars`,
            {
                ...vehicleData,
                id: vehicleId, // Ensure id is included
            },
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(
            'http://localhost:8080/v1/admin/category-list',
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const getRentals = async (page, size = 10) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/rental-list`,
            {
                ...getAuthConfig(),
                params: { page, size },
            }
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const getMyRentals = async (page, size = 10) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/user/rental-list`,
            {
                ...getAuthConfig(),
                params: { page, size },
            }
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/user/profile`,
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const getCarDetails = async (carId) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/view`,
            { id: carId }, // Send id in request body
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const approveBooking = async (bookingId) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/approve-booking/${bookingId}`,
            {},
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const rejectBooking = async (bookingId) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/reject-booking/${bookingId}`,
            {},
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};
export const getProfile = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/user/profile`, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};


export const updateProfile = async (profileData) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/v1/user/profile`, profileData,  getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/user/change-password`, passwordData, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

export const forgotPassword = async (email) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/auth/forgot-password`,  email );
    return response.data;
};

export const resetPassword = async (data) => {
    const { token, newPassword } = data;
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/user/reset-password?token=${token}`, {
        newPassword // Gửi newPassword trong body
    }, );
    return response.data;
};

export const getReviewsByVehicle = async (vehicleId, page = 0, size = 5) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/user/vehicle/${vehicleId}`,
            {
                params: { page, size }
            }
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const createReview = async (reviewData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/v1/user`,
            reviewData,
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};


export const updateReview = async (reviewId, reviewData) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/v1/user/${reviewId}`,
            reviewData,
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};


export const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/v1/user/${reviewId}`,
            getAuthConfig()
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const getRating = async (vehicleId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/user/average-rating/${vehicleId}`,
            getAuthConfig()

        );
        return response.data;
    } catch (e) {
        throw e;
    }
};


export const getCoupons = async () => {
    try {
        // Assuming your backend returns data in the format { data: { content: [], totalPages: X } }
        // If not, you might need to adjust how the response is handled in the component.
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/coupons`,
            getAuthConfig(),

        );
        return response;
    } catch (e) {
        throw e;
    }
};

export const createCoupon = async (couponData) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/v1/coupons`,
            couponData,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const updateCoupon = async (id, couponData) => {
    try {
        return await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/v1/coupons/${id}`,
            couponData,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const deleteCoupon = async (id) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/v1/coupons/${id}`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};


export const validateCoupon = async (couponCode) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/coupons/code/${couponCode}`,
            getAuthConfig()
        );
        return response;
    } catch (e) {
        throw e;
    }
};

export const createCategory = async (category) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/category-list`,
            category,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};


export const updateCategory = async (id, category) => {
    try {
        return await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/category-list/${id}`,
            category,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};


export const deleteCategory = async (id) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/category-list/${id}`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const createBrand = async (brand) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/brand-list`,
            brand,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};


export const updateBrand = async (id, brand) => {
    try {
        return await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/brand-list/${id}`,
            brand,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};


export const deleteBrand = async (id) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/v1/admin/brand-list/${id}`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

