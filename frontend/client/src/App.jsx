// frontend/client/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import MySnippets from './pages/MySnippets'
import NewSnippet from './pages/NewSnippet'
import SnippetDetail from './pages/SnippetDetail'
import EditSnippet from './pages/EditSnippet'
import Explore from './pages/Explore'
import Users from './pages/Users'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/my-snippets"
          element={
            <ProtectedRoute>
              <MySnippets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <NewSnippet />
            </ProtectedRoute>
          }
        />
        <Route path="/snippet/:id" element={<SnippetDetail />} />
        <Route
          path="/snippet/:id/edit"
          element={
            <ProtectedRoute>
              <EditSnippet />
            </ProtectedRoute>
          }
        />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App