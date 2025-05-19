import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function LogoutBtn({ className = "" }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      const res = await axios.post("/api/users/logout")
      if (res.status === 200) {
        dispatch(logout())
        navigate("/login") 
      }
    } catch (error) {
      console.error("Logout failed:", error)
      alert("Failed to logout. Please try again.")
    }
  }

  return (
    <button
      type="button"
      className={`text-white rounded-lg px-2 py-2 relative bottom-4 w-18 h-10 ${className}`}
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}

export default LogoutBtn
