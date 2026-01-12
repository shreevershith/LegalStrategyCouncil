/**
 * Conflict View Component
 * 
 * Displays conflicts detected between agents during the analysis process.
 * 
 * Features:
 * - List of all detected conflicts
 * - Conflict status (resolved/unresolved)
 * - Agents involved in each conflict
 * - Conflict descriptions
 * - Summary card showing total conflict count
 * 
 * Props:
 * - conflicts: Array of conflict objects, each containing:
 *   - conflict_id: Unique identifier
 *   - issue: Brief description of the conflict
 *   - description: Detailed explanation
 *   - agents_involved: Array of agent names involved
 *   - status: 'resolved' | 'unresolved'
 */
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { AlertTriangle } from 'lucide-react'

function ConflictView({ conflicts }) {
  if (!conflicts || conflicts.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-warning/10 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-warning" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Detected Conflicts</h2>
          <p className="text-sm text-muted-foreground">Disagreements identified between agents</p>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="space-y-4">
        {conflicts.map((conflict, index) => (
          <Card key={conflict.conflict_id || index} className="border-warning/20 bg-warning/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Conflict #{index + 1}</Badge>
                  <Badge variant={conflict.status === 'resolved' ? 'success' : 'destructive'}>
                    {conflict.status === 'resolved' ? 'Resolved' : 'Unresolved'}
                  </Badge>
                </div>
              </div>
              <CardTitle className="mt-2">{conflict.issue}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Agents Involved:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(conflict.agents_involved || []).map((agent, agentIdx) => (
                    <Badge key={agentIdx} variant="outline">
                      {agent}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg p-3 border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">
                  Description:
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {conflict.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-warning/5 border-warning/20">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground">
            <strong>{conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''}</strong> detected.
            Jessica will consider these disagreements when synthesizing the final strategy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConflictView
