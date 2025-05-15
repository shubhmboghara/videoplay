import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'


function LogoutBtn({
  className=""
}) {
const   dispatch = useDispatch()
  const logoutHandler = () => {
    // authService.logout().then(() => {
      dispatch(logout())
    // })

  }

  return (

    <button type="logout" className={` text-white rounded-lg px-2 py-2 relative bottom-4 w-18 h-10 ${className}`}
     onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn