/**
 * Case Input Component
 * 
 * This component provides a comprehensive form for case input with the following features:
 * - PDF upload with drag-and-drop support
 * - Automatic PDF extraction using LLM (via backend API)
 * - Manual form fields for case details
 * - Form validation before submission
 * 
 * The component handles:
 * 1. PDF file upload and extraction
 * 2. Form field management
 * 3. Data extraction from PDFs (case title, parties, jurisdiction, etc.)
 * 4. Form submission to create a new case
 * 
 * After successful submission, the parent App component handles the analysis workflow.
 */
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Badge } from './ui/badge'
import { Upload, FileText, Loader2, X, Check, AlertCircle } from 'lucide-react'
import { cn } from '../lib/utils'

const API_URL = '/api'

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

function CaseInput({ onSubmit }) {
  const [formData, setFormData] = useState({
    caseTitle: '',
    caseType: '',
    plaintiffName: '',
    defendantName: '',
    otherParties: '',
    jurisdiction: '',
    jurisdictionOther: '',
    caseDescription: '',
    moneyAtStake: '',
    stakesRange: '',
    caseStatus: '',
    keyDates: [],
    isConfirmed: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState(null)

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
    if (pdfFiles.length === 0) {
      setExtractionError('Please upload PDF files only')
      return
    }

    setUploadedFiles(pdfFiles)
    setExtractionError(null)
    setIsExtracting(true)

    try {
      const formDataObj = new FormData()
      pdfFiles.forEach(file => {
        formDataObj.append('files', file)
      })

      const response = await fetch(`${API_URL}/cases/process-documents`, {
        method: 'POST',
        body: formDataObj
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error:', errorText)
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const extractedData = await response.json()
      console.log('Extracted data:', extractedData)
      
      // Populate form with extracted data
      setFormData(prev => ({
        ...prev,
        caseTitle: extractedData.caseTitle || '',
        caseType: extractedData.caseType || '',
        plaintiffName: extractedData.plaintiffName || '',
        defendantName: extractedData.defendantName || '',
        otherParties: extractedData.otherParties || '',
        jurisdiction: extractedData.jurisdiction || '',
        caseDescription: extractedData.caseDescription || '',
        moneyAtStake: extractedData.moneyAtStake || '',
        stakesRange: extractedData.stakesRange || '',
        caseStatus: extractedData.caseStatus || '',
        keyDates: extractedData.keyDates || []
      }))
    } catch (error) {
      console.error('Error extracting PDF:', error)
      const errorMessage = error.message || 'Failed to extract data from PDF'
      setExtractionError(`${errorMessage}. Please fill the form manually or try uploading again.`)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Map form data to backend expected format
    const caseData = {
      title: formData.caseTitle,
      facts: formData.caseDescription || `${formData.caseTitle}\n\nPlaintiff: ${formData.plaintiffName}\nDefendant: ${formData.defendantName}\n${formData.otherParties ? `Other Parties: ${formData.otherParties}\n` : ''}Jurisdiction: ${formData.jurisdiction}\nCase Type: ${formData.caseType}\nStatus: ${formData.caseStatus}`,
      jurisdiction: formData.jurisdictionOther || formData.jurisdiction,
      stakes: formData.moneyAtStake ? `$${formData.moneyAtStake}` : (formData.stakesRange ? stakesRanges.find(r => r.value === formData.stakesRange)?.label || '' : '')
    }
    
    await onSubmit(caseData)
    setIsSubmitting(false)
  }

  const handleLoadDemo = () => {
    setFormData({
      caseTitle: "NovaTech Solutions vs. Meridian Ventures",
      caseType: "Contract Dispute",
      plaintiffName: "NovaTech Solutions",
      defendantName: "Meridian Ventures",
      otherParties: "",
      jurisdiction: "Delaware",
      jurisdictionOther: "",
      caseDescription: "NovaTech Solutions is a 3-year-old AI startup that developed a proprietary machine learning platform for healthcare diagnostics. In March 2024, Meridian Ventures signed a Series A investment agreement promising $5 million in funding over two tranches: Tranche 1 ($2.5M) upon signing (received), and Tranche 2 ($2.5M) upon reaching 50 enterprise customers.\n\nIn September 2024, NovaTech reached 53 enterprise customers and notified Meridian to release Tranche 2. Meridian refused, claiming NovaTech's customers were 'trial agreements' not 'enterprise customers', and that the agreement required $100K+ annual contracts.",
      moneyAtStake: "2500000",
      stakesRange: "1m-5m",
      caseStatus: "Ongoing Litigation",
      keyDates: [],
      isConfirmed: false
    })
  }

  const handleClear = () => {
    setFormData({
      caseTitle: '',
      caseType: '',
      plaintiffName: '',
      defendantName: '',
      otherParties: '',
      jurisdiction: '',
      jurisdictionOther: '',
      caseDescription: '',
      moneyAtStake: '',
      stakesRange: '',
      caseStatus: '',
      keyDates: [],
      isConfirmed: false
    })
    setUploadedFiles([])
    setExtractionError(null)
  }

  const isMissing = (value) => !value || (typeof value === 'string' && value.trim() === '')

  const isValid =
    formData.caseTitle.trim() !== '' &&
    formData.plaintiffName.trim() !== '' &&
    formData.defendantName.trim() !== '' &&
    formData.caseType !== '' &&
    formData.jurisdiction !== '' &&
    (formData.moneyAtStake.trim() !== '' || formData.stakesRange !== '') &&
    formData.isConfirmed

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Case Analysis Setup</h2>
        <p className="mt-2 text-muted-foreground">
          Complete the form below to configure your multi-agent analysis
        </p>
      </div>

      {/* PDF Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Case Documents</CardTitle>
          <CardDescription>
            Upload PDF documents to automatically extract case information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Upload Case Documents (PDF)</label>
            <div className={cn(
              "relative rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer",
              isExtracting ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
            )}>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
                disabled={isExtracting}
              />
              <label
                htmlFor="pdf-upload"
                className={cn(
                  "cursor-pointer flex flex-col items-center gap-2",
                  isExtracting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    <p className="mt-6 text-lg font-medium text-foreground">Extracting data from PDF...</p>
                    <p className="mt-2 text-sm text-muted-foreground">Please wait while we process your document</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-16 w-16 text-muted-foreground" />
                    <p className="mt-6 text-lg font-medium text-foreground">Drop your case file here or click to browse</p>
                    <p className="mt-2 text-sm text-muted-foreground">You can upload one or more PDF documents</p>
                  </>
                )}
              </label>
            </div>

            {extractionError && (
              <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                {extractionError}
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Extracted Case Summary Form */}
      <Card>
        <CardHeader>
          <CardTitle>Extracted Case Summary</CardTitle>
          <CardDescription>
            Review and edit the extracted details. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Case Title */}
            <div className="space-y-2">
              <Label htmlFor="caseTitle">Case Title *</Label>
              <Input
                id="caseTitle"
                value={formData.caseTitle}
                onChange={(e) => handleFieldChange("caseTitle", e.target.value)}
                placeholder="e.g., Smith v. Jones Corp"
              />
              {isMissing(formData.caseTitle) && (
                <p className="flex items-center gap-1.5 text-xs text-warning">
                  <AlertCircle className="h-3 w-3" />
                  Missing – please fill in
                </p>
              )}
            </div>

            {/* Case Type */}
            <div className="space-y-2">
              <Label>Case Type *</Label>
              <Select value={formData.caseType} onValueChange={(v) => handleFieldChange("caseType", v)}>
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
                  value={formData.plaintiffName}
                  onChange={(e) => handleFieldChange("plaintiffName", e.target.value)}
                  placeholder="Plaintiff name"
                />
                {isMissing(formData.plaintiffName) && (
                  <p className="flex items-center gap-1.5 text-xs text-warning">
                    <AlertCircle className="h-3 w-3" />
                    Missing – please fill in
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="defendantName">Defendant *</Label>
                <Input
                  id="defendantName"
                  value={formData.defendantName}
                  onChange={(e) => handleFieldChange("defendantName", e.target.value)}
                  placeholder="Defendant name"
                />
                {isMissing(formData.defendantName) && (
                  <p className="flex items-center gap-1.5 text-xs text-warning">
                    <AlertCircle className="h-3 w-3" />
                    Missing – please fill in
                  </p>
                )}
              </div>
            </div>

            {/* Other Parties */}
            <div className="space-y-2">
              <Label htmlFor="otherParties">Other Parties</Label>
              <Input
                id="otherParties"
                value={formData.otherParties}
                onChange={(e) => handleFieldChange("otherParties", e.target.value)}
                placeholder="Comma-separated names (optional)"
              />
            </div>

            {/* Jurisdiction */}
            <div className="space-y-2">
              <Label>Jurisdiction *</Label>
              <Select value={formData.jurisdiction} onValueChange={(v) => handleFieldChange("jurisdiction", v)}>
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
              {formData.jurisdiction === "Other" && (
                <Input
                  className="mt-2"
                  value={formData.jurisdictionOther}
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
                value={formData.caseDescription}
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
                    value={formData.moneyAtStake}
                    onChange={(e) => handleFieldChange("moneyAtStake", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Or Select Range</Label>
                <Select value={formData.stakesRange} onValueChange={(v) => handleFieldChange("stakesRange", v)}>
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
              <Select value={formData.caseStatus} onValueChange={(v) => handleFieldChange("caseStatus", v)}>
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
            {formData.keyDates.length > 0 && (
              <div className="space-y-2">
                <Label>Key Dates</Label>
                <div className="space-y-2">
                  {formData.keyDates.map((kd, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={kd.label}
                        onChange={(e) => {
                          const newDates = [...formData.keyDates]
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
                          const newDates = [...formData.keyDates]
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
                  checked={formData.isConfirmed}
                  onCheckedChange={(checked) => handleFieldChange("isConfirmed", checked)}
                />
                <label htmlFor="confirm" className="text-sm leading-relaxed text-foreground cursor-pointer">
                  I confirm that these case details are accurate to the best of my knowledge.
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleLoadDemo}>
                  Load Demo Case
                </Button>
                <Button type="button" variant="outline" onClick={handleClear}>
                  Clear Form
                </Button>
              </div>

              <Button type="submit" disabled={isSubmitting || !isValid} size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Begin Analysis
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Meet Your Legal Council (Inspired by Suits)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-strategist text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">H</div>
              <p><strong>Harvey</strong> - Lead Strategist who develops bold, winning strategies</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-precedent text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">L</div>
              <p><strong>Louis</strong> - Precedent Expert who masters case law research</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-adversarial text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">T</div>
              <p><strong>Tanner</strong> - Adversarial Counsel who attacks your strategy</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-moderator text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">J</div>
              <p><strong>Jessica</strong> - Managing Partner who synthesizes final strategy</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Harvey and Tanner will debate your strategy in multiple rounds before Jessica delivers the final verdict.
          </p>
        </CardContent>
      </Card>

      {/* Extraction Loading Dialog */}
      <Dialog open={isExtracting}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Extracting Case Information</DialogTitle>
            <DialogDescription>
              Please wait while we process your document
            </DialogDescription>
          </DialogHeader>
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

export default CaseInput
