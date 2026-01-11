import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              AI-Powered Legal Strategy Exploration
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Explore competing legal strategies, stress-test arguments, and synthesize a unified case strategy using
              multi-agent AI and MongoDB.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/case-input">
                  Analyze Case
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Central case folder */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="rounded-xl border-2 border-primary/30 bg-card p-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <svg
                        className="h-8 w-8 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Your Case</p>
                      <p className="text-xs text-muted-foreground">Ready for analysis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent nodes around the center */}
              {/* Harvey - Top Left */}
              <div className="absolute -left-4 top-4">
                <div className="rounded-full border-2 border-blue-500/30 bg-card p-4 shadow-md">
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-blue-500/10 p-2">
                      <svg
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-foreground">Harvey</span>
                    <span className="text-[10px] text-muted-foreground">Strategist</span>
                  </div>
                </div>
                {/* Connection line */}
                <div className="absolute -right-8 top-1/2 h-0.5 w-8 bg-gradient-to-r from-blue-500/50 to-primary/30" />
              </div>

              {/* Louis - Top Right */}
              <div className="absolute -right-4 top-4">
                <div className="rounded-full border-2 border-amber-500/30 bg-card p-4 shadow-md">
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-amber-500/10 p-2">
                      <svg
                        className="h-6 w-6 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-foreground">Louis</span>
                    <span className="text-[10px] text-muted-foreground">Precedent</span>
                  </div>
                </div>
                {/* Connection line */}
                <div className="absolute -left-8 top-1/2 h-0.5 w-8 bg-gradient-to-l from-amber-500/50 to-primary/30" />
              </div>

              {/* Tanner - Bottom Left */}
              <div className="absolute -left-4 bottom-4">
                <div className="rounded-full border-2 border-red-500/30 bg-card p-4 shadow-md">
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-red-500/10 p-2">
                      <svg
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-foreground">Tanner</span>
                    <span className="text-[10px] text-muted-foreground">Adversarial</span>
                  </div>
                </div>
                {/* Connection line */}
                <div className="absolute -right-8 top-1/2 h-0.5 w-8 bg-gradient-to-r from-red-500/50 to-primary/30" />
              </div>

              {/* Jessica - Bottom Right */}
              <div className="absolute -right-4 bottom-4">
                <div className="rounded-full border-2 border-primary/50 bg-card p-4 shadow-md ring-2 ring-primary/20">
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-foreground">Jessica</span>
                    <span className="text-[10px] text-muted-foreground">Director</span>
                  </div>
                </div>
                {/* Connection line */}
                <div className="absolute -left-8 top-1/2 h-0.5 w-8 bg-gradient-to-l from-primary/50 to-primary/30" />
              </div>

              {/* Placeholder for spacing */}
              <div className="h-72 w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
