"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import type { CaseData } from "../case-input-form"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText } from "lucide-react"

type Props = {
  data: CaseData
  setData: (data: CaseData) => void
  onNext: (files: File[]) => void
  onCancel: () => void
}

export function UploadStep({ data, setData, onNext, onCancel }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const actualFilesRef = useRef<Map<string, File>>(new Map())

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const addFiles = useCallback((files: File[]) => {
    const validFiles = files.filter((file) => {
      const ext = file.name.toLowerCase().split(".").pop()
      return ["pdf", "docx", "txt"].includes(ext || "") && file.size <= 10 * 1024 * 1024
    })

    if (validFiles.length === 0) return

    const newFilesData: { name: string; size: number; id: string }[] = []
    
    validFiles.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      newFilesData.push({
        name: file.name,
        size: file.size,
        id: id,
      })
      actualFilesRef.current.set(id, file)
    })
    
    // Update data state with the new file metadata
    setData((prevData) => ({
      ...prevData,
      uploadedFiles: [...prevData.uploadedFiles, ...newFilesData],
    }))
  }, [setData])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      addFiles(files)
    },
    [addFiles],
  )

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      addFiles(files)
      // Reset input so same file can be selected again
      e.target.value = ""
    }
  }, [addFiles])

  const removeFile = useCallback((fileId: string) => {
    actualFilesRef.current.delete(fileId)
    setData((prevData) => ({
      ...prevData,
      uploadedFiles: prevData.uploadedFiles.filter((f) => f.id !== fileId),
    }))
  }, [setData])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Upload case document</h2>
        <p className="mt-2 text-muted-foreground">
          Upload your case documents to begin analysis. Supported formats: PDF, DOCX, TXT.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
        <p className="mt-6 text-lg font-medium text-foreground">Drop your case file here or click to browse</p>
        <p className="mt-2 text-sm text-muted-foreground">You can upload one or more documents.</p>
      </div>

      {/* Uploaded Files List */}
      {data.uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-2">
          {data.uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(file.id)
                }}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={() => {
            const files = Array.from(actualFilesRef.current.values())
            onNext(files)
          }} 
          disabled={data.uploadedFiles.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
