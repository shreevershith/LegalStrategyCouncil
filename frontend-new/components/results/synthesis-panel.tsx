import { FormattedContent, FormattedRationale } from "./formatted-content"

interface Strategy {
  strategy_id: string
  version: number
  final_strategy: string | { content: string }
  rationale: any
  rejected_alternatives: string[]
  created_at: string
}

interface SynthesisPanelProps {
  strategy: Strategy
}

export function SynthesisPanel({ strategy }: SynthesisPanelProps) {
  const strategyContent =
    typeof strategy.final_strategy === "string" 
      ? strategy.final_strategy 
      : (typeof strategy.final_strategy === "object" && strategy.final_strategy !== null)
        ? strategy.final_strategy.content || ""
        : ""

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Strategy Synthesis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Final synthesized strategy combining all agent perspectives and resolving conflicts.
      </p>
      <div className="mt-4">
        <FormattedContent content={strategyContent} />
      </div>
      {strategy.rationale && (
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <h4 className="font-semibold text-foreground mb-3 text-sm">Synthesis Rationale</h4>
          <FormattedRationale rationale={strategy.rationale} />
        </div>
      )}
    </div>
  )
}
