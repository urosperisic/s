// frontend/client/src/components/SectionForm.jsx

function SectionForm({ section, index, onChange, onRemove, languages }) {
  const handleChange = (field, value) => {
    onChange(index, field, value)
  }

  return (
    <div>
      <p className="bold">Section {index + 1}</p>
      
      <label htmlFor={`section-title-${index}`} className="visually-hidden">
        Section Title
      </label>
      <input
        type="text"
        id={`section-title-${index}`}
        placeholder="Section Title"
        value={section.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />

      <label htmlFor={`section-description-${index}`} className="visually-hidden">
        Description
      </label>
      <textarea
        id={`section-description-${index}`}
        placeholder="Description (optional)"
        value={section.description}
        onChange={(e) => handleChange('description', e.target.value)}
        rows="2"
      />

      <label htmlFor={`section-language-${index}`} className="visually-hidden">
        Language
      </label>
      <select
        id={`section-language-${index}`}
        value={section.language}
        onChange={(e) => handleChange('language', e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      <label htmlFor={`section-code-${index}`} className="visually-hidden">
        Code
      </label>
      <textarea
        id={`section-code-${index}`}
        placeholder="Code"
        value={section.code}
        onChange={(e) => handleChange('code', e.target.value)}
        required
        rows="10"
        spellCheck="false"
      />

      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`Remove section ${index + 1}`}
      >
        Remove
      </button>
    </div>
  )
}

export default SectionForm