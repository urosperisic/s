// frontend/client/src/pages/Users.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

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
    return <main><p>Loading users...</p></main>
  }

  if (error) {
    return (
      <main>
        <div className="error" role="alert">
          {error}
        </div>
      </main>
    )
  }

  return (
    <main>
      <h1>User Management</h1>
      <p>Total users: {users.length}</p>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th className="hide-mobile">Role</th>
            <th className="hide-mobile">Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td className="hide-mobile">{u.role}</td>
              <td className="hide-mobile">{formatDate(u.date_joined)}</td>
              <td>
                {u.id !== user?.id ? (
                  <button onClick={() => handleDelete(u.id, u.username)}>
                    Delete
                  </button>
                ) : (
                  <span>current</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default Users