// @ts-nocheck
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const token = sessionStorage.getItem('token')
    const isAuthenticated = token !== null && token !== undefined

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute