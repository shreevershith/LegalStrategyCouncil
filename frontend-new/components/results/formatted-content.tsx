"use client"

import React from "react"

/**
 * FormattedContent - Formats and displays text content nicely
 * Converts plain text with line breaks into formatted paragraphs
 */
interface FormattedContentProps {
  content: string | any
  className?: string
}

export function FormattedContent({ content, className = "" }: FormattedContentProps) {
  if (!content) return null

  // Convert content to string if it's not already
  const contentStr = typeof content === "string" ? content : JSON.stringify(content, null, 2)

  // Split content into paragraphs (double line breaks)
  const paragraphs = contentStr.split(/\n\n+/).filter(p => p.trim())
  
  // Format each paragraph
  const formattedParagraphs = paragraphs.map((para, idx) => {
    const lines = para.split('\n').filter(l => l.trim())
    
    // Check if it's a list (starts with - or number)
    const isList = lines.some(l => /^[-*•]\s+/.test(l.trim()) || /^\d+\.\s+/.test(l.trim()))
    
    if (isList) {
      const items = lines
        .filter(l => /^[-*•]\s+/.test(l.trim()) || /^\d+\.\s+/.test(l.trim()))
        .map(l => l.trim().replace(/^[-*•]\d+\.\s+/, ''))
      
      const isNumbered = lines.some(l => /^\d+\.\s+/.test(l.trim()))
      
      const ListTag = isNumbered ? 'ol' : 'ul'
      
      return (
        <ListTag key={idx} className={`list-${isNumbered ? 'decimal' : 'disc'} list-inside space-y-1 my-2 ml-4`}>
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="text-sm text-foreground leading-relaxed">
              {formatInlineText(item)}
            </li>
          ))}
        </ListTag>
      )
    }
    
    // Regular paragraph
    const text = lines.join(' ')
    return (
      <p key={idx} className="text-sm text-foreground leading-relaxed my-2">
        {formatInlineText(text)}
      </p>
    )
  })
  
  return (
    <div className={`space-y-2 ${className}`}>
      {formattedParagraphs.length > 0 ? formattedParagraphs : (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {contentStr}
        </p>
      )}
    </div>
  )
}

// Format inline text (bold, italic, code)
function formatInlineText(text: string): React.ReactNode {
  if (!text) return null

  // Track position and key for React elements
  let key = 0
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  // Pattern: **bold** - must be matched before single * to avoid conflicts
  const boldRegex = /\*\*(.+?)\*\*/g
  // Pattern: `code`
  const codeRegex = /`(.+?)`/g
  // Pattern: *italic* - must not be part of **bold**
  const italicRegex = /(?<!\*)\*([^*]+?)\*(?!\*)/g

  // Collect all matches with their positions
  interface Match {
    start: number
    end: number
    type: 'bold' | 'italic' | 'code'
    content: string
  }

  const matches: Match[] = []

  // Find all bold matches
  let match
  while ((match = boldRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'bold',
      content: match[1],
    })
  }

  // Find all code matches
  codeRegex.lastIndex = 0
  while ((match = codeRegex.exec(text)) !== null) {
    // Check if this code match overlaps with a bold match
    const overlaps = matches.some(
      (m) => m.start < match!.index + match![0].length && m.end > match!.index
    )
    if (!overlaps) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'code',
        content: match[1],
      })
    }
  }

  // Find all italic matches
  italicRegex.lastIndex = 0
  while ((match = italicRegex.exec(text)) !== null) {
    // Check if this italic match overlaps with a bold or code match
    const overlaps = matches.some(
      (m) => m.start < match!.index + match![0].length && m.end > match!.index
    )
    if (!overlaps) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'italic',
        content: match[1],
      })
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start)

  // Build React elements
  matches.forEach((m) => {
    // Add text before this match
    if (m.start > lastIndex) {
      parts.push(text.substring(lastIndex, m.start))
    }

    // Add formatted element
    if (m.type === 'bold') {
      parts.push(
        <strong key={key++} className="font-semibold">
          {m.content}
        </strong>
      )
    } else if (m.type === 'italic') {
      parts.push(<em key={key++} className="italic">{m.content}</em>)
    } else if (m.type === 'code') {
      parts.push(
        <code key={key++} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
          {m.content}
        </code>
      )
    }

    lastIndex = m.end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  // If no matches, return text as-is
  if (parts.length === 0) {
    return <>{text}</>
  }

  return <>{parts}</>
}

/**
 * FormattedRationale - Formats rationale JSON object as structured sections
 */
interface FormattedRationaleProps {
  rationale: any
  className?: string
}

export function FormattedRationale({ rationale, className = "" }: FormattedRationaleProps) {
  if (!rationale) return null
  
  // If rationale is a string, just format it
  if (typeof rationale === 'string') {
    return <FormattedContent content={rationale} className={className} />
  }
  
  // If rationale is an object, format it nicely
  const renderObject = (obj: any, depth = 0): React.ReactNode => {
    if (typeof obj === 'string') {
      return <p className="text-sm text-foreground leading-relaxed">{obj}</p>
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return <span className="text-sm text-muted-foreground">{String(obj)}</span>
    }
    
    if (Array.isArray(obj)) {
      return (
        <ul className="list-disc list-inside space-y-1 ml-4">
          {obj.map((item, idx) => (
            <li key={idx} className="text-sm text-foreground">
              {renderObject(item, depth + 1)}
            </li>
          ))}
        </ul>
      )
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(obj).map(([key, value]) => (
            <div key={key} className={depth > 0 ? "ml-4" : ""}>
              <div className="text-sm font-semibold text-foreground capitalize mb-1">
                {key.replace(/_/g, ' ')}:
              </div>
              <div className="text-sm text-muted-foreground">
                {renderObject(value, depth + 1)}
              </div>
            </div>
          ))}
        </div>
      )
    }
    
    return null
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      {renderObject(rationale)}
    </div>
  )
}
