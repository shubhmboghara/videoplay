import React from 'react'
import { Navigate  } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const authStatus = useSelector((state) => state.auth.status)

  return authStatus ? children : <Navigate to="/login" />
}
