// frontend/client/src/pages/Users.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../styles/Users.css'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users/', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/auth/users/${userId}/`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to delete user')
      }

      // Remove user from list
      setUsers(users.filter((u) => u.id !== userId))
    } catch (err) {
      alert(err.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="content-wrapper">
        <main>
          <p>Loading users...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content-wrapper">
        <main>
          <div className="error-message" role="alert">
            {error}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="content-wrapper">
      <main>
        <h1 className="page-title">User Management</h1>
        <p className="users-count">Total users: {users.length}</p>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{formatDate(u.date_joined)}</td>
                  <td>
                    {u.id !== user?.id ? (
                      <button
                        onClick={() => handleDelete(u.id, u.username)}
                        className="btn-delete"
                        aria-label={`Delete user ${u.username}`}
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-muted">Current user</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Users