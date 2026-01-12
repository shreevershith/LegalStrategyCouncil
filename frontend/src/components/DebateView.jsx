/**
 * Debate View Component
 * 
 * Displays all four agents in a grid layout with their current status and content.
 * 
 * Features:
 * - Grid layout (2x2 on large screens, stacked on mobile)
 * - Status legend showing what each status indicator means
 * - Deliberation banner showing current round when Harvey and Tanner are debating
 * - Real-time updates as agents complete their work
 * 
 * Props:
 * - agents: Object mapping agent names to their status and content
 * - deliberationRound: Current deliberation round number (0 if not deliberating)
 * - totalRounds: Total number of deliberation rounds configured
 */
import React from 'react'
import AgentPanel from './AgentPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Loader2, Clock, CheckCircle2 } from 'lucide-react'

function DebateView({ agents, deliberationRound, totalRounds }) {
  /**
   * Agent display order (Suits-inspired).
   * Harvey and Louis (supporting team) appear first,
   * followed by Tanner (adversarial) and Jessica (final synthesis).
   */
  const agentOrder = ['Harvey', 'Louis', 'Tanner', 'Jessica']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Legal Council</h2>
          <p className="text-sm text-muted-foreground mt-1">Your team of AI legal experts</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <span className="text-muted-foreground">Waiting</span>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 text-info animate-spin" />
            <span className="text-muted-foreground">Analyzing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-success" />
            <span className="text-muted-foreground">Complete</span>
          </div>
        </div>
      </div>

      {/* Deliberation Banner */}
      {deliberationRound > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <div>
                <p className="font-medium text-foreground">
                  Deliberation Round {deliberationRound} of {totalRounds}
                </p>
                <p className="text-sm text-muted-foreground">
                  Harvey and Tanner are debating the strategy...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agentOrder.map((agentName) => {
          const agent = agents[agentName] || { status: 'waiting', content: null }
          return (
            <AgentPanel
              key={agentName}
              agentName={agentName}
              status={agent.status}
              content={agent.content}
              role={agent.role}
            />
          )
        })}
      </div>
    </div>
  )
}

export default DebateView
