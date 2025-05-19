import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from './index'
import { useDispatch } from 'react-redux'
import { login as loginAction } from '../redux/slices/authSlice'
import { Link } from 'react-router-dom'
import axios from 'axios'



function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async (data) => {


        try {
            if(!data.FullName || !data.Username || !data.Email || !data.password) {
                alert("All fields are required");
                return;
            }
            const res = await axios.post("/api/users/signup", {

                fullname: data.FullName,
                username: data.Username,
                email: data.Email,
                password: data.password
            })
            dispatch(loginAction())
            navigate('/')

        } catch (error) {
            alert(err.response?.data?.message || "Signup failed");

        }

    }

    return (

        <div className="text-white flex justify-center items-center min-h-screen">
            <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

                <form onSubmit={handleSubmit(onSubmit)} >
                    <div>

                        <Input
                            label="Full Name"
                            placeholder="Enter Full Name"
                            {...register("FullName", { required: true })}

                        />
                        {errors.FullName && <p className="text-red-500 text-sm">Name is required</p>}

                    </div>

                    <div>

                        <Input
                            label="Username"
                            placeholder="Username"
                            {...register("Username", { required: true })}

                        />
                        {errors.Username && <p className="text-red-500 text-sm">Name is required</p>}

                    </div>

                    <div>
                        <Input
                            label="Email"
                            placeholder="Enter Email"
                            type="email"
                            {...register("Email", { required: true })}
                        />
                        {errors.Email && <p className="text-red-500 text-sm">Email id required</p>}
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

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-7    "
                    >
                        Sign Up
                    </Button>

                </form>
                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>

    )
}

export default Signup