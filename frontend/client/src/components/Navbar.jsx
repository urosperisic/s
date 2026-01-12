// frontend/client/src/components/Navbar.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onClick={closeMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="brand-logo"
              aria-label="CodeSnippets logo"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="#a30000"
                stroke="#a30000"
                strokeWidth="2"
              />
              <text
                x="50"
                y="50"
                fontFamily="Arial, sans-serif"
                fontSize="60"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
              >
                S
              </text>
            </svg>
          </Link>
        </div>

        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-content ${isMenuOpen ? 'open' : ''}`}>
          {isAuthenticated && (
            <div className="navbar-links">
              <Link to="/my-snippets" className="nav-link" onClick={closeMenu}>
                My Snippets
              </Link>
              <Link to="/new" className="nav-link" onClick={closeMenu}>
                New
              </Link>
              <Link to="/explore" className="nav-link" onClick={closeMenu}>
                Explore
              </Link>
              {user?.role === 'admin' && (
                <Link to="/users" className="nav-link" onClick={closeMenu}>
                  User Management
                </Link>
              )}
            </div>
          )}

          <div className="navbar-user">
            {isAuthenticated ? (
              <>
                <span className="user-info">
                  <span className="username">{user?.username}</span>
                  <span className={`role-badge ${user?.role}`}>
                    {user?.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-logout"
                  aria-label="Log out"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link" onClick={closeMenu}>
                  Login
                </Link>
                <span className="separator">|</span>
                <Link to="/register" className="auth-link" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar