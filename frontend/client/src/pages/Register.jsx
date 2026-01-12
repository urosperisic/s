// frontend/client/src/pages/Register.jsx

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Form.css'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(username, email, password)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-wrapper">
      <main>
        <div className="form-container">
          <h1 className="form-title">Register</h1>

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
              <label htmlFor="email" className="visually-hidden">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
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
                autoComplete="new-password"
                className="form-input"
                aria-required="true"
                minLength="8"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="form-button"
              aria-busy={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="form-footer">
            Already have an account?{' '}
            <Link to="/login" className="form-link">
              Login here
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Register