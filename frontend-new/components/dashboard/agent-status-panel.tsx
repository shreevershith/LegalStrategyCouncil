"use client"

import type { Agent } from "@/app/dashboard/page"
import { Bot, Check, Loader2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  agents: Agent[]
  selectedAgentId: string
  onSelectAgent: (id: string) => void
}

export function AgentStatusPanel({ agents, selectedAgentId, onSelectAgent }: Props) {
  return (
    <div className="w-80 shrink-0 border-r border-white/10 bg-[#1a1c1c] p-4">
      <h2 className="mb-4 text-sm font-medium text-white/60">Agent Status</h2>
      <div className="space-y-2">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.id)}
            className={cn(
              "w-full rounded-lg border p-3 text-left transition-colors",
              selectedAgentId === agent.id
                ? "border-primary/50 bg-primary/10"
                : "border-white/10 bg-white/5 hover:bg-white/10",
            )}
          >
            <div className="flex items-start gap-3">
              <Bot className="mt-0.5 h-4 w-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{agent.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  {agent.status === "complete" && (
                    <>
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Check className="h-3 w-3" />
                        Complete
                      </span>
                      <span className="text-xs text-white/40">({agent.elapsedTime.toFixed(1)}s)</span>
                    </>
                  )}
                  {agent.status === "running" && (
                    <span className="flex items-center gap-1 text-xs text-blue-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Running
                    </span>
                  )}
                  {agent.status === "pending" && (
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
