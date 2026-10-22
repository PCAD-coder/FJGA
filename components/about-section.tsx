import {
  Gem,
  Hammer,
  Ruler,
  Handshake,
} from "lucide-react"

const values = [
  {
    title: "Quality Materials",
    description:
      "Glass and aluminum materials selected with durability, function, and appearance in mind.",
    icon: Gem,
  },
  {
    title: "Careful Craftsmanship",
    description:
      "Every project is fabricated with attention to measurements, construction, and finishing.",
    icon: Hammer,
  },
  {
    title: "Made to Fit",
    description:
      "Custom solutions are planned around the dimensions, preferences, and requirements of each space.",
    icon: Ruler,
  },
  {
    title: "Customer-Focused Service",
    description:
      "From planning and quotation to production and delivery, we keep the project centered on your needs.",
    icon: Handshake,
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Introduction */}
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">
              Our Company
            </p>

            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.08] font-medium tracking-tight sm:text-5xl lg:text-6xl">
              Built Around Quality,
              <br />
              Craftsmanship, and
              <br />
              Practical Design.
            </h2>
          </div>

          <div>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              FJ Glass and Aluminum provides glass and aluminum
              furniture, architectural fixtures, and custom fabrication
              solutions for residential, office, and commercial spaces.
            </p>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              We work with customers to turn their requirements into
              practical solutions, from selecting the right design and
              dimensions to fabrication, installation, and delivery.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16 grid border-y sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon

            return (
              <div
                key={value.title}
                className={[
                  "py-8 sm:p-8 lg:py-10",
                  index > 0
                    ? "border-t sm:border-t-0"
                    : "",
                  index === 1
                    ? "sm:border-l"
                    : "",
                  index === 2
                    ? "sm:border-t lg:border-t-0 lg:border-l"
                    : "",
                  index === 3
                    ? "sm:border-t sm:border-l lg:border-t-0"
                    : "",
                ].join(" ")}
              >
                <div className="flex size-11 items-center justify-center rounded-full border">
                  <Icon
                    className="size-5 stroke-[1.5]"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-6 text-base font-semibold">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}