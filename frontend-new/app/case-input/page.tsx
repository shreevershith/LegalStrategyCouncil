import { CaseInputForm } from "@/components/case-input/case-input-form"
import Link from "next/link"

export default function CaseInputPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold text-foreground">
            Multi-Agent Legal Strategy Council
          </Link>
        </div>
      </header>
      <main className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Case Analysis Setup</h1>
            <p className="mt-2 text-muted-foreground">Complete the form below to configure your multi-agent analysis</p>
          </div>
          <CaseInputForm />
        </div>
      </main>
    </div>
  )
}
