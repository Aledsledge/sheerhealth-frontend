import React from 'react' // eslint-disable-line no-unused-vars
import { Navigate } from 'react-router-dom'
import { useAuthValue } from '../pages/AuthContext'
import Spinner from './Spinner'

// Route guard for the admin-only editor pages. Access is decided from live
// Firebase Auth state + the users/{uid}.admin Firestore flag (provided via
// AuthContext by the useAdmin hook in Routers) - never from localStorage,
// which was forgeable. While auth/role resolution is in flight we render a
// spinner rather than redirect, so an authenticated admin refreshing
// directly on /create isn't bounced to login before Firebase reports back.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isAdminLoading } = useAuthValue() || {}

  if (isAdminLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default ProtectedRoute
