'use client'

import { useState } from 'react'

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
}

export function CodeBlock({ children, language = 'bash', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="relative rounded-lg overflow-hidden my-4"
      style={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: '#09090b', borderBottom: '1px solid #27272a' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f87171' }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#fb923c' }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22d3ee' }} />
          </div>
          {filename && (
            <span className="font-mono text-xs ml-2" style={{ color: '#a1a1aa' }}>
              {filename}
            </span>
          )}
          {!filename && (
            <span className="font-mono text-xs ml-2" style={{ color: '#a1a1aa' }}>
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-xs px-2 py-1 rounded transition-colors duration-150"
          style={{
            color:           copied ? '#22d3ee' : '#a1a1aa',
            backgroundColor: copied ? '#22d3ee15' : 'transparent',
            border:          `1px solid ${copied ? '#22d3ee40' : '#27272a'}`,
          }}
        >
          {copied ? 'copiado ✓' : 'copiar'}
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed m-0">
        <code className="font-mono" style={{ color: '#f4f4f5' }}>
          {children}
        </code>
      </pre>
    </div>
  )
}
