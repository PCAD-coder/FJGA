import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggleBtn } from "@/components/themeToggleBtn"

export const metadata: Metadata = {
  title: "User Guide | FJ Glass and Aluminum",
  description:
    "Learn how to order products, request custom designs, review quotations, make payments, and manage your FJGA orders.",
}

const sections = [
  {
    id: "getting-started",
    title: "Create your account",
    href: "/sign-up",
    action: "Create an account",
    description:
      "An account gives you access to your dashboard and customer services.",
    steps: [
      "Choose Sign Up on the homepage and complete the registration form. Use an email address you can access.",
      "Create a password that meets the requirements shown on the form, then enter it again to confirm.",
      "Follow the email verification instructions shown after registration, then sign in with your email and password.",
      "Use the sidebar to open Dashboard, Catalog, Custom Orders, My Orders, Payments, Feedback, or Returns. On smaller screens, use the sidebar toggle to show the menu.",
    ],
    tip: "Customer pages require sign-in. You can return to this guide without signing in.",
  },
  {
    id: "catalog",
    title: "Order from the catalog",
    href: "/catalog",
    action: "Browse the catalog",
    description:
      "Start with an existing product and configure it for your space.",
    steps: [
      "Open Catalog and browse the products. Use the category filter to narrow your selection.",
      "Open a product to review its details and available options.",
      "Enter the required dimensions, choose available aluminum and glass variants, and set the quantity. Add order notes if needed.",
      "Provide your contact number and delivery address, and choose an available payment method.",
      "Review the order summary and displayed charges before placing the order. Open My Orders to follow its approval and payment requirements.",
    ],
    tip: "Check your measurements and units carefully. Available options and pricing depend on the product you select.",
  },
  {
    id: "custom-orders",
    title: "Request a custom design",
    href: "/custom-orders",
    action: "Open Custom Orders",
    description:
      "Use the five-step request form when you need a project designed for you.",
    steps: [
      "Project details: select a category, name your project, enter a quantity of at least one, and describe what you need.",
      "Design reference: upload at least one reference image and add notes to explain the design.",
      "Specifications: select your measurement unit and enter a positive width and height. Add depth when relevant. Mark approximate measurements and provide material preferences or ask FJGA to recommend options.",
      "Delivery: enter a Philippine mobile number and your delivery address, including house or building number, street, region, city or municipality, and barangay.",
      "Review: check all details before submitting. Use Back to correct earlier steps, then submit and monitor the request in Custom Orders.",
    ],
    tip: "A custom request is reviewed before it becomes an order. Submitting the request does not mean a quotation has been accepted.",
  },
  {
    id: "quotations",
    title: "Review your quotation",
    href: "/custom-orders",
    action: "View custom requests",
    description:
      "Review the proposed work and total cost before confirming your custom project.",
    steps: [
      "Open your custom request and view its quotation when one is available.",
      "Check the project details, item quantities, prices, VAT, delivery fee, total amount, and notes. You can also view previous quotations and print a quotation.",
      "Choose Accept Quotation when you agree, then confirm acceptance. Accepting creates an actual order for the quoted project.",
      "If you do not agree, use the decline option and confirm. Check the request again for updates from FJGA.",
      "After accepting, open My Orders to view the resulting order and its next required action.",
    ],
  },
  {
    id: "payments",
    title: "Make and check payments",
    href: "/payments",
    action: "Open Payments",
    description:
      "Follow the payment requirement displayed for your specific order.",
    steps: [
      "Check My Orders for approval and payment instructions. Pending orders must first be reviewed by the administrator.",
      "Once approved, follow the displayed down payment requirement. At least 50% of the order total is required before production can begin.",
      "We accept cash, GCash, and QR Ph only. Open Payments to review pending invoices and payment history. For online payment, continue to PayMongo checkout and choose GCash or QR Ph.",
      "For cash payments, visit FJGA at 248 Camia St. Bancal, Meycauayan City of Bulacan.",
      "If submitting payment details from an order, complete the information requested by its payment form and wait for verification.",
      "Check the order balance and payment status after confirmation. A submission awaiting verification is not yet a confirmed payment.",
    ],
    tip: "If a payment is still pending, check its status and history before attempting another payment.",
  },
  {
    id: "tracking",
    title: "Follow your order",
    href: "/my-orders",
    action: "Open My Orders",
    description:
      "Keep track of your order from review through production and delivery.",
    steps: [
      "Open My Orders and use its filters to find the order you need.",
      "Open the order details to review the products, payment summary, status, and progress information.",
      "Follow any displayed action, such as submitting a required payment or waiting for payment verification.",
      "Review production and delivery updates as the team updates your order. Check the notification bell for new messages and updates.",
    ],
  },
  {
    id: "returns",
    title: "Report an issue or request a return",
    href: "/returns",
    action: "Open Returns",
    description:
      "Use Returns to report an issue with an eligible delivered order.",
    steps: [
      "Read the Return Policy on the Returns page. Items must be reported within seven days after delivery.",
      "Select an eligible order and choose the issue type.",
      "Describe the issue in at least 50 characters and provide a contact number.",
      "Include clear photos for evaluation. The form supports up to five JPG or PNG photos, each no larger than 10 MB.",
      "Submit your request and check its status in the request list for updates.",
    ],
    tip: "Keep all original parts and accessories. Damage from misuse is not eligible for replacement; custom products may qualify only when manufacturing defects are confirmed.",
  },
  {
    id: "feedback",
    title: "Share your feedback",
    href: "/feedback",
    action: "Open Feedback",
    description: "Tell FJGA about your experience with an order.",
    steps: [
      "Open Feedback and select an available order to review.",
      "Choose a rating and complete the feedback form, then submit your review.",
      "Return to Feedback to see your submitted reviews and their publication status.",
    ],
  },
]

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#guide-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-background focus:p-3 focus:ring-2 focus:ring-ring"
      >
        Skip to guide content
      </a>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/documentation"
            className="flex items-center gap-2 font-semibold"
          >
            <BookOpen className="size-5 text-primary" aria-hidden="true" />
            FJGA{" "}
            <span className="font-normal text-muted-foreground">
              / User Guide
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggleBtn />
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Home
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-b px-4 py-6 sm:px-6 lg:border-r lg:border-b-0">
          <nav aria-label="Guide sections" className="lg:sticky lg:top-24">
            <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              On this page
            </p>
            <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <span className="font-mono text-xs leading-5">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#help"
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Need help?
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main
          id="guide-content"
          className="min-w-0 px-4 py-10 sm:px-8 lg:px-12 lg:py-14"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">
              FJ Glass and Aluminum
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Your guide to using FJGA
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              From your first order to delivery, learn how to use your customer
              account and find the next step for your project.
            </p>
            <div className="mt-8 rounded-xl border bg-muted/40 p-5">
              <h2 className="font-semibold">Ordering for the first time?</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Create an account, browse the catalog or request a custom
                design, review your order or quotation, then follow the approval
                and payment instructions. Track progress in My Orders.
              </p>
            </div>

            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-36 border-b py-10 lg:scroll-mt-24"
              >
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Guide {String(index + 1).padStart(2, "0")}
                </p>
                <h2
                  id={`${section.id}-title`}
                  className="mt-2 text-2xl font-semibold tracking-tight"
                >
                  {section.title}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {section.description}
                </p>
                <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm leading-7 marker:font-semibold marker:text-primary">
                  {section.steps.map((step) => (
                    <li key={step} className="pl-2">
                      {step}
                    </li>
                  ))}
                </ol>
                {section.tip && (
                  <p className="mt-6 rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm leading-6">
                    <span className="font-semibold">Keep in mind: </span>
                    {section.tip}
                  </p>
                )}
                <Button asChild variant="outline" className="mt-6">
                  <Link href={section.href}>
                    {section.action}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </section>
            ))}

            <section
              id="help"
              className="scroll-mt-36 py-10 lg:scroll-mt-24"
              aria-labelledby="help-title"
            >
              <h2
                id="help-title"
                className="text-2xl font-semibold tracking-tight"
              >
                Need help?
              </h2>
              <div className="mt-5 space-y-5 text-sm leading-7 text-muted-foreground">
                <p>
                  <strong className="text-foreground">
                    Cannot submit a form?
                  </strong>{" "}
                  Check the error message, fill in required fields, and confirm
                  that dimensions, contact details, and uploaded files meet the
                  requirements shown.
                </p>
                <p>
                  <strong className="text-foreground">
                    Cannot find an order or quotation?
                  </strong>{" "}
                  Make sure you signed in with the account used to create the
                  request. Check your filters in My Orders or Custom Orders.
                </p>
                <p>
                  <strong className="text-foreground">
                    Still need assistance?
                  </strong>{" "}
                  Contact FJGA using the contact information on the homepage.
                  Include your order or request number so the team can locate
                  your project.
                </p>
              </div>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/#contacts">
                  Contact FJGA
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </section>
            <footer className="flex flex-wrap justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
              <span>FJ Glass and Aluminum · Customer documentation</span>
              <a
                href="#guide-content"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Back to top
              </a>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
