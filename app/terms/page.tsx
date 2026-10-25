import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TERMS_SECTIONS, TERMS_VERSION } from "@/lib/terms"

export const metadata: Metadata = {
  title: "Terms and Conditions | FJ Glass and Aluminum",
  description:
    "Terms for creating an FJGA account and using our ordering services.",
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/sign-up">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to sign up
        </Link>
      </Button>
      <p className="text-sm font-medium text-primary">FJ Glass and Aluminum</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Terms and Conditions
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Version {TERMS_VERSION} Â· Effective October 25, 2026
      </p>
      <p className="mt-6 rounded-xl border bg-card p-5 text-sm leading-7">
        Please review these terms before creating an account. They explain how
        accounts, orders, payments, and customer requests are handled.
      </p>
      <div className="mt-8 divide-y">
        {TERMS_SECTIONS.map((section, index) => (
          <section key={section.title} className="py-6">
            <h2 className="text-lg font-semibold">
              {index + 1}. {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-sm leading-7 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <section className="mt-4 rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Questions about these terms?</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Contact FJGA before registering or placing an order if you need
          clarification.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/#contacts">Contact FJGA</Link>
        </Button>
      </section>
    </main>
  )
}
