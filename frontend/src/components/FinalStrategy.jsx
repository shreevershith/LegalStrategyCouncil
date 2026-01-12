/**
 * Final Strategy Component
 * 
 * Displays Jessica's synthesized final strategy after all agents have completed their work.
 * 
 * Features:
 * - Formatted strategy content with markdown-like parsing
 * - Expandable rejected alternatives section
 * - Copy to clipboard functionality
 * - Strategy metadata (version, strategy ID)
 * - Professional card-based layout
 * 
 * Props:
 * - strategy: Strategy object containing:
 *   - final_strategy: The main strategy text
 *   - rejected_alternatives: Array of alternatives that were considered but rejected
 *   - rationale: Explanation of how the strategy was developed
 *   - strategy_id: Unique identifier for this strategy
 *   - version: Version number of the strategy
 */
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { CheckCircle2, FileText, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../lib/utils'

function FinalStrategy({ strategy }) {
  const [showRejected, setShowRejected] = useState(false)

  if (!strategy) {
    return null
  }

  // Format content with basic markdown-like parsing
  const formatContent = (text) => {
    if (!text) return null

    if (typeof text === 'object') {
      text = text.content || JSON.stringify(text)
    }

    if (typeof text !== 'string') {
      text = String(text)
    }

    const paragraphs = text.split(/\n\n+/)

    return paragraphs.map((para, idx) => {
      // Check for headers with **
      if (para.match(/^\*\*\d*\.?\s*.+?\*\*/)) {
        const lines = para.split('\n')
        return (
          <div key={idx} className="mb-4">
            {lines.map((line, lineIdx) => {
              const headerMatch = line.match(/^\*\*(.+?)\*\*(.*)/)
              if (headerMatch) {
                return (
                  <div key={lineIdx}>
                    <h4 className="font-semibold text-foreground text-lg mb-2">{headerMatch[1]}</h4>
                    {headerMatch[2] && <p className="text-muted-foreground text-sm">{headerMatch[2].trim()}</p>}
                  </div>
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
          <ul key={idx} className="list-disc list-inside mb-4 space-y-2 text-sm text-muted-foreground">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                {item.replace(/^-\s*/, '').replace(/\*\*(.+?)\*\*/g, '$1')}
              </li>
            ))}
          </ul>
        )
      }

      // Handle numbered lists
      if (para.match(/^\d+\./)) {
        const items = para.split('\n').filter(item => item.trim())
        return (
          <ol key={idx} className="list-decimal list-inside mb-4 space-y-2 text-sm text-muted-foreground">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                {item.replace(/^\d+\.\s*/, '').replace(/\*\*(.+?)\*\*/g, '$1')}
              </li>
            ))}
          </ol>
        )
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {para.replace(/\*\*(.+?)\*\*/g, '$1')}
        </p>
      )
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-success/10 rounded-lg">
          <CheckCircle2 className="w-6 h-6 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Final Strategy</h2>
          <p className="text-sm text-muted-foreground">Synthesized by Jessica after reviewing all inputs</p>
        </div>
      </div>

      {/* Main Strategy Card */}
      <Card className="border-success/20 bg-success/5">
        <CardHeader className="bg-success/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <CardTitle>Strategy v{strategy.version || 1}</CardTitle>
            </div>
            <Badge variant="success">Final Recommendation</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none">
            {formatContent(strategy.final_strategy)}
          </div>

          {/* Rationale Section */}
          {strategy.rationale && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                Synthesis Rationale
              </h4>
              <div className="text-sm text-muted-foreground">
                {typeof strategy.rationale === 'string' ? (
                  <p>{strategy.rationale}</p>
                ) : (
                  <ul className="space-y-1">
                    <li><strong>Method:</strong> {strategy.rationale.method}</li>
                    <li><strong>Deliberation Rounds:</strong> {strategy.rationale.deliberation_rounds}</li>
                    {strategy.rationale.inputs_considered && (
                      <li>
                        <strong>Inputs:</strong> {strategy.rationale.inputs_considered.arguments} arguments, {strategy.rationale.inputs_considered.counterarguments} counterarguments, {strategy.rationale.inputs_considered.conflicts_resolved} conflicts resolved
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejected Alternatives Section */}
      {strategy.rejected_alternatives && strategy.rejected_alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <button
              onClick={() => setShowRejected(!showRejected)}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              {showRejected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <CardTitle>
                Rejected Alternatives ({strategy.rejected_alternatives.length})
              </CardTitle>
            </button>
          </CardHeader>
          {showRejected && (
            <CardContent>
              <ul className="space-y-3">
                {strategy.rejected_alternatives.map((alt, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-destructive/10 text-destructive rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-muted-foreground">{alt}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="outline" onClick={() => window.print()}>
          <FileText className="h-4 w-4 mr-2" />
          Print Strategy
        </Button>
        <Button variant="outline" onClick={() => {
          let text = strategy.final_strategy
          if (typeof text === 'object') text = text.content || JSON.stringify(text)
          navigator.clipboard.writeText(text || '')
          alert('Strategy copied to clipboard!')
        }}>
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </Button>
      </div>
    </div>
  )
}

export default FinalStrategy
