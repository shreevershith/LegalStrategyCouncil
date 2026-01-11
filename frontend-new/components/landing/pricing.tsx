import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Hackathon Mode",
    price: "Free",
    description: "Analyze a few cases · Default agents",
    cta: "Start Free",
    href: "/case-input",
    variant: "outline" as const,
  },
  {
    name: "Team Mode",
    price: "Contact us",
    description: "Unlimited cases · Custom agents · Priority support",
    cta: "Request Demo",
    href: "#",
    variant: "default" as const,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Get started in minutes</h2>
          <p className="mt-4 text-lg text-muted-foreground">Choose the plan that fits your needs</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-3xl font-bold text-foreground">{plan.price}</p>
              </CardContent>
              <CardFooter>
                <Button variant={plan.variant} className="w-full" asChild>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
