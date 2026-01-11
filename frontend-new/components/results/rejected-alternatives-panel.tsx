interface RejectedAlternativesPanelProps {
  rejectedAlternatives: string[]
}

export function RejectedAlternativesPanel({ rejectedAlternatives = [] }: RejectedAlternativesPanelProps) {
  if (!rejectedAlternatives || rejectedAlternatives.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Rejected Alternatives</h3>
        <p className="text-sm text-muted-foreground">No rejected alternatives documented.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Rejected Alternatives</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Strategies and approaches that were considered but ultimately rejected.
      </p>
      <ul className="space-y-3">
        {rejectedAlternatives.map((alternative, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
              {idx + 1}
            </span>
            <p className="text-sm text-muted-foreground flex-1">{alternative}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
