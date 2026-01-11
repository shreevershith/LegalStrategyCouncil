"use client"

import type { CaseData } from "../case-input-form"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Bot, Clock } from "lucide-react"

type Props = {
  data: CaseData
  setData: (data: CaseData) => void
}

const agents = [
  {
    id: "leadTrialStrategist" as const,
    name: "Lead Trial Strategist",
    description: "Owns primary litigation vs settlement framing.",
    required: true,
  },
  {
    id: "precedentExpert" as const,
    name: "Precedent & Case Law Expert",
    description: "Finds relevant cases and doctrinal support.",
    required: false,
  },
  {
    id: "adversarialCounsel" as const,
    name: "Adversarial Counsel",
    description: "Attacks your arguments and surfaces weaknesses.",
    required: false,
  },
  {
    id: "riskAnalyst" as const,
    name: "Risk & Exposure Analyst",
    description: "Quantifies downside risk scenarios.",
    required: false,
  },
  {
    id: "settlementSpecialist" as const,
    name: "Settlement Specialist",
    description: "Explores settlement leverage and timing.",
    required: false,
  },
]

export function Step5Agents({ data, setData }: Props) {
  const selectedCount = Object.values(data.agents).filter(Boolean).length

  const handleAgentChange = (agentId: keyof CaseData["agents"], checked: boolean) => {
    setData({
      ...data,
      agents: { ...data.agents, [agentId]: checked },
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Select Agents</Label>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-start space-x-3 rounded-lg border border-border bg-muted/30 p-4">
              <Checkbox
                id={agent.id}
                checked={data.agents[agent.id]}
                onCheckedChange={(checked) => handleAgentChange(agent.id, checked as boolean)}
                disabled={agent.required}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <label
                    htmlFor={agent.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
                  >
                    {agent.name}
                    {agent.required && <span className="ml-2 text-xs text-muted-foreground">(Required)</span>}
                  </label>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <Label htmlFor="advancedReasoning" className="text-sm font-medium">
            Advanced Reasoning
          </Label>
          <p className="text-sm text-muted-foreground">More detail, slower analysis</p>
        </div>
        <Switch
          id="advancedReasoning"
          checked={data.advancedReasoning}
          onCheckedChange={(checked) => setData({ ...data, advancedReasoning: checked })}
        />
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h4 className="font-medium text-foreground">Analysis Summary</h4>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>Case: {data.caseTitle || "Untitled Case"}</p>
          <p>Agents selected: {selectedCount}</p>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Estimated analysis time: 2-3 minutes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
