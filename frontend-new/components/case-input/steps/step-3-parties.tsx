"use client"

import type { CaseData } from "../case-input-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  data: CaseData
  setData: (data: CaseData) => void
}

const claimOptions = [
  { id: "breach-contract", label: "Breach of contract" },
  { id: "fraud", label: "Fraud / Misrepresentation" },
  { id: "ip", label: "Intellectual Property" },
  { id: "negligence", label: "Negligence" },
  { id: "fiduciary", label: "Breach of fiduciary duty" },
  { id: "defamation", label: "Defamation" },
  { id: "other", label: "Other" },
]

export function Step3Parties({ data, setData }: Props) {
  const handleClaimChange = (claimId: string, checked: boolean) => {
    const newClaims = checked ? [...data.primaryClaims, claimId] : data.primaryClaims.filter((c) => c !== claimId)
    setData({ ...data, primaryClaims: newClaims })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="plaintiffName">Plaintiff / Claimant Name</Label>
        <Input
          id="plaintiffName"
          placeholder="Enter plaintiff name"
          value={data.plaintiffName}
          onChange={(e) => setData({ ...data, plaintiffName: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="defendantName">Defendant Name</Label>
        <Input
          id="defendantName"
          placeholder="Enter defendant name"
          value={data.defendantName}
          onChange={(e) => setData({ ...data, defendantName: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherParties">Other Parties (optional)</Label>
        <Input
          id="otherParties"
          placeholder="Comma-separated names"
          value={data.otherParties}
          onChange={(e) => setData({ ...data, otherParties: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <Label>Primary Claims</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {claimOptions.map((claim) => (
            <div key={claim.id} className="flex items-center space-x-2">
              <Checkbox
                id={claim.id}
                checked={data.primaryClaims.includes(claim.id)}
                onCheckedChange={(checked) => handleClaimChange(claim.id, checked as boolean)}
              />
              <label
                htmlFor={claim.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {claim.label}
              </label>
            </div>
          ))}
        </div>
        {data.primaryClaims.includes("other") && (
          <Input
            placeholder="Specify other claim"
            value={data.otherClaimText}
            onChange={(e) => setData({ ...data, otherClaimText: e.target.value })}
            className="mt-2"
          />
        )}
      </div>
    </div>
  )
}
