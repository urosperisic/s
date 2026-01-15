// frontend/client/src/components/CodeBlock.jsx

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const languageMap = {
    python: 'python',
    javascript: 'javascript',
    html: 'html',
    css: 'css',
    java: 'java',
    cpp: 'cpp',
    csharp: 'csharp',
    php: 'php',
    ruby: 'ruby',
    go: 'go',
    rust: 'rust',
    sql: 'sql',
    bash: 'bash',
    other: 'text',
  }

  const lang = languageMap[language] || 'text'

  const customStyle = {
    margin: 0,
    backgroundColor: '#ffc832',
    padding: '3rem 1.6rem 1.6rem 1.6rem',
    fontSize: '1.4rem',
    lineHeight: '1',
  }

  const customTokenStyles = {
    'comment': { color: '#000' },
    'prolog': { color: '#000' },
    'doctype': { color: '#000' },
    'cdata': { color: '#000' },
    'punctuation': { color: '#000' },
    'property': { color: '#000' },
    'tag': { color: '#000' },
    'boolean': { color: '#000' },
    'number': { color: '#000' },
    'constant': { color: '#000' },
    'symbol': { color: '#000' },
    'selector': { color: '#000' },
    'attr-name': { color: '#000' },
    'string': { color: '#000', fontWeight: '600' },
    'char': { color: '#000', fontWeight: '600' },
    'builtin': { color: '#000' },
    'operator': { color: '#000' },
    'entity': { color: '#000' },
    'url': { color: '#000' },
    'variable': { color: '#000' },
    'function': { color: '#000' },
    'class-name': { color: '#000' },
    'keyword': { color: '#000' },
    'regex': { color: '#000' },
    'important': { color: '#000' },
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '0.8rem',
          right: '0.8rem',
          padding: '0.4rem',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          margin: 0,
        }}
        aria-label="Copy code"
      >
        {copied ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </button>
      <SyntaxHighlighter
        language={lang}
        style={customTokenStyles}
        customStyle={customStyle}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock