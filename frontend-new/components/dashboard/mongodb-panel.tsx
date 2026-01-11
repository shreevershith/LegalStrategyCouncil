"use client"

import type { Agent } from "@/app/dashboard/page"
import { Input } from "@/components/ui/input"
import { Database, Search, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  documents: { collection: string; count: number }[]
  agents: Agent[]
}

export function MongoDBPanel({ documents, agents }: Props) {
  const [selectedCollection, setSelectedCollection] = useState("arguments")
  const [searchQuery, setSearchQuery] = useState("")

  const mockDocuments = [
    { id: "1", agent: "Lead Trial Strategist", type: "primary", created_at: "14:32:15" },
    { id: "2", agent: "Precedent Expert", type: "precedent", created_at: "14:32:45" },
    { id: "3", agent: "Adversarial Counsel", type: "counter", created_at: "14:33:12" },
  ]

  const filteredDocs = mockDocuments.filter(
    (doc) =>
      doc.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-96 shrink-0 bg-[#1a1c1c] p-4">
      <div className="mb-4 flex items-center gap-2">
        <Database className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-medium text-white">MongoDB Collections</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {documents.map((doc) => (
          <button
            key={doc.collection}
            onClick={() => setSelectedCollection(doc.collection)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              selectedCollection === doc.collection
                ? "bg-primary text-primary-foreground"
                : "bg-white/10 text-white/60 hover:bg-white/20",
            )}
          >
            {doc.collection} ({doc.count})
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <Input
          placeholder="Filter by agent or keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
        />
      </div>

      <div className="space-y-2">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white">{doc.agent}</p>
                <p className="mt-1 text-xs text-white/60">
                  Type: {doc.type} · {doc.created_at}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40" />
            </div>
          </div>
        ))}
        {filteredDocs.length === 0 && <p className="py-8 text-center text-sm text-white/40">No documents found</p>}
      </div>
    </div>
  )
}
