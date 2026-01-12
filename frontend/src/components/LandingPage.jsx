import React from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Check, Upload, Bot, FileText, ArrowRight, Menu, X } from 'lucide-react'
import Footer from './Footer'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a href="/" className="text-lg font-semibold text-foreground">
            Multi-Agent Legal Strategy Council
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it Works
            </a>
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Button asChild>
            <a href="#case-input">Analyze Case</a>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="flex flex-col gap-4 p-4">
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a href="#features" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#faq" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
            <Button asChild className="w-full">
              <a href="#case-input">Analyze Case</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              AI-Powered Legal Strategy Exploration
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Explore competing legal strategies, stress-test arguments, and synthesize a unified case strategy using
              multi-agent AI and MongoDB.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <a href="#case-input">
                  Analyze Case
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Central case folder */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <Card className="border-2 border-primary/30 p-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Your Case</p>
                      <p className="text-xs text-muted-foreground">Ready for analysis</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Agent nodes around the center */}
              {/* Harvey - Top Left */}
              <div className="absolute -left-4 top-4">
                <div className="rounded-full border-2 border-blue-500/30 bg-card p-4 shadow-md">
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-blue-500/10 p-2">
                      <Bot className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Harvey</span>
                    <span className="text-[10px] text-muted-foreground">Strategist</span>
                  </div>
                </div>
                <div className="absolute -right-8 top-1/2 h-0.5 w-8 bg-gradient-to-r from-blue-500/50 to-primary/30" />
              </div>

              {/* Louis - Top Right */}
              <div className="absolute -right-4 top-4">
                <div className="rounded-full border-2 border-amber-500/30 bg-card p-4 shadow-md">
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-amber-500/10 p-2">
                      <FileText className="h-6 w-6 text-amber-500" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Louis</span>
                    <span className="text-[10px] text-muted-foreground">Precedent</span>
                  </div>
                </div>
                <div className="absolute -left-8 top-1/2 h-0.5 w-8 bg-gradient-to-l from-amber-500/50 to-primary/30" />
              </div>

              {/* Tanner - Bottom Left */}
              <div className="absolute -left-4 bottom-4">
                <div className="rounded-full border-2 border-red-500/30 bg-card p-4 shadow-md">
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-red-500/10 p-2">
                      <Bot className="h-6 w-6 text-red-500" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Tanner</span>
                    <span className="text-[10px] text-muted-foreground">Adversarial</span>
                  </div>
                </div>
                <div className="absolute -right-8 top-1/2 h-0.5 w-8 bg-gradient-to-r from-red-500/50 to-primary/30" />
              </div>

              {/* Jessica - Bottom Right */}
              <div className="absolute -right-4 bottom-4">
                <div className="rounded-full border-2 border-primary/50 bg-card p-4 shadow-md ring-2 ring-primary/20">
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Jessica</span>
                    <span className="text-[10px] text-muted-foreground">Director</span>
                  </div>
                </div>
                <div className="absolute -left-8 top-1/2 h-0.5 w-8 bg-gradient-to-l from-primary/50 to-primary/30" />
              </div>

              {/* Placeholder for spacing */}
              <div className="h-72 w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    "Real-time agent execution dashboard",
    "MongoDB-backed case memory",
    "Conflict detection between agent viewpoints",
    "Moderator-driven strategy synthesis",
    "Exportable JSON and PDF reports",
  ]

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
            <Card className="overflow-hidden shadow-lg">
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
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
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

function FAQ() {
  const faqs = [
    {
      question: "Is this legal advice?",
      answer:
        "No. This tool is for analytical and educational purposes only. The output should not be considered legal advice. Always consult with a licensed attorney for legal matters.",
    },
    {
      question: "How does it use AI?",
      answer:
        "We use multiple specialized AI agents that analyze your case from different perspectives—trial strategy, precedent research, adversarial analysis, risk assessment, and settlement evaluation. A moderator agent then synthesizes these viewpoints into a unified strategy.",
    },
    {
      question: "What data is stored in MongoDB?",
      answer:
        "All case analysis data, agent outputs, conflicts detected, and final synthesis are stored in MongoDB. This enables case memory, version tracking, and the ability to revisit and compare analyses over time.",
    },
    {
      question: "Can I export my analysis?",
      answer:
        "Yes! You can export your complete analysis as JSON for integration with other tools, or as a formatted PDF report for sharing with colleagues.",
    },
    {
      question: "How long does an analysis take?",
      answer:
        "Most analyses complete within 2-3 minutes, depending on case complexity and the number of agents selected. You can watch the analysis progress in real-time on the dashboard.",
    },
  ]

  return (
    <section id="faq" className="border-t border-border bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently asked questions</h2>
        </div>
        <Accordion type="single" className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

