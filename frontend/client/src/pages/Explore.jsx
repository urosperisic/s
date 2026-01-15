// frontend/client/src/pages/Explore.jsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Explore() {
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      const response = await fetch('/api/snippets/public/', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch snippets')
      }

      const data = await response.json()
      setSnippets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
    return <main><p>Loading snippets...</p></main>
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
      <h1>Explore Snippets</h1>
      <p className="description">Discover code snippets shared by the community</p>

      {snippets.length === 0 ? (
        <p>No public snippets available yet.</p>
      ) : (
        <div>
          {snippets.map((snippet) => (
            <div key={snippet.id}>
              <p className="bold">{snippet.title}</p>
              <p>{snippet.language}</p>

              {snippet.description && (
                <p className="description">{snippet.description}</p>
              )}

              <p>{snippet.author_username} • {formatDate(snippet.created_at)}</p>

              <Link to={`/snippet/${snippet.id}`} className="btn">View Snippet</Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Explore