"use client"

import type { Agent } from "@/app/dashboard/page"
import { Button } from "@/components/ui/button"
import { Copy, ChevronDown, ChevronRight, Bot, Loader2 } from "lucide-react"
import { useState } from "react"

type Props = {
  agent: Agent | undefined
}

export function AgentOutputPanel({ agent }: Props) {
  const [expanded, setExpanded] = useState(true)

  const copyToClipboard = () => {
    if (agent?.output) {
      navigator.clipboard.writeText(JSON.stringify(agent.output, null, 2))
    }
  }

  if (!agent) return null

  return (
    <div className="flex flex-1 flex-col overflow-hidden border-r border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-medium text-white">{agent.name}</h2>
            <p className="text-xs text-white/60">
              {agent.status === "complete"
                ? "Analysis complete"
                : agent.status === "running"
                  ? "Processing..."
                  : "Waiting to start"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-white/60 hover:text-white"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {expanded ? "Collapse" : "Expand"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            disabled={!agent.output}
            className="text-white/60 hover:text-white"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy JSON
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {agent.status === "pending" && (
          <div className="flex h-full items-center justify-center text-white/40">
            <p>Waiting for agent to start...</p>
          </div>
        )}
        {agent.status === "running" && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-white/60">Agent is analyzing...</p>
            </div>
          </div>
        )}
        {agent.status === "complete" && agent.output && expanded && (
          <div className="rounded-lg bg-[#161818] p-4">
            <pre className="overflow-x-auto text-sm">
              <code className="text-white/80">
                <JsonViewer data={agent.output} />
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function JsonViewer({ data, indent = 0 }: { data: unknown; indent?: number }) {
  const spacing = "  ".repeat(indent)

  if (data === null) return <span className="text-amber-400">null</span>
  if (typeof data === "boolean") return <span className="text-amber-400">{data.toString()}</span>
  if (typeof data === "number") return <span className="text-emerald-400">{data}</span>
  if (typeof data === "string") return <span className="text-sky-400">&quot;{data}&quot;</span>

  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>
    return (
      <>
        {"[\n"}
        {data.map((item, i) => (
          <span key={i}>
            {spacing} <JsonViewer data={item} indent={indent + 1} />
            {i < data.length - 1 ? ",\n" : "\n"}
          </span>
        ))}
        {spacing}]
      </>
    )
  }

  if (typeof data === "object") {
    const entries = Object.entries(data)
    if (entries.length === 0) return <span>{"{}"}</span>
    return (
      <>
        {"{\n"}
        {entries.map(([key, value], i) => (
          <span key={key}>
            {spacing} <span className="text-rose-400">&quot;{key}&quot;</span>:{" "}
            <JsonViewer data={value} indent={indent + 1} />
            {i < entries.length - 1 ? ",\n" : "\n"}
          </span>
        ))}
        {spacing}
        {"}"}
      </>
    )
  }

  return null
}
