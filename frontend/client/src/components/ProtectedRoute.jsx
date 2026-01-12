// frontend/client/src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="content-wrapper">
        <main>
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute