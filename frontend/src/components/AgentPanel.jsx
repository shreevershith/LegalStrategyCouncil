/**
 * Agent Panel Component
 * 
 * Displays an individual agent's status and content in a card format.
 * 
 * Features:
 * - Color-coded cards for each agent (Harvey=Blue, Louis=Amber, Tanner=Red, Jessica=Primary)
 * - Status badges (Waiting, Analyzing, Complete)
 * - Expandable/collapsible content
 * - Markdown-like content formatting (headers, lists, paragraphs)
 * - Loading states during analysis
 * 
 * Props:
 * - agentName: Name of the agent ('Harvey', 'Louis', 'Tanner', 'Jessica')
 * - status: Current status ('waiting' | 'thinking' | 'done')
 * - content: The agent's analysis output (string or object)
 * - role: Display name for the agent's role
 */
import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Loader2, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * Agent color configurations for visual distinction.
 * Each agent has unique colors for background, border, text, and header.
 */
const AGENT_COLORS = {
  'Harvey': {
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
    headerBg: 'bg-blue-500/10',
    iconBg: 'bg-blue-500/10'
  },
  'Louis': {
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
    headerBg: 'bg-amber-500/10',
    iconBg: 'bg-amber-500/10'
  },
  'Tanner': {
    bg: 'bg-red-500/5',
    border: 'border-red-500/30',
    text: 'text-red-500',
    headerBg: 'bg-red-500/10',
    iconBg: 'bg-red-500/10'
  },
  'Jessica': {
    bg: 'bg-primary/5',
    border: 'border-primary/30',
    text: 'text-primary',
    headerBg: 'bg-primary/10',
    iconBg: 'bg-primary/10'
  }
}

// Agent descriptions
const AGENT_DESCRIPTIONS = {
  'Harvey': 'Lead Trial Strategist',
  'Louis': 'Precedent & Case Law Expert',
  'Tanner': 'Adversarial Counsel',
  'Jessica': 'Managing Partner'
}

function AgentPanel({ agentName, status, content, role }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const colors = AGENT_COLORS[agentName] || AGENT_COLORS['Harvey']
  const description = AGENT_DESCRIPTIONS[agentName] || role

  // Format content with basic markdown-like parsing
  const formatContent = (text) => {
    if (!text) return null

    // Handle case where text is an object with content property
    if (typeof text === 'object') {
      text = text.content || JSON.stringify(text)
    }

    // Ensure text is a string
    if (typeof text !== 'string') {
      text = String(text)
    }

    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/)

    return paragraphs.map((para, idx) => {
      // Check for headers (lines starting with **)
      if (para.startsWith('**') && para.includes('**')) {
        const headerMatch = para.match(/^\*\*(.+?)\*\*(.*)/)
        if (headerMatch) {
          return (
            <div key={idx} className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">{headerMatch[1]}</h4>
              {headerMatch[2] && <p className="text-muted-foreground text-sm">{headerMatch[2].trim()}</p>}
            </div>
          )
        }
      }

      // Check for numbered headers
      if (/^\d+\.\s*\*\*/.test(para)) {
        const lines = para.split('\n')
        return (
          <div key={idx} className="mb-4">
            {lines.map((line, lineIdx) => {
              const boldMatch = line.match(/\*\*(.+?)\*\*/)
              if (boldMatch) {
                return (
                  <p key={lineIdx} className="text-muted-foreground text-sm">
                    <strong className="text-foreground">{boldMatch[1]}</strong>
                    {line.replace(/\*\*.+?\*\*/, '').trim()}
                  </p>
                )
              }
              return <p key={lineIdx} className="text-muted-foreground text-sm">{line}</p>
            })}
          </div>
        )
      }

      // Handle bullet points
      if (para.includes('\n-') || para.startsWith('-')) {
        const items = para.split('\n').filter(item => item.trim())
        return (
          <ul key={idx} className="list-disc list-inside mb-4 space-y-1 text-sm text-muted-foreground">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                {item.replace(/^-\s*/, '').replace(/\*\*(.+?)\*\*/g, '$1')}
              </li>
            ))}
          </ul>
        )
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-muted-foreground text-sm mb-3 leading-relaxed">
          {para.replace(/\*\*(.+?)\*\*/g, '$1')}
        </p>
      )
    })
  }

  return (
    <Card className={cn('flex flex-col overflow-hidden', colors.border, colors.bg)}>
      {/* Header */}
      <CardHeader className={cn('flex flex-row items-center justify-between p-4', colors.headerBg)}>
        <div>
          <h3 className="font-semibold text-foreground">{agentName}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'done' && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Complete
            </Badge>
          )}
          {status === 'thinking' && (
            <Badge variant="info" className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Analyzing
            </Badge>
          )}
          {status === 'waiting' && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Pending
            </Badge>
          )}
          {status === 'done' && content && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className={cn('flex-1 p-4 overflow-y-auto max-h-[500px]', !isExpanded && status === 'done' && 'hidden')}>
        {status === 'waiting' && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Waiting to begin analysis...</p>
          </div>
        )}

        {status === 'thinking' && (
          <div className="flex items-center gap-2 py-8">
            <Loader2 className={cn('h-4 w-4 animate-spin', colors.text)} />
            <span className="text-sm text-muted-foreground">Analyzing case...</span>
          </div>
        )}

        {status === 'done' && content && (
          <div className="space-y-4 text-sm">
            {formatContent(content)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AgentPanel
