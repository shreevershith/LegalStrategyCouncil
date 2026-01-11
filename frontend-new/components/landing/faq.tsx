import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="mt-12">
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
