import { Check } from "lucide-react"

interface WizardProgressProps {
  currentStep: number
}

const steps = [
  {
    number: 1,
    label: "Project Details",
  },
  {
    number: 2,
    label: "Design Reference",
  },
  {
    number: 3,
    label: "Specifications",
  },
  {
    number: 4,
    label: "Delivery",
  },
  {
    number: 5,
    label: "Review",
  },
]

export function WizardProgress({
  currentStep,
}: WizardProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number

          return (
            <div
              key={step.number}
              className="flex min-w-0 flex-1 items-start"
            >
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 bg-background text-muted-foreground",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>

                <p
                  className={[
                    "mt-2 text-center text-xs font-medium sm:text-sm",
                    isCurrent || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {step.label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="mt-[17px] h-0.5 flex-1 bg-muted">
                  <div
                    className={[
                      "h-full transition-all",
                      currentStep > step.number
                        ? "w-full bg-primary"
                        : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}