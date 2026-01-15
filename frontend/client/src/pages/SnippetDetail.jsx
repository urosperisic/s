// frontend/client/src/pages/SnippetDetail.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CodeBlock from '../components/CodeBlock'

function SnippetDetail() {
  const [snippet, setSnippet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchSnippet()
  }, [id])

  const fetchSnippet = async () => {
    try {
      const response = await fetch(`/api/snippets/${id}/`, {
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to fetch snippet')
      }

      const data = await response.json()
      setSnippet(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return <main><p>Loading snippet...</p></main>
  }

  if (error) {
    return (
      <main>
        <div className="error" role="alert">
          {error}
        </div>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </main>
    )
  }

  const isOwner = user && snippet && user.id === snippet.author_id
  const hasSections = snippet.sections && snippet.sections.length > 0

  return (
    <main>
      <h1>{snippet.title}</h1>
      <p>by {snippet.author_username} • {formatDate(snippet.created_at)} • {!hasSections && snippet.language} {snippet.visibility}</p>

      {snippet.description && (
        <p className="description">{snippet.description}</p>
      )}

      {hasSections ? (
        <div>
          <p>sections ({snippet.sections.length})</p>
          {snippet.sections.map((section, index) => (
            <div key={section.id}>
              <p className="bold">{index + 1}. {section.title} ({section.language})</p>

              {section.description && (
                <p className="description">{section.description}</p>
              )}
              <CodeBlock code={section.code} language={section.language} />
            </div>
          ))}
        </div>
      ) : (
        snippet.code && (
          <div>
            <CodeBlock code={snippet.code} language={snippet.language} />
          </div>
        )
      )}

      <button onClick={() => navigate(-1)}>Back</button>
      {isOwner && (
        <Link to={`/snippet/${snippet.id}/edit`} className="btn">Edit Snippet</Link>
      )}
    </main>
  )
}

export default SnippetDetail