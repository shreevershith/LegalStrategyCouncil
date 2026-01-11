interface Conflict {
  conflict_id: string
  issue: string
  agents_involved: string[]
  description: string
  status: string
}

interface ConflictsPanelProps {
  conflicts: Conflict[]
}

export function ConflictsPanel({ conflicts = [] }: ConflictsPanelProps) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Conflicts</h3>
        <p className="text-sm text-muted-foreground">No conflicts detected between agents.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Conflicts</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Disagreements and tensions identified between agents during analysis.
      </p>
      <ul className="space-y-4">
        {conflicts.map((conflict) => (
          <li key={conflict.conflict_id} className="border-l-4 border-warning pl-4">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-foreground text-sm">{conflict.issue}</h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  conflict.status === "resolved"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {conflict.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{conflict.description}</p>
            {conflict.agents_involved && conflict.agents_involved.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Agents involved: {conflict.agents_involved.join(", ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
