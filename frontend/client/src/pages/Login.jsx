// frontend/client/src/pages/Login.jsx

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Form.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-wrapper">
      <main>
        <div className="form-container">
          <h1 className="form-title">Login</h1>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="visually-hidden">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="form-input"
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="visually-hidden">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="form-input"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="form-button"
              aria-busy={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="form-footer">
            Don't have an account?{' '}
            <Link to="/register" className="form-link">
              Register here
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login