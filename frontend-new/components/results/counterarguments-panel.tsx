import { FormattedContent } from "./formatted-content"

interface Counterargument {
  counterargument_id: string
  agent: string
  target_argument_id: string
  content: string | { content: string }
  attack_vectors: string[]
  created_at: string
}

interface CounterargumentsPanelProps {
  counterarguments: Counterargument[]
}

export function CounterargumentsPanel({ counterarguments: counters = [] }: CounterargumentsPanelProps) {
  if (!counters || counters.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 h-full">
        <h3 className="text-lg font-bold text-foreground mb-4">Counterarguments</h3>
        <p className="text-sm text-muted-foreground">No counterarguments available yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 h-full">
      <h3 className="text-lg font-bold text-foreground mb-4">Counterarguments</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Adversarial analysis identifying weaknesses and potential challenges.
      </p>
      <div className="space-y-6">
        {counters.map((counter) => {
          const content = typeof counter.content === "string" 
            ? counter.content 
            : (typeof counter.content === "object" && counter.content !== null)
              ? counter.content.content || ""
              : ""
          
          return (
            <div key={counter.counterargument_id} className="border-l-2 border-red-500/30 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-foreground text-sm">{counter.agent}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                  Attack
                </span>
              </div>
              <div className="mt-2">
                <FormattedContent content={content} />
              </div>
              {counter.attack_vectors && counter.attack_vectors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">Attack Vectors</p>
                  <div className="flex flex-wrap gap-2">
                    {counter.attack_vectors.map((vector, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20"
                      >
                        {vector}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
