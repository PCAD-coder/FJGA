import {
  Armchair,
  DoorOpen,
  Grid2X2,
  LayoutPanelLeft,
  MoreHorizontal,
  PanelsTopLeft,
  RectangleHorizontal,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type ProductCategory =
  | "window"
  | "door"
  | "railing"
  | "partition"
  | "table"
  | "chair"
  | "other"

export interface ProjectDetailsData {
  category: ProductCategory | ""
  projectName: string
  quantity: number
  description: string
}

interface ProjectDetailsStepProps {
  data: ProjectDetailsData
  onChange: (data: ProjectDetailsData) => void
}

const categories = [
  {
    value: "window" as const,
    label: "Window",
    description: "Custom aluminum and glass windows",
    icon: PanelsTopLeft,
  },
  {
    value: "door" as const,
    label: "Door",
    description: "Sliding, swing and glass doors",
    icon: DoorOpen,
  },
  {
    value: "railing" as const,
    label: "Railing",
    description: "Aluminum and glass railings",
    icon: RectangleHorizontal,
  },
  {
    value: "partition" as const,
    label: "Partition",
    description: "Room and office partitions",
    icon: LayoutPanelLeft,
  },
  {
    value: "table" as const,
    label: "Table",
    description: "Custom tables and work surfaces",
    icon: Grid2X2,
  },
  {
    value: "chair" as const,
    label: "Chair",
    description: "Custom chairs and seating",
    icon: Armchair,
  },
  {
    value: "other" as const,
    label: "Other",
    description: "Something else you have in mind",
    icon: MoreHorizontal,
  },
]

export function ProjectDetailsStep({
  data,
  onChange,
}: ProjectDetailsStepProps) {
  function updateField<K extends keyof ProjectDetailsData>(
    field: K,
    value: ProjectDetailsData[K]
  ) {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-8">
      {/* Product Category */}
      <section className="space-y-4">
        <div>
          <Label className="text-base font-semibold">
            What would you like us to make?
            <span className="ml-1 text-destructive">*</span>
          </Label>

          <p className="mt-1 text-sm text-muted-foreground">
            Select the category that best matches your custom
            project.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon
            const selected = data.category === category.value

            return (
              <button
                key={category.value}
                type="button"
                onClick={() =>
                  updateField("category", category.value)
                }
                className={[
                  "group flex min-h-[118px] items-start gap-4 rounded-xl border p-4 text-left transition-all",
                  "hover:border-primary/50 hover:bg-muted/40",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "bg-background",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold">
                    {category.label}
                  </p>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Project Name + Quantity */}
      <section className="grid gap-5 md:grid-cols-[1fr_180px]">
        <div className="space-y-2">
          <Label htmlFor="project-name">
            Project Name
            <span className="ml-1 text-destructive">*</span>
          </Label>

          <Input
            id="project-name"
            value={data.projectName}
            onChange={(event) =>
              updateField("projectName", event.target.value)
            }
            placeholder="e.g. Living Room Sliding Window"
            maxLength={100}
          />

          <p className="text-xs text-muted-foreground">
            Give your project a short, recognizable name.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity
            <span className="ml-1 text-destructive">*</span>
          </Label>

          <Input
            id="quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]+"
            value={data.quantity}
            onChange={(event) => {
              if (!/^\d*$/.test(event.target.value)) return
              const value = Number(event.target.value)

              updateField(
                "quantity",
                Number.isFinite(value)
                  ? Math.max(1, Math.min(100, value))
                  : 1
              )
            }}
          />

          <p className="text-xs text-muted-foreground">
            Number of units needed.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="space-y-2">
        <Label htmlFor="project-description">
          Tell us about your idea
          <span className="ml-1 text-destructive">*</span>
        </Label>

        <Textarea
          id="project-description"
          value={data.description}
          onChange={(event) =>
            updateField("description", event.target.value)
          }
          placeholder="Describe the design you have in mind, where it will be installed, how you want it to look, or any other details that may help FJGA understand your project."
          className="min-h-[140px] resize-y"
          maxLength={1000}
        />

        <div className="flex justify-between gap-4 text-xs text-muted-foreground">
          <p>
            You can provide more visual references in the next
            step.
          </p>

          <span>
            {data.description.length}/1000
          </span>
        </div>
      </section>
    </div>
  )
}