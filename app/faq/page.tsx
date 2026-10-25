import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggleBtn } from "@/components/themeToggleBtn"

export const metadata: Metadata = {
  title: "FAQs | FJ Glass and Aluminum",
  description:
    "Answers to common questions about FJGA accounts, orders, payments, delivery, returns, and feedback.",
}

const faqs = [
  {
    question: "Do I need an account to place an order?",
    answer:
      "Yes. Create an account and sign in to order from the catalog, submit custom requests, and manage your orders. You can read this guide without signing in.",
    href: "/sign-up",
    action: "Create an account",
  },
  {
    question: "Should I use the catalog or submit a custom request?",
    answer:
      "Use Catalog when an existing product fits your needs. Its order page shows the dimensions and material options available for that product. Use Custom Orders for a design or project you want FJGA to review and quote.",
    href: "/documentation#custom-orders",
    action: "Read about custom requests",
  },
  {
    question: "Can I submit a custom request with approximate measurements?",
    answer:
      "Yes. Mark your measurements as approximate in the Specifications step. Check your measurement unit and provide the required width and height. Add reference images and notes to help explain your design.",
    href: "/custom-orders",
    action: "Open Custom Orders",
  },
  {
    question: "Does submitting a custom request automatically create an order?",
    answer:
      "No. FJGA reviews the request first. When a quotation is available, review its details and charges in Custom Orders. Accepting and confirming the quotation creates the order, which you can then find in My Orders.",
    href: "/documentation#quotations",
    action: "Learn about quotations",
  },
  {
    question: "Why is the order button disabled on a product page?",
    answer:
      "Complete your delivery location, including region, city or municipality, and barangay. Wait for the delivery check to finish. If the page reports that delivery is unavailable, select another location or contact FJGA for assistance.",
    href: "/documentation#catalog",
    action: "Read the ordering steps",
  },
  {
    question: "Where can I see payments due and past payments?",
    answer:
      "Open Payments. The Payments Due tab lists invoices that need payment, and the Payment History tab shows recorded payments. Check My Orders for the payment requirement and balance for a specific order.",
    href: "/payments",
    action: "Open Payments",
  },
  {
    question: "My payment still appears pending. What should I do?",
    answer:
      "Check Payment History and your order's payment status before trying another payment. Payment details awaiting verification are not yet confirmed. If the status remains unclear, contact FJGA with your order number and payment reference.",
    href: "/documentation#help",
    action: "Find help",
  },
  {
    question: "How do I track an order or find an older request?",
    answer:
      "Open My Orders to review order status, details, and progress. Use search and status filters to find a particular order, then Previous and Next to browse additional pages. Custom Orders has its own search, status filters, and pagination for requests.",
    href: "/my-orders",
    action: "Open My Orders",
  },
  {
    question: "Where do I submit a return and check its status?",
    answer:
      "Open Returns and read the policy. Use the Request a Return tab to select an eligible delivered order and describe the issue. After submitting, open the Request Status tab to follow updates on your request.",
    href: "/returns",
    action: "Open Returns",
  },
  {
    question: "How do I leave a review or see a reply from FJGA?",
    answer:
      "Open Feedback and select Leave Feedback for an order under Orders Awaiting Feedback. Submit your rating and comments. Your Feedback shows submitted reviews, their publication status, and any reply from FJGA.",
    href: "/feedback",
    action: "Open Feedback",
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/faq" className="flex items-center gap-2 font-semibold">
            <CircleHelp aria-hidden="true" className="size-5 text-primary" />
            FJGA{" "}
            <span className="font-normal text-muted-foreground">/ FAQs</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggleBtn />
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Home
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/documentation">
                <BookOpen aria-hidden="true" className="size-4" />
                User Guide
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="text-sm font-medium text-primary">
          FJ Glass and Aluminum
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          How can we help?
        </h1>
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="scroll-mt-36 border-b py-10 lg:scroll-mt-24"
        >
          <h2 id="faq-title" className="text-2xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Quick answers about using your account and managing your orders.
          </p>
          <div className="mt-6 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-xl border bg-card open:border-primary/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <div className="border-t border-border/60 px-5 py-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                  <Link
                    href={faq.href}
                    className="mt-3 inline-flex items-center gap-2 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {faq.action}
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-8 rounded-xl border bg-card p-5">
          <h2 className="font-semibold">Need more guidance?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Read the step-by-step user guide or contact FJGA for help with your
            order.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/documentation">Read the User Guide</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/#contacts">Contact FJGA</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
