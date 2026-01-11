import { FormattedContent } from "./formatted-content"

interface Argument {
  argument_id: string
  agent: string
  type: string
  content: string | { content: string }
  reasoning: string
  created_at: string
}

interface ArgumentsPanelProps {
  arguments: Argument[]
}

export function ArgumentsPanel({ arguments: args = [] }: ArgumentsPanelProps) {
  if (!args || args.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 h-full">
        <h3 className="text-lg font-bold text-foreground mb-4">Arguments</h3>
        <p className="text-sm text-muted-foreground">No arguments available yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 h-full">
      <h3 className="text-lg font-bold text-foreground mb-4">Arguments</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Key affirmative points to advance your case against the opposition.
      </p>
      <div className="space-y-6">
        {args.map((arg) => {
          const content = typeof arg.content === "string" 
            ? arg.content 
            : (typeof arg.content === "object" && arg.content !== null)
              ? arg.content.content || ""
              : ""
          
          return (
            <div key={arg.argument_id} className="border-l-2 border-primary/30 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-foreground text-sm">{arg.agent}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {arg.type}
                </span>
              </div>
              <div className="mt-2">
                <FormattedContent content={content} />
              </div>
              {arg.reasoning && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Reasoning</p>
                  <p className="text-xs text-muted-foreground italic">{arg.reasoning}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
