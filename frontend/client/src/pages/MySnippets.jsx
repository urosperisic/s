// frontend/client/src/pages/MySnippets.jsx

import { useAuth } from '../context/AuthContext'

function MySnippets() {
  const { user } = useAuth()

  return (
    <div className="content-wrapper">
      <main>
        <h1>My Snippets</h1>
        <p>Welcome, {user?.username}!</p>
        <p>Your snippets will appear here.</p>
      </main>
    </div>
  )
}

export default MySnippets