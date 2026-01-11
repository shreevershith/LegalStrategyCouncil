"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { UploadStep } from "./steps/upload-step"
import { ExtractedSummaryStep } from "./steps/extracted-summary-step"

export type CaseData = {
  uploadedFiles: { name: string; size: number; id: string }[]
  caseTitle: string
  caseType: string
  plaintiffName: string
  defendantName: string
  otherParties: string
  jurisdiction: string
  jurisdictionOther: string
  caseDescription: string
  moneyAtStake: string
  stakesRange: string
  caseStatus: string
  keyDates: { label: string; date: string }[]
  isConfirmed: boolean
}

// Store actual File objects in a ref/map for processing
const fileStore = new Map<string, File>()

export const initialData: CaseData = {
  uploadedFiles: [],
  caseTitle: "",
  caseType: "",
  plaintiffName: "",
  defendantName: "",
  otherParties: "",
  jurisdiction: "",
  jurisdictionOther: "",
  caseDescription: "",
  moneyAtStake: "",
  stakesRange: "",
  caseStatus: "",
  keyDates: [],
  isConfirmed: false,
}

type FlowStep = "upload" | "extracting" | "summary"

export function CaseInputForm() {
  const router = useRouter()
  const [step, setStep] = useState<FlowStep>("upload")
  const [data, setData] = useState<CaseData>(initialData)

  const handleUploadNext = async (files: File[]) => {
    setStep("extracting")
    try {
      // Call backend API to process documents
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      console.log("Sending request to:", `${apiUrl}/api/cases/process-documents`)
      console.log("Files:", files.map(f => ({ name: f.name, size: f.size })))

      const response = await fetch(`${apiUrl}/api/cases/process-documents`, {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Failed to process documents: ${response.status} ${response.statusText}`)
      }

      const extractedData = await response.json()
      console.log("Extracted data:", extractedData)

      // Update form data with extracted information
      setData((prev) => ({
        ...prev,
        caseTitle: extractedData.caseTitle || prev.caseTitle,
        caseType: extractedData.caseType || prev.caseType,
        plaintiffName: extractedData.plaintiffName || prev.plaintiffName,
        defendantName: extractedData.defendantName || prev.defendantName,
        otherParties: extractedData.otherParties || prev.otherParties,
        jurisdiction: extractedData.jurisdiction || prev.jurisdiction,
        caseDescription: extractedData.caseDescription || extractedData.extractedFacts || prev.caseDescription,
        moneyAtStake: extractedData.moneyAtStake?.toString() || prev.moneyAtStake,
        stakesRange: extractedData.stakesRange || prev.stakesRange,
        caseStatus: extractedData.caseStatus || prev.caseStatus,
        keyDates: Array.isArray(extractedData.keyDates) ? extractedData.keyDates : prev.keyDates,
      }))
      setStep("summary")
    } catch (error) {
      console.error("Error processing documents:", error)
      alert(`Error processing documents: ${error instanceof Error ? error.message : 'Unknown error'}. You can still proceed with manual entry.`)
      // On error, still allow user to proceed with manual entry
      setStep("summary")
    }
  }

  const handleStartAnalysis = async () => {
    try {
      // Create case in backend using API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.caseTitle,
          facts: data.caseDescription || `${data.plaintiffName} v. ${data.defendantName}. ${data.caseDescription || 'No description provided.'}`,
          jurisdiction: data.jurisdiction || data.jurisdictionOther || "Unknown",
          stakes: data.moneyAtStake || data.stakesRange || "Unknown",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create case")
      }

      const caseResponse = await response.json()
      
      // Store case data with case_id for analysis page
      sessionStorage.setItem("caseData", JSON.stringify({ ...data, caseId: caseResponse.case_id }))
      sessionStorage.setItem("caseId", caseResponse.case_id)
      router.push("/analysis")
    } catch (error) {
      console.error("Error creating case:", error)
      alert("Failed to create case. Please try again.")
    }
  }

  return (
    <div className="mt-8">
      {step === "upload" && (
        <UploadStep 
          data={data} 
          setData={setData} 
          onNext={handleUploadNext} 
          onCancel={() => router.push("/")} 
        />
      )}

      {step === "summary" && (
        <ExtractedSummaryStep
          data={data}
          setData={setData}
          onStartAnalysis={handleStartAnalysis}
          onBack={() => setStep("upload")}
        />
      )}

      {/* Extraction Loading Dialog */}
      <Dialog open={step === "extracting"}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <div className="flex flex-col items-center py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="mt-6 text-lg font-semibold text-foreground">Extracting data from the case document</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we read your case and prepare the summary.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
