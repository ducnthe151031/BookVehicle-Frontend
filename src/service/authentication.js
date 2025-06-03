import axios from "axios";
const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
});
export const login = async (usernameAndPassword) => {

    // eslint-disable-next-line no-useless-catch
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
    // eslint-disable-next-line no-useless-catch
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
    // eslint-disable-next-line no-useless-catch
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