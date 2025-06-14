import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiLogout } from 'react-icons/hi';

function LogoutBtn({ showLabel = true, className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.post("/api/users/logout");
      if (res.status === 200) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={logoutHandler}
      className={`
        flex items-center space-x-2 
        text-white px-4 py-2 rounded-lg 
        bg-red-600 hover:bg-red-700 transition-all
        ${className}
      `}
    >
      <HiLogout size={22} />
      {showLabel && <span className="text-[16px]">Logout</span>}
    </button>
  );
}

export default LogoutBtn;
