// frontend/client/src/pages/NewSnippet.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionForm from '../components/SectionForm'

function NewSnippet() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [visibility, setVisibility] = useState('public')
  const [usesSections, setUsesSections] = useState(false)
  const [sections, setSections] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'other', label: 'Other' },
  ]

  const handleToggleSections = () => {
    setUsesSections(!usesSections)
    if (!usesSections && sections.length === 0) {
      addSection()
    }
  }

  const addSection = () => {
    setSections([
      ...sections,
      {
        order: sections.length,
        title: '',
        description: '',
        code: '',
        language: 'python',
      },
    ])
  }

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index)
    const reorderedSections = newSections.map((section, i) => ({
      ...section,
      order: i,
    }))
    setSections(reorderedSections)
  }

  const updateSection = (index, field, value) => {
    const newSections = [...sections]
    newSections[index] = {
      ...newSections[index],
      [field]: value,
    }
    setSections(newSections)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const snippetData = {
      title,
      description,
      visibility,
    }

    if (usesSections) {
      snippetData.language = language
      snippetData.code = ''
      snippetData.sections = sections
    } else {
      snippetData.code = code
      snippetData.language = language
    }

    try {
      const response = await fetch('/api/snippets/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(snippetData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to create snippet')
      }

      navigate('/my-snippets')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Create New Snippet</h1>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="visually-hidden">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="description" className="visually-hidden">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />

        <label htmlFor="visibility" className="visually-hidden">
          Visibility
        </label>
        <select
          id="visibility"
          name="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <div>
          <label htmlFor="sections-toggle">Use multiple sections</label>
          <input
            type="checkbox"
            id="sections-toggle"
            checked={usesSections}
            onChange={handleToggleSections}
          />
        </div>

        {usesSections ? (
          <div>
            <p className="bold">Sections</p>
            <button type="button" onClick={addSection}>+ Add Section</button>

            {sections.map((section, index) => (
              <SectionForm
                key={index}
                section={section}
                index={index}
                onChange={updateSection}
                onRemove={removeSection}
                languages={languages}
              />
            ))}

            {sections.length === 0 && (
              <p>No sections yet. Click "Add Section" to get started.</p>
            )}
          </div>
        ) : (
          <>
            <label htmlFor="language" className="visually-hidden">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>

            <label htmlFor="code" className="visually-hidden">
              Code
            </label>
            <textarea
              id="code"
              name="code"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              rows="15"
              spellCheck="false"
            />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Snippet'}
        </button>
      </form>
    </main>
  )
}

export default NewSnippet