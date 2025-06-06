import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import Loader from "./Loader"; // Import the new Loader component

const AuthLoader = ({ children }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true); 
    

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get("/api/users/current-user", { withCredentials: true });
                const userData = res.data.data;

                if (userData) {
                    dispatch(login(userData));
                } else {
                    dispatch(logout());
                }
            } catch (err) {
                console.error("Error in AuthLoader:", err);

                if (err.response?.status === 401) {
                    try {
                        const refreshRes = await axios.post("/api/users/refresh-token", {}, { withCredentials: true });

                        if (refreshRes.status === 200) {
                            console.log("Token refreshed successfully");

                            const retryRes = await axios.get("/api/users/current-user", { withCredentials: true });
                            const userData = retryRes.data.data;

                            if (userData) {
                                dispatch(login(userData));
                            } else {
                                dispatch(logout());
                            }
                        } else {
                            console.error("Token refresh failed");
                            dispatch(logout());
                        }
                    } catch (refreshError) {
                        console.error("Token refresh error:", refreshError);
                        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        dispatch(logout());
                    }
                } else {
                    dispatch(logout());
                }
            } finally {
                setIsLoading(false); 
            }
        };

        fetchCurrentUser();
    }, [dispatch]);

    if (isLoading) {
        return <Loader message="Authenticating..." />; // Display Loader while authenticating
    }

    return children;
};

export default AuthLoader;