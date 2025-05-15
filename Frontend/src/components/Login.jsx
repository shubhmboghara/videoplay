import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from './index'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { login as loginAction } from '../redux/slices/authSlice'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async (data) => {
        const testUser = {
            username: data.username,
            token: 'fake-token-123'
        }

        dispatch(loginAction(testUser))
        navigate('/')
    }

    return (
        <div className="text-white flex justify-center items-center min-h-screen">
            <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>

                        <Input
                            label="Email"
                            type="email"
                            {...register('email', { required: true })}
                            placeholder="Enter Email"
                        />
                        {errors.username && <p className="text-red-500 text-sm">Email id  is required</p>}
                    </div>

                    <div>

                        <Input
                            label="Password"
                            {...register('password', { required: true })}
                            type="password"
                            placeholder="Enter password"
                        />
                        {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
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
