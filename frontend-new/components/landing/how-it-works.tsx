import { Upload, Bot, FileText } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Case",
    description: "Input case facts, parties, jurisdiction, and stakes.",
  },
  {
    icon: Bot,
    title: "Agents Analyze",
    description: "Multiple specialized AI agents debate in parallel.",
  },
  {
    icon: FileText,
    title: "Strategy Synthesized",
    description: "Moderator resolves conflicts into a unified strategy.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to comprehensive legal strategy analysis
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div
                className="absolute left-[calc(50%+2.5rem)] top-8 hidden h-px w-[calc(100%-5rem)] bg-border sm:block"
                style={{ display: index === 2 ? "none" : undefined }}
              />
              <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
