// src/components/AuthLoader.jsx
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";

const AuthLoader = ({ children }) => {
    const dispatch = useDispatch();

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

                        await axios.post("/api/users/refresh-token", {}, { withCredentials: true })
                        const retryRes = await axios.get("/api/users/current-user", { withCredentials: true })
                        const userData = retryRes.data.data

                        if (userData) {
                            dispatch(login(userData));
                            console.log("token is  expresed ")
                        } else {
                            dispatch(logout());
                        }

                    } catch (error) {
                        dispatch(logout());

                    }
                }
                else {
                    dispatch(logout());

                }
            }
        };

        fetchCurrentUser();
    }, [dispatch]);

    return children;
};

export default AuthLoader;
