"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ConflictsPanel } from "@/components/results/conflicts-panel"
import { SynthesisPanel } from "@/components/results/synthesis-panel"
import { FinalStrategyPanel } from "@/components/results/final-strategy-panel"
import { RejectedAlternativesPanel } from "@/components/results/rejected-alternatives-panel"
import { ArgumentsPanel } from "@/components/results/arguments-panel"
import { CounterargumentsPanel } from "@/components/results/counterarguments-panel"
import { Download, FileJson, Plus, Check, Clock, Loader2 } from "lucide-react"
import { getCaseDetails, type CaseDetails } from "@/lib/api"

function ResultsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const caseId = searchParams.get("caseId") || sessionStorage.getItem("caseId")
  
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!caseId) {
      setError("No case ID provided")
      setLoading(false)
      return
    }

    getCaseDetails(caseId)
      .then((details) => {
        setCaseDetails(details)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch case details:", err)
        setError(err.message || "Failed to load case details")
        setLoading(false)
      })
  }, [caseId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !caseDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Failed to load results"}</p>
          <Button onClick={() => router.push("/case-input")}>Start New Case</Button>
        </div>
      </div>
    )
  }

  const case_ = caseDetails.case
  const strategy = caseDetails.strategy

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">{case_.title || "Case Analysis"}</h1>
            {strategy && (
              <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <Check className="h-3 w-3" />
                Synthesis Complete
              </span>
            )}
          </div>
          {strategy?.created_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Completed {new Date(strategy.created_at).toLocaleString()}</span>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
            <p className="mt-1 text-muted-foreground">Review the final strategy and detailed analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const dataStr = JSON.stringify(caseDetails, null, 2)
                const dataBlob = new Blob([dataStr], { type: "application/json" })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement("a")
                link.href = url
                link.download = `case-${caseId}-results.json`
                link.click()
              }}
            >
              <FileJson className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/case-input">
                <Plus className="mr-2 h-4 w-4" />
                Analyze New Case
              </Link>
            </Button>
          </div>
        </div>

        {/* Recommended Strategy */}
        {strategy && (
          <div className="mb-8">
            <FinalStrategyPanel strategy={strategy} />
          </div>
        )}

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <ArgumentsPanel arguments={caseDetails.arguments} />
          <CounterargumentsPanel counterarguments={caseDetails.counterarguments} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ConflictsPanel conflicts={caseDetails.conflicts} />
          {strategy && <SynthesisPanel strategy={strategy} />}
        </div>

        {strategy && strategy.rejected_alternatives && strategy.rejected_alternatives.length > 0 && (
          <div className="mt-8">
            <RejectedAlternativesPanel rejectedAlternatives={strategy.rejected_alternatives} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  )
}
