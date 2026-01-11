"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AgentStatusPanel } from "@/components/dashboard/agent-status-panel"
import { AgentOutputPanel } from "@/components/dashboard/agent-output-panel"
import { MongoDBPanel } from "@/components/dashboard/mongodb-panel"
import { ArrowLeft, Download, Clock } from "lucide-react"
import type { CaseData } from "@/components/case-input/case-input-form"

export type AgentStatus = "pending" | "running" | "complete"

export type Agent = {
  id: string
  name: string
  status: AgentStatus
  elapsedTime: number
  output: Record<string, unknown> | null
}

const initialAgents: Agent[] = [
  { id: "lead", name: "Lead Trial Strategist", status: "pending", elapsedTime: 0, output: null },
  { id: "precedent", name: "Precedent & Case Law Expert", status: "pending", elapsedTime: 0, output: null },
  { id: "adversarial", name: "Adversarial Counsel", status: "pending", elapsedTime: 0, output: null },
  { id: "risk", name: "Risk & Exposure Analyst", status: "pending", elapsedTime: 0, output: null },
  { id: "settlement", name: "Settlement Specialist", status: "pending", elapsedTime: 0, output: null },
]

const mockOutputs: Record<string, Record<string, unknown>> = {
  lead: {
    primary_strategy: "litigation",
    leverage_points: ["Strong documentary evidence", "Precedent in similar Delaware cases", "Clear breach timeline"],
    trial_vs_settlement: { recommendation: "proceed_trial", confidence: 0.78 },
    key_assumptions: [
      "Witnesses remain available",
      "No statute of limitations issues",
      "Documentary evidence authentic",
    ],
  },
  precedent: {
    relevant_cases: [
      { name: "Smith v. TechCorp (2023)", relevance: 0.92, holding: "Contract terms enforceable as written" },
      { name: "BuildCo v. DataSys (2021)", relevance: 0.85, holding: "Material breach allows termination" },
    ],
    doctrinal_support: ["Objective theory of contracts", "Material breach doctrine", "Expectation damages"],
    jurisdiction_notes: "Delaware courts favor strict contract interpretation",
  },
  adversarial: {
    weaknesses_identified: [
      "Potential ambiguity in Section 4.2",
      "Delayed notice of breach",
      "Damages calculation unclear",
    ],
    counterarguments: ["Plaintiff may have waived rights through conduct", "Mitigation duty not clearly met"],
    attack_vectors: ["Challenge authenticity of key emails", "Expert witness credibility"],
    overall_vulnerability: 0.35,
  },
  risk: {
    worst_case_scenario: { outcome: "Full damages + attorney fees", probability: 0.15, exposure: "$2.4M" },
    best_case_scenario: { outcome: "Summary judgment in favor", probability: 0.25, exposure: "$0" },
    expected_value: "$890,000",
    confidence_interval: ["$450,000", "$1,800,000"],
  },
  settlement: {
    settlement_range: { low: "$400,000", high: "$800,000", optimal: "$600,000" },
    timing_recommendation: "After discovery, before motion practice",
    leverage_points: ["Strong documentary evidence", "Defendant's reputational concerns"],
    batna_analysis: "Trial offers higher expected value but with significant variance",
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [selectedAgentId, setSelectedAgentId] = useState<string>("lead")
  const [overallStatus, setOverallStatus] = useState<"analyzing" | "synthesizing" | "complete">("analyzing")
  const [elapsedTotal, setElapsedTotal] = useState(0)
  const [mongoDocuments, setMongoDocuments] = useState<{ collection: string; count: number }[]>([
    { collection: "arguments", count: 0 },
    { collection: "counterarguments", count: 0 },
    { collection: "risk_flags", count: 0 },
    { collection: "conflicts", count: 0 },
    { collection: "strategy_versions", count: 0 },
  ])

  useEffect(() => {
    const stored = sessionStorage.getItem("caseData")
    if (stored) {
      setCaseData(JSON.parse(stored))
    }
  }, [])

  // Simulate agent execution
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTotal((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const sequence = [
      { agentId: "lead", delay: 500 },
      { agentId: "precedent", delay: 2000 },
      { agentId: "adversarial", delay: 3500 },
      { agentId: "risk", delay: 5000 },
      { agentId: "settlement", delay: 6500 },
    ]

    sequence.forEach(({ agentId, delay }) => {
      // Start running
      setTimeout(() => {
        setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: "running" as AgentStatus } : a)))
      }, delay)

      // Complete with output
      setTimeout(() => {
        const completionTime = (delay + 2000) / 1000
        setAgents((prev) =>
          prev.map((a) =>
            a.id === agentId
              ? { ...a, status: "complete" as AgentStatus, elapsedTime: completionTime, output: mockOutputs[agentId] }
              : a,
          ),
        )
        // Update MongoDB counts
        setMongoDocuments((prev) =>
          prev.map((doc) => {
            if (doc.collection === "arguments" && agentId === "lead") return { ...doc, count: doc.count + 3 }
            if (doc.collection === "counterarguments" && agentId === "adversarial")
              return { ...doc, count: doc.count + 2 }
            if (doc.collection === "risk_flags" && agentId === "risk") return { ...doc, count: doc.count + 1 }
            return doc
          }),
        )
      }, delay + 2000)
    })

    // Synthesizing phase
    setTimeout(() => {
      setOverallStatus("synthesizing")
      setMongoDocuments((prev) => prev.map((doc) => (doc.collection === "conflicts" ? { ...doc, count: 2 } : doc)))
    }, 9000)

    // Complete
    setTimeout(() => {
      setOverallStatus("complete")
      setMongoDocuments((prev) =>
        prev.map((doc) => (doc.collection === "strategy_versions" ? { ...doc, count: 1 } : doc)),
      )
    }, 11000)
  }, [])

  const selectedAgent = agents.find((a) => a.id === selectedAgentId)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleViewResults = () => {
    sessionStorage.setItem("analysisResults", JSON.stringify({ agents, caseData }))
    router.push("/results")
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1f2121] text-white dark">
      <header className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{caseData?.caseTitle || "Case Analysis"}</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              overallStatus === "complete"
                ? "bg-emerald-500/20 text-emerald-400"
                : overallStatus === "synthesizing"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {overallStatus === "complete"
              ? "Complete"
              : overallStatus === "synthesizing"
                ? "Synthesizing..."
                : "Analyzing..."}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Clock className="h-4 w-4" />
            <span>Elapsed {formatTime(elapsedTotal)}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white" asChild>
            <Link href="/case-input">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to cases
            </Link>
          </Button>
          {overallStatus === "complete" ? (
            <Button size="sm" onClick={handleViewResults}>
              View Results
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-white/60" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AgentStatusPanel agents={agents} selectedAgentId={selectedAgentId} onSelectAgent={setSelectedAgentId} />
        <AgentOutputPanel agent={selectedAgent} />
        <MongoDBPanel documents={mongoDocuments} agents={agents} />
      </div>
    </div>
  )
}
