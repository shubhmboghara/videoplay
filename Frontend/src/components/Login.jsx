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
        <div className="min-h-screen flex items-center justify-center bg-[#18181b] p-4">
            <div className="w-full max-w-md bg-[#23232b] rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input
                            label="Email or Username"
                            type="text"
                            {...register('emailorusername', { required: true })}
                            placeholder="Enter Email or Username"
                            className="w-full px-3 py-2 rounded  text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.emailorusername && <p className="text-red-500 text-xs mt-1">Email or Username is required</p>}
                    </div>
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter Password"
                            {...register("password", { required: true })}
                            className="w-full px-3 py-2 rounded  text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">Password is required</p>}
                    </div>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <Button
                        type="submit"
                        className="w-full mt-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    >
                        Login
                    </Button>
                </form>
                <p className="text-center mt-6 text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-400 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
