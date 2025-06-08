import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { login as performLogin } from "../../src/service/authentication.js";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);

    const setCustomerFromToken = () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.permission?.at(-1)?.authority || null;

                setCustomer({
                    username: decodedToken.sub,
                    role: role
                });
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("access_token");
            }
        }
    };

    useEffect(() => {
        setCustomerFromToken();
    }, []);

    const login = async (usernameAndPassword) => {
        try {
            console.log("check 1")
            const res = await performLogin(usernameAndPassword);
            const token = res.data?.data?.token;
            const refreshToken = res.data?.data?.refreshToken;

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            if (!token) {
                throw new Error("No token received from server");
            }
            console.log("check 2")

            localStorage.setItem("access_token", token);

            const decodedToken = jwtDecode(token);
            const username = decodedToken.sub;

            // Extract role(s) from permission array
            const role = decodedToken.permission?.at(-1)?.authority || null;



            setCustomer({
                username: username,
                role: role
            });
            console.log(customer)

            return {
                ...res,
                decodedToken: {
                    username,
                    role
                }
            };
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logOut = () => {
        localStorage.removeItem("access_token");
        setCustomer(null);
    };

    const isCustomerAuthenticated = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            return false;
        }
        try {
            const { exp: expiration } = jwtDecode(token);
            if (Date.now() > expiration * 1000) {
                logOut();
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error checking authentication:", error);
            logOut();
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            customer,
            login,
            logOut,
            isCustomerAuthenticated,
            setCustomerFromToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;