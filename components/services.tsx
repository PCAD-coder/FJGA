import Link from "next/link"
import {
  ArrowRight,
  ImageIcon,
  Ruler,
  SwatchBook,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const customOrderFeatures = [
  {
    title: "Reference Images",
    description:
      "Share photos or design inspirations to help us understand your vision.",
    icon: ImageIcon,
  },
  {
    title: "Custom Dimensions",
    description:
      "Provide the measurements needed to create a solution suited to your space.",
    icon: Ruler,
  },
  {
    title: "Material Preferences",
    description:
      "Tell us your preferred materials, finishes, and other project details.",
    icon: SwatchBook,
  },
]

export default function ContentSection() {
  return (
    <section
      id="custom-order"
      className="scroll-mt-20 border-t bg-muted/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main content */}
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">
              Custom Solutions
            </p>

            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.08] font-medium tracking-tight sm:text-5xl lg:text-6xl">
              Have a custom design?
              <br />
              Let&apos;s bring your idea to life.
            </h2>
          </div>

          <div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Looking for something made specifically for your space?
              Share your ideas, measurements, and preferences with FJ Glass
              and Aluminum. We&apos;ll review your request and prepare a
              solution based on your project requirements.
            </p>

            <Button
              asChild
              size="lg"
              className="group mt-7"
            >
              <Link href="/sign-up">
                Request a Custom Order

                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature row */}
        <div className="mt-16 grid border-y md:grid-cols-3">
          {customOrderFeatures.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className={`py-8 md:px-8 md:py-10 ${
                  index > 0
                    ? "border-t md:border-t-0 md:border-l"
                    : ""
                }`}
              >
                <div className="flex size-11 items-center justify-center rounded-full border bg-background">
                  <Icon
                    className="size-5 stroke-[1.5]"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-6 text-base font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Process note */}
        <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Submit your design request and let FJ Glass and Aluminum handle
            the planning from there.
          </p>

          <p className="shrink-0 font-medium text-foreground">
            Your idea. Your dimensions. Built for your space.
          </p>
        </div>
      </div>
    </section>
  )
}