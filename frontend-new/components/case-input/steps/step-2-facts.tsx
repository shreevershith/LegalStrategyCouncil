"use client"

import type { CaseData } from "../case-input-form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

type Props = {
  data: CaseData
  setData: (data: CaseData) => void
}

export function Step2Facts({ data, setData }: Props) {
  const charCount = data.caseFacts.length

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="caseFacts">Case Facts</Label>
        <Textarea
          id="caseFacts"
          placeholder="Describe the key facts of the case including dates, agreements, actions, and disputes..."
          value={data.caseFacts}
          onChange={(e) => setData({ ...data, caseFacts: e.target.value })}
          className="min-h-[200px] resize-y"
        />
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Include key dates, agreements, actions, and disputes.</p>
          <span className={charCount < 150 ? "text-destructive" : "text-muted-foreground"}>
            {charCount} characters {charCount < 150 && "(min 150)"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Or upload case document</Label>
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 px-6 py-10 transition-colors hover:border-primary/50">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium text-foreground">Drop files here or click to upload</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, TXT up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  )
}
