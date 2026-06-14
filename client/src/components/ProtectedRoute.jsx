import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import { PageLoader } from '../App'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <PageLoader />

  return isAuthenticated ? children : <Navigate to="/login" replace />
}




