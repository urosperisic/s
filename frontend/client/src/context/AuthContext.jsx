// frontend/client/src/context/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/user/', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    const response = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    setUser(data.user)
    return data
  }

  const register = async (username, email, password) => {
    const response = await fetch('/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Registration failed')
    }

    return await response.json()
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}