"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import type { CaseData } from "@/components/case-input/case-input-form"
import { streamCaseAnalysis, getCaseDetails } from "@/lib/api"

type AgentStatus = "pending" | "thinking" | "complete"

type AgentState = {
  name: string
  role: string
  status: AgentStatus
  color: string
  content: string | null
  type?: string
  run_id?: string
}

const agentConfig = {
  Harvey: { role: "Lead Trial Strategist", color: "blue" },
  Louis: { role: "Precedent & Case Law Expert", color: "amber" },
  Tanner: { role: "Adversarial Counsel", color: "red" },
  Jessica: { role: "Managing Partner", color: "green" },
}

const thinkingPhrases = [
  ["Analyzing case fundamentals...", "Reviewing contractual obligations...", "Identifying leverage points..."],
  ["Researching similar precedents...", "Cross-referencing case law...", "Evaluating judicial trends..."],
  ["Probing for vulnerabilities...", "Stress-testing assumptions...", "Formulating counter-attacks..."],
  ["Coordinating team...", "Reviewing agent work...", "Synthesizing strategy..."],
]

export default function AnalysisPage() {
  const router = useRouter()
  const [caseData, setCaseData] = useState<CaseData & { caseId?: string } | null>(null)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [agents, setAgents] = useState<AgentState[]>([
    { name: "Jessica", role: agentConfig.Jessica.role, status: "pending", color: agentConfig.Jessica.color, content: null },
    { name: "Harvey", role: agentConfig.Harvey.role, status: "pending", color: agentConfig.Harvey.color, content: null },
    { name: "Louis", role: agentConfig.Louis.role, status: "pending", color: agentConfig.Louis.color, content: null },
    { name: "Tanner", role: agentConfig.Tanner.role, status: "pending", color: agentConfig.Tanner.color, content: null },
  ])
  const [currentActivity, setCurrentActivity] = useState<string>("Initializing analysis...")
  const [thinkingTexts, setThinkingTexts] = useState<string[]>(["", "", "", ""])
  const [currentRound, setCurrentRound] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [conflicts, setConflicts] = useState<any[]>([])
  const [agentMessages, setAgentMessages] = useState<Array<{
    message_id: string
    sender: string
    recipient: string
    message: any
    created_at: string
  }>>([])
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shouldStartStream, setShouldStartStream] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("caseData")
    const storedCaseId = sessionStorage.getItem("caseId")
    
    if (stored) {
      const data = JSON.parse(stored)
      setCaseData(data)
      if (data.caseId) {
        setCaseId(data.caseId)
      } else if (storedCaseId) {
        setCaseId(storedCaseId)
      }
    } else if (storedCaseId) {
      setCaseId(storedCaseId)
      // Try to fetch case details from backend
      getCaseDetails(storedCaseId)
        .then((details) => {
          setCaseData({
            caseTitle: details.case.title,
            caseDescription: details.case.facts,
            jurisdiction: details.case.jurisdiction,
            moneyAtStake: details.case.stakes,
          } as CaseData)
        })
        .catch((err) => {
          console.error("Failed to fetch case details:", err)
        })
    }
  }, [])

  // Check if analysis is already complete before starting stream
  useEffect(() => {
    if (!caseId) return
    
    // Check if analysis is already complete
    getCaseDetails(caseId)
      .then((details) => {
        if (details.strategy) {
          // Analysis already complete, redirect to results immediately
          console.log("Analysis already complete, redirecting to results")
          setIsComplete(true)
          router.push(`/results?caseId=${caseId}`)
        } else {
          // Analysis not complete, allow stream to start
          console.log("Analysis not complete, starting stream")
          setShouldStartStream(true)
        }
      })
      .catch((err) => {
        console.error("Error checking case status:", err)
        // On error, allow stream to start (will handle error there)
        setShouldStartStream(true)
      })
  }, [caseId, router])

  // Fetch agent messages periodically
  useEffect(() => {
    if (!caseId || isComplete) return

    const fetchMessages = async () => {
      try {
        const details = await getCaseDetails(caseId)
        if (details.agent_messages && Array.isArray(details.agent_messages)) {
          setAgentMessages(details.agent_messages)
        }
      } catch (err) {
        // Silently fail
      }
    }

    // Fetch immediately
    fetchMessages()

    // Then fetch every 3 seconds
    const interval = setInterval(fetchMessages, 3000)

    return () => clearInterval(interval)
  }, [caseId, isComplete])

  // Dialogue banner rotation
  useEffect(() => {
    if (isComplete) return
    
    const messages = [
      "Jessica is reviewing the case and coordinating the team...",
      "Harvey is developing the initial strategy...",
      "Louis is researching relevant precedents...",
      "Tanner is analyzing potential weaknesses...",
      "Jessica is coordinating agent responses...",
      "Harvey is strengthening the strategy based on feedback...",
      "Tanner is probing for vulnerabilities...",
      "Jessica is synthesizing the final strategy...",
    ]
    
    const interval = setInterval(() => {
      setDialogueIndex((prev) => (prev + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isComplete])

  // Thinking animation for each agent
  const animateThinking = useCallback((agentIndex: number) => {
    const phrases = thinkingPhrases[agentIndex] || thinkingPhrases[0]
    let phraseIndex = 0
    let charIndex = 0
    let isDeleting = false
    let currentText = ""

    const tick = () => {
      const currentPhrase = phrases[phraseIndex]

      if (!isDeleting) {
        currentText = currentPhrase.substring(0, charIndex + 1)
        charIndex++
        if (charIndex === currentPhrase.length) {
          setTimeout(() => {
            isDeleting = true
          }, 1000)
        }
      } else {
        currentText = currentPhrase.substring(0, charIndex - 1)
        charIndex--
        if (charIndex === 0) {
          isDeleting = false
          phraseIndex = (phraseIndex + 1) % phrases.length
        }
      }

      setThinkingTexts((prev) => {
        const updated = [...prev]
        updated[agentIndex] = currentText
        return updated
      })
    }

    return setInterval(tick, 50)
  }, [])

  // Check if analysis is already complete before starting stream
  useEffect(() => {
    if (!caseId) return
    
    // Check if analysis is already complete
    getCaseDetails(caseId)
      .then((details) => {
        if (details.strategy) {
          // Analysis already complete, redirect to results immediately
          console.log("Analysis already complete, redirecting to results")
          setIsComplete(true)
          router.push(`/results?caseId=${caseId}`)
          // Don't set shouldStartStream - prevent stream from starting
        } else {
          // Analysis not complete, allow stream to start
          console.log("Analysis not complete, starting stream")
          setShouldStartStream(true)
        }
      })
      .catch((err) => {
        console.error("Error checking case status:", err)
        // On error, allow stream to start (will handle error there)
        setShouldStartStream(true)
      })
  }, [caseId, router])

  // Stream analysis from backend
  useEffect(() => {
    if (!caseId || !shouldStartStream || isComplete) return

    let thinkingIntervals: NodeJS.Timeout[] = []

    const cleanup = streamCaseAnalysis(
      caseId,
      (event) => {
        console.log("SSE Event:", event.type, event.data)

        switch (event.type) {
          case "agent_started":
            const agentName = event.data.agent
            const phase = event.data.phase || "working"
            setCurrentActivity(`${agentName} is ${phase.replace(/_/g, " ")}...`)
            setAgents((prev) => {
              const agentIndex = prev.findIndex((ag) => ag.name === agentName)
              if (agentIndex >= 0) {
                // Clear existing thinking intervals for this agent
                thinkingIntervals.forEach(clearInterval)
                const newIntervals: NodeJS.Timeout[] = []
                const interval = animateThinking(agentIndex)
                newIntervals.push(interval)
                thinkingIntervals = newIntervals
                return prev.map((a) => {
                  if (a.name === agentName) {
                    return { ...a, status: "thinking" as AgentStatus }
                  }
                  return a
                })
              }
              return prev
            })
            break

          case "agent_completed":
            const completedAgent = event.data.agent
            const content = event.data.content || ""
            setCurrentActivity(`${completedAgent} completed their analysis`)
            // Clear thinking intervals
            thinkingIntervals.forEach(clearInterval)
            thinkingIntervals = []
            setAgents((prev) =>
              prev.map((a) => {
                if (a.name === completedAgent) {
                  return {
                    ...a,
                    status: "complete" as AgentStatus,
                    content: content,
                    type: event.data.type,
                    run_id: event.data.run_id,
                  }
                }
                return a
              })
            )
            break

          case "deliberation_round_started":
            const round = event.data.round || 0
            const total = event.data.total_rounds || 0
            setCurrentRound(round)
            setTotalRounds(total)
            setCurrentActivity(`Starting deliberation round ${round + 1} of ${total}...`)
            break

          case "deliberation_round_completed":
            setCurrentRound(event.data.round || 0)
            setCurrentActivity(`Completed deliberation round ${(event.data.round || 0) + 1}`)
            break

          case "detecting_conflicts":
            setCurrentActivity("Detecting conflicts between agent arguments...")
            break

          case "conflict_detected":
            const conflictCount = event.data.count || 0
            setConflicts(event.data.conflicts || [])
            setCurrentActivity(`Found ${conflictCount} conflict(s) between agent arguments`)
            break

          case "strategy_ready":
          case "final_report_prepared":
            setCurrentActivity("Final strategy prepared! Analysis complete.")
            setIsComplete(true)
            setShouldStartStream(false) // Stop stream from restarting
            // Clear any thinking animations
            thinkingIntervals.forEach(clearInterval)
            thinkingIntervals = []
            // Redirect immediately
            if (caseId) {
              router.push(`/results?caseId=${caseId}`)
            }
            break

          case "error":
            setError(event.data.message || "An error occurred during analysis")
            thinkingIntervals.forEach(clearInterval)
            thinkingIntervals = []
            break
        }
      },
      (err) => {
        console.error("Stream error:", err)
        setError(err.message)
        thinkingIntervals.forEach(clearInterval)
      },
      () => {
        console.log("Analysis complete")
        setIsComplete(true)
        thinkingIntervals.forEach(clearInterval)
      }
    )

    return () => {
      cleanup()
      thinkingIntervals.forEach(clearInterval)
    }
  }, [caseId, shouldStartStream, isComplete, animateThinking, router])

  const allComplete = agents.every((a) => a.status === "complete")

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; headerBg: string }> = {
      blue: { bg: "bg-blue-500/5", border: "border-blue-500/30", text: "text-blue-500", headerBg: "bg-blue-500/10" },
      amber: {
        bg: "bg-amber-500/5",
        border: "border-amber-500/30",
        text: "text-amber-500",
        headerBg: "bg-amber-500/10",
      },
      red: { bg: "bg-red-500/5", border: "border-red-500/30", text: "text-red-500", headerBg: "bg-red-500/10" },
      green: {
        bg: "bg-green-500/5",
        border: "border-green-500/30",
        text: "text-green-500",
        headerBg: "bg-green-500/10",
      },
    }
    return colors[color] || colors.blue
  }

  const handleViewResults = () => {
    router.push(`/results?caseId=${caseId}`)
  }

  if (!caseData && !caseId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => router.push("/case-input")}>Start Over</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-foreground">Analysis in Progress</h1>
          {caseData?.caseTitle && (
            <span className="ml-4 text-sm text-muted-foreground">{caseData.caseTitle}</span>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dialogue Banner */}
        {!isComplete && (
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">
                {currentActivity || (currentRound > 0 ? `Deliberation Round ${currentRound} of ${totalRounds}` : "Analysis in progress...")}
              </p>
            </div>
          </div>
        )}

        {/* Agent Conversation Panel - Debug */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 text-xs text-muted-foreground">
            Debug: agentMessages.length = {agentMessages.length}, caseId = {caseId || 'null'}
          </div>
        )}

        {/* Agent Conversation Panel */}
        {agentMessages.length > 0 && (
          <div className="mb-8 rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">Agent Conversations</h2>
              <p className="text-sm text-muted-foreground">Inter-agent coordination and communication</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
              {agentMessages.map((msg) => {
                const agentColor = agentConfig[msg.sender as keyof typeof agentConfig]?.color || "blue"
                const colors = getColorClasses(agentColor)
                const messageContent = typeof msg.message === "string" 
                  ? msg.message 
                  : msg.message?.content || msg.message?.message || JSON.stringify(msg.message, null, 2)
                
                return (
                  <div key={msg.message_id} className="flex gap-3">
                    <div className={`flex-shrink-0 w-2 rounded-full ${colors.bg}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${colors.text}`}>{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">→</span>
                        <span className="text-sm text-muted-foreground">{msg.recipient}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="rounded-md bg-muted/50 p-3 text-sm text-foreground">
                        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                          {messageContent.substring(0, 500)}
                          {messageContent.length > 500 ? "..." : ""}
                        </pre>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Agent Cards Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent, idx) => {
            const colors = getColorClasses(agent.color)
            return (
              <div
                key={agent.name}
                className={`flex flex-col rounded-lg border ${colors.border} ${colors.bg} overflow-hidden`}
              >
                {/* Agent Header */}
                <div className={`flex items-center justify-between p-4 ${colors.headerBg}`}>
                  <div>
                    <h3 className="font-semibold text-foreground">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                  {agent.status === "complete" ? (
                    <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                      <Check className="h-3 w-3" />
                      Complete
                    </span>
                  ) : agent.status === "thinking" ? (
                    <span className="flex items-center gap-1 rounded-full bg-info/10 px-2 py-1 text-xs font-medium text-info">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Analyzing
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">Pending</span>
                  )}
                </div>

                {/* Agent Content */}
                <div className="flex-1 p-4 overflow-y-auto max-h-[500px]">
                  {agent.status === "thinking" && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{thinkingTexts[idx]}</span>
                      <span className="inline-block w-0.5 h-4 bg-foreground animate-pulse" />
                    </div>
                  )}

                  {agent.status === "complete" && agent.content && (
                    <div className="space-y-2 text-sm">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-muted-foreground font-sans text-xs leading-relaxed">
                          {agent.content}
                        </pre>
                      </div>
                    </div>
                  )}

                  {agent.status === "pending" && (
                    <p className="text-sm text-muted-foreground">Waiting to begin analysis...</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* View Results Button */}
        {(allComplete || isComplete) && (
          <div className="mt-8 flex justify-end">
            <Button size="lg" onClick={handleViewResults}>
              View Results
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
