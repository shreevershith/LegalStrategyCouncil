import { Check } from "lucide-react"

const features = [
  "Real-time agent execution dashboard",
  "MongoDB-backed case memory",
  "Conflict detection between agent viewpoints",
  "Moderator-driven strategy synthesis",
  "Exportable JSON and PDF reports",
]

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful features for legal analysis
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for legal professionals who need comprehensive strategy exploration.
            </p>
            <ul className="mt-8 space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg">
              <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="p-4">
                <div className="rounded-md bg-muted p-4">
                  <pre className="overflow-x-auto text-xs text-muted-foreground">
                    <code>{`{
  "primary_strategy": "litigation",
  "leverage_points": [
    "Strong documentary evidence",
    "Precedent in similar cases"
  ],
  "trial_vs_settlement": {
    "recommendation": "proceed_trial",
    "confidence": 0.78
  },
  "key_assumptions": [
    "Witnesses available",
    "No statute limitations"
  ]
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
