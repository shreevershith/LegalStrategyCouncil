import { FileText } from "lucide-react"
import { FormattedContent, FormattedRationale } from "./formatted-content"

interface Strategy {
  strategy_id: string
  version: number
  final_strategy: string | { content: string }
  rationale: any
  rejected_alternatives: string[]
  created_at: string
}

interface FinalStrategyPanelProps {
  strategy: Strategy
}

export function FinalStrategyPanel({ strategy }: FinalStrategyPanelProps) {
  // Extract strategy content - handle both string and object formats
  const strategyContent =
    typeof strategy.final_strategy === "string" 
      ? strategy.final_strategy 
      : (typeof strategy.final_strategy === "object" && strategy.final_strategy !== null)
        ? strategy.final_strategy.content || JSON.stringify(strategy.final_strategy, null, 2)
        : ""

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Recommended Legal Strategy</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Version {strategy.version}</span>
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <FormattedContent content={strategyContent} />
      </div>

      {strategy.rationale && (
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <h4 className="font-semibold text-foreground mb-3 text-sm">Analysis Rationale</h4>
          <FormattedRationale rationale={strategy.rationale} />
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
        Strategy ID: {strategy.strategy_id}
      </div>
    </div>
  )
}
