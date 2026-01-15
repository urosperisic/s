// frontend/client/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return (
      <nav>
        <ul>
          <li>
            <Link to="/login">login</Link>
          </li>
          <li>
            <Link to="/register">register</Link>
          </li>
          <li>
            <Link to="/explore">explore</Link>
          </li>
        </ul>
      </nav>
    )
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/my-snippets">snippets</Link>
        </li>
        <li>
          <Link to="/new">new</Link>
        </li>
        <li>
          <Link to="/explore">explore</Link>
        </li>
        {user?.role === 'admin' && (
          <li>
            <Link to="/users">users</Link>
          </li>
        )}
        <li>
          <button onClick={handleLogout}>logout</button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar