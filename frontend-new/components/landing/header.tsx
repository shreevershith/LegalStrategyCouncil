"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold text-foreground">
            Multi-Agent Legal Strategy Council
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </Link>
          </nav>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Documentation
          </Link>
          <Button asChild>
            <Link href="/case-input">Analyze Case</Link>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="flex flex-col gap-4 p-4">
            <Link href="#features" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </Link>
            <Link href="#" className="text-sm text-muted-foreground">
              Documentation
            </Link>
            <Button asChild className="w-full">
              <Link href="/case-input">Analyze Case</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
