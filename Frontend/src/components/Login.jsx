import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from './index'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { login as loginAction } from '../redux/slices/authSlice'
import axios from 'axios'
import { useState } from 'react'

function Login({ showPopup }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState(null)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/api/users/login', data, {
                withCredentials: true
            })

            const userData = response.data.data.user;
            const accessToken = response.data.data.accessToken;
            const refreshToken = response.data.data.refreshToken;

            

            dispatch(loginAction(userData));
            navigate('/');
            setError("");
            showPopup('Login successful!', 'success');

        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            localStorage.removeItem('accessToken');

            const msgFromServer = err?.response?.data?.message;
            console.log("Error message from server:", msgFromServer);

            if (msgFromServer === "User does not exist" || msgFromServer === "Invalid user credentials") {
                setError(msgFromServer);
                showPopup(msgFromServer, 'error');
            } else {
                setError("Something went wrong. Please try again.");
                showPopup("Something went wrong. Please try again.", 'error');
            }
        }

    };


    return (
        <div className=" flex justify-center items-center min-h-screen">
            <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>

                        <Input
                            label="Email or Username"
                            type="text"
                            {...register('emailorusername', { required: true })}
                            placeholder="Enter Email"
                        />
                        {errors.emailorusername && <p className="text-red-500 text-sm">Email id or   is required</p>}
                    </div>

                    <div>

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter Password"
                            {...register("password", { required: true })}
                        />
                        {errors.password && <p className="text-red-500 text-sm">password id required</p>}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
                    >
                        Login
                    </Button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
