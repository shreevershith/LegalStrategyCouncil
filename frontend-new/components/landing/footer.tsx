import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              GitHub
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground">For analytical purposes only. Not legal advice.</p>
        </div>
      </div>
    </footer>
  )
}
