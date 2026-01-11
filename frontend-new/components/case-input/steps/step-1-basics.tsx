"use client"

import type { CaseData } from "../case-input-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  data: CaseData
  setData: (data: CaseData) => void
}

export function Step1Basics({ data, setData }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="caseTitle">Case Title</Label>
        <Input
          id="caseTitle"
          placeholder="TechCorp v. BuildCo Breach of Contract"
          value={data.caseTitle}
          onChange={(e) => setData({ ...data, caseTitle: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="caseType">Case Type</Label>
        <Select value={data.caseType} onValueChange={(value) => setData({ ...data, caseType: value })}>
          <SelectTrigger id="caseType">
            <SelectValue placeholder="Select case type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="ip">Intellectual Property</SelectItem>
            <SelectItem value="employment">Employment</SelectItem>
            <SelectItem value="fraud">Fraud / Misrepresentation</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jurisdiction">Jurisdiction</Label>
        <Select value={data.jurisdiction} onValueChange={(value) => setData({ ...data, jurisdiction: value })}>
          <SelectTrigger id="jurisdiction">
            <SelectValue placeholder="Select jurisdiction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delaware">Delaware</SelectItem>
            <SelectItem value="new-york">New York</SelectItem>
            <SelectItem value="california">California</SelectItem>
            <SelectItem value="federal">Federal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {data.jurisdiction === "other" && (
          <Input
            placeholder="Enter jurisdiction"
            value={data.jurisdictionOther}
            onChange={(e) => setData({ ...data, jurisdictionOther: e.target.value })}
            className="mt-2"
          />
        )}
      </div>
    </div>
  )
}
