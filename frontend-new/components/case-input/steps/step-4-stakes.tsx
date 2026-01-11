"use client"

import type { CaseData } from "../case-input-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  data: CaseData
  setData: (data: CaseData) => void
}

export function Step4Stakes({ data, setData }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="financialStakes">Financial Stakes</Label>
        <Select value={data.financialStakes} onValueChange={(value) => setData({ ...data, financialStakes: value })}>
          <SelectTrigger id="financialStakes">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-100k">{"< $100K"}</SelectItem>
            <SelectItem value="100k-1m">$100K - $1M</SelectItem>
            <SelectItem value="1m-10m">$1M - $10M</SelectItem>
            <SelectItem value="over-10m">{"> $10M"}</SelectItem>
            <SelectItem value="non-monetary">Non-monetary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specificAmount">Specific Dollar Amount (optional)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="specificAmount"
            type="text"
            placeholder="0"
            value={data.specificAmount}
            onChange={(e) => setData({ ...data, specificAmount: e.target.value })}
            className="pl-7"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="caseStatus">Case Status</Label>
        <Select value={data.caseStatus} onValueChange={(value) => setData({ ...data, caseStatus: value })}>
          <SelectTrigger id="caseStatus">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pre-litigation">Pre-litigation / Investigation</SelectItem>
            <SelectItem value="litigation">Litigation ongoing</SelectItem>
            <SelectItem value="appeal">Appeal / Post-judgment</SelectItem>
            <SelectItem value="settlement">Settlement negotiations</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="decisionDeadline">Decision Deadline (optional)</Label>
        <Input
          id="decisionDeadline"
          type="date"
          value={data.decisionDeadline}
          onChange={(e) => setData({ ...data, decisionDeadline: e.target.value })}
        />
      </div>
    </div>
  )
}
