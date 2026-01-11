"use client"

import type { CaseData } from "../case-input-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"

type Props = {
  data: CaseData
  setData: (data: CaseData) => void
  onStartAnalysis: () => void
  onBack: () => void
}

const caseTypes = [
  "Contract Dispute",
  "Intellectual Property",
  "Employment",
  "Fraud",
  "Trade Secrets",
  "Personal Injury",
  "Real Estate",
  "Corporate",
  "Other",
]

const jurisdictions = ["California", "New York", "Texas", "Delaware", "Florida", "Illinois", "Federal", "Other"]

const stakesRanges = [
  { value: "under-100k", label: "Under $100K" },
  { value: "100k-500k", label: "$100K - $500K" },
  { value: "500k-1m", label: "$500K - $1M" },
  { value: "1m-5m", label: "$1M - $5M" },
  { value: "5m-10m", label: "$5M - $10M" },
  { value: "over-10m", label: "Over $10M" },
]

const caseStatuses = [
  "Pre-litigation",
  "Ongoing Litigation",
  "Appeal",
  "Settlement Negotiations",
  "Discovery Phase",
  "Other",
]

export function ExtractedSummaryStep({ data, setData, onStartAnalysis, onBack }: Props) {
  const handleFieldChange = (field: string, value: any) => {
    setData({ ...data, [field]: value })
  }

  const isValid =
    data.caseTitle.trim() !== "" &&
    data.plaintiffName.trim() !== "" &&
    data.defendantName.trim() !== "" &&
    data.caseType !== "" &&
    data.jurisdiction !== "" &&
    (data.moneyAtStake.trim() !== "" || data.stakesRange !== "") &&
    data.isConfirmed

  const isMissing = (value: string) => !value || value.trim() === ""

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Extracted Case Summary</h2>
        <p className="mt-2 text-muted-foreground">
          Review and edit the extracted details. All fields marked with * are required.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        {/* Case Title */}
        <div className="space-y-2">
          <Label htmlFor="caseTitle">Case Title *</Label>
          <Input
            id="caseTitle"
            value={data.caseTitle}
            onChange={(e) => handleFieldChange("caseTitle", e.target.value)}
            placeholder="e.g., Smith v. Jones Corp"
          />
          {isMissing(data.caseTitle) && <MissingFieldHint />}
        </div>

        {/* Case Type */}
        <div className="space-y-2">
          <Label>Case Type *</Label>
          <Select value={data.caseType} onValueChange={(v) => handleFieldChange("caseType", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select case type" />
            </SelectTrigger>
            <SelectContent>
              {caseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plaintiff / Defendant */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="plaintiffName">Plaintiff / Claimant *</Label>
            <Input
              id="plaintiffName"
              value={data.plaintiffName}
              onChange={(e) => handleFieldChange("plaintiffName", e.target.value)}
              placeholder="Plaintiff name"
            />
            {isMissing(data.plaintiffName) && <MissingFieldHint />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="defendantName">Defendant *</Label>
            <Input
              id="defendantName"
              value={data.defendantName}
              onChange={(e) => handleFieldChange("defendantName", e.target.value)}
              placeholder="Defendant name"
            />
            {isMissing(data.defendantName) && <MissingFieldHint />}
          </div>
        </div>

        {/* Other Parties */}
        <div className="space-y-2">
          <Label htmlFor="otherParties">Other Parties</Label>
          <Input
            id="otherParties"
            value={data.otherParties}
            onChange={(e) => handleFieldChange("otherParties", e.target.value)}
            placeholder="Comma-separated names (optional)"
          />
        </div>

        {/* Jurisdiction */}
        <div className="space-y-2">
          <Label>Jurisdiction *</Label>
          <Select value={data.jurisdiction} onValueChange={(v) => handleFieldChange("jurisdiction", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              {jurisdictions.map((j) => (
                <SelectItem key={j} value={j}>
                  {j}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data.jurisdiction === "Other" && (
            <Input
              className="mt-2"
              value={data.jurisdictionOther}
              onChange={(e) => handleFieldChange("jurisdictionOther", e.target.value)}
              placeholder="Specify jurisdiction"
            />
          )}
        </div>

        {/* Case Description */}
        <div className="space-y-2">
          <Label htmlFor="caseDescription">Case Description</Label>
          <Textarea
            id="caseDescription"
            value={data.caseDescription}
            onChange={(e) => handleFieldChange("caseDescription", e.target.value)}
            placeholder="High-level summary of the case..."
            rows={4}
          />
        </div>

        {/* Money at Stake */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="moneyAtStake">Amount at Stake *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="moneyAtStake"
                type="number"
                className="pl-7"
                value={data.moneyAtStake}
                onChange={(e) => handleFieldChange("moneyAtStake", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Or Select Range</Label>
            <Select value={data.stakesRange} onValueChange={(v) => handleFieldChange("stakesRange", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {stakesRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Case Status */}
        <div className="space-y-2">
          <Label>Case Status</Label>
          <Select value={data.caseStatus} onValueChange={(v) => handleFieldChange("caseStatus", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {caseStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Key Dates */}
        {data.keyDates.length > 0 && (
          <div className="space-y-2">
            <Label>Key Dates</Label>
            <div className="space-y-2">
              {data.keyDates.map((kd, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={kd.label}
                    onChange={(e) => {
                      const newDates = [...data.keyDates]
                      newDates[idx].label = e.target.value
                      handleFieldChange("keyDates", newDates)
                    }}
                    placeholder="Label"
                    className="flex-1"
                  />
                  <Input
                    type="date"
                    value={kd.date}
                    onChange={(e) => {
                      const newDates = [...data.keyDates]
                      newDates[idx].date = e.target.value
                      handleFieldChange("keyDates", newDates)
                    }}
                    className="w-40"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation */}
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="confirm"
              checked={data.isConfirmed}
              onCheckedChange={(checked) => setData({ ...data, isConfirmed: checked as boolean })}
            />
            <label htmlFor="confirm" className="text-sm leading-relaxed text-foreground cursor-pointer">
              I confirm that these case details are accurate to the best of my knowledge.
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onStartAnalysis} disabled={!isValid}>
          Start Analyze
        </Button>
      </div>
    </div>
  )
}

function MissingFieldHint() {
  return (
    <p className="flex items-center gap-1.5 text-xs text-amber-600">
      <AlertCircle className="h-3 w-3" />
      Missing – please fill in
    </p>
  )
}
