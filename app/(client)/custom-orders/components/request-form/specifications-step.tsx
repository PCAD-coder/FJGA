import { Info, Ruler, Sparkles } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import type { ProductCategory } from "./project-details-step"

export type DimensionUnit = "cm" | "mm" | "in" | "m" | "ft"

export interface SpecificationsData {
  dimensionUnit: DimensionUnit

  width: string
  height: string
  depth: string
  measurementsApproximate: boolean

  specifications: Record<string, string>

  preferredFrame: string
  preferredGlass: string
  preferredFinish: string

  letFjgaRecommend: boolean
  otherPreferences: string
}

interface SpecificationsStepProps {
  category: ProductCategory | ""
  data: SpecificationsData
  onChange: (data: SpecificationsData) => void
}

const frameOptions = [
  {
    value: "black-798",
    label: "Black 798 Series Aluminum",
  },
  {
    value: "brown-798",
    label: "Brown 798 Series Aluminum",
  },
  {
    value: "white-aluminum",
    label: "White Aluminum",
  },
  {
    value: "analok-aluminum",
    label: "Analok Aluminum",
  },
]

const glassOptions = [
  {
    value: "clear-6mm",
    label: "6mm Clear Glass",
  },
  {
    value: "bronze-6mm",
    label: "6mm Bronze Glass",
  },
  {
    value: "reflective-6mm",
    label: "6mm Reflective Glass",
  },
  {
    value: "tempered-6mm",
    label: "6mm Clear Tempered Glass",
  },
]

const finishOptions = [
  {
    value: "black",
    label: "Black",
  },
  {
    value: "brown",
    label: "Brown",
  },
  {
    value: "white",
    label: "White",
  },
  {
    value: "analok",
    label: "Analok",
  },
]

const doorHandleOptions = [
  { value: "fjga-recommend", label: "Let FJGA Recommend" },
  { value: "lever-handle", label: "Lever Handle" },
  { value: "pull-handle", label: "Pull Handle" },
  { value: "flush-handle", label: "Flush Handle" },
  { value: "round-doorknob", label: "Round Doorknob" },
  { value: "lever-knob", label: "Lever Knob" },
  { value: "mortise-handle-set", label: "Mortise Handle Set" },
  { value: "sliding-door-handle", label: "Sliding Door Handle" },
  { value: "other", label: "Other / Based on Reference" },
]

const doorLockOptions = [
  { value: "fjga-recommend", label: "Let FJGA Recommend" },
  { value: "key-lock", label: "Key Lock" },
  { value: "deadbolt-lock", label: "Deadbolt Lock" },
  { value: "mortise-lock", label: "Mortise Lock" },
  { value: "sliding-door-lock", label: "Sliding Door Lock" },
  { value: "privacy-lock", label: "Privacy Lock" },
  { value: "passage-no-lock", label: "Passage / No Lock" },
  { value: "other", label: "Other / Based on Reference" },
]

const hingeOptions = [
  { value: "fjga-recommend", label: "Let FJGA Recommend" },
  { value: "standard-butt-hinges", label: "Standard Butt Hinges" },
  { value: "heavy-duty-hinges", label: "Heavy-Duty Hinges" },
  { value: "concealed-hinges", label: "Concealed Hinges" },
  { value: "pivot-hinges", label: "Pivot Hinges" },
  { value: "continuous-hinge", label: "Continuous / Piano Hinge" },
  { value: "floor-hinge", label: "Floor Hinge" },
  { value: "other", label: "Other / Based on Reference" },
]

const windowHandleOptions = [
  { value: "fjga-recommend", label: "Let FJGA Recommend" },
  { value: "standard-window-handle", label: "Standard Window Handle" },
  { value: "casement-handle", label: "Casement Handle" },
  { value: "sliding-window-grip", label: "Sliding Window Grip" },
  { value: "crank-handle", label: "Crank Handle" },
  { value: "flush-handle", label: "Flush Handle" },
  { value: "other", label: "Other / Based on Reference" },
]

const windowLockOptions = [
  { value: "fjga-recommend", label: "Let FJGA Recommend" },
  { value: "standard-latch", label: "Standard Latch" },
  { value: "sliding-window-lock", label: "Sliding Window Lock" },
  { value: "cam-lock", label: "Cam Lock" },
  { value: "crescent-lock", label: "Crescent Lock" },
  { value: "keyed-window-lock", label: "Keyed Window Lock" },
  { value: "other", label: "Other / Based on Reference" },
]

const windowHardwareOptions = [
  { value: "fjga-recommend", label: "Let FJGA Recommend" },
  { value: "standard-hardware", label: "Standard Hardware" },
  { value: "heavy-duty-rollers", label: "Heavy-Duty Rollers" },
  { value: "standard-rollers", label: "Standard Rollers" },
  { value: "friction-stay", label: "Friction Stay" },
  { value: "window-stopper", label: "Window Stopper" },
  { value: "other", label: "Other / Based on Reference" },
]

const generalHardwareOptions = [
  { value: "fjga-recommend", label: "Let FJGA Recommend" },
  { value: "standard", label: "Standard Hardware / Fittings" },
  { value: "heavy-duty", label: "Heavy-Duty Hardware / Fittings" },
  { value: "stainless-steel", label: "Stainless Steel Hardware" },
  { value: "concealed", label: "Concealed Hardware" },
  { value: "minimalist", label: "Minimalist Hardware" },
  { value: "other", label: "Other / Based on Reference" },
]

function convertToCentimeters(value: string, unit: DimensionUnit) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null
  }

  switch (unit) {
    case "mm":
      return numericValue / 10
    case "in":
      return numericValue * 2.54
    case "m":
      return numericValue * 100
    case "ft":
      return numericValue * 30.48
    case "cm":
    default:
      return numericValue
  }
}

function formatCentimeters(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2).replace(/\.?0+$/, "")
}

export function SpecificationsStep({
  category,
  data,
  onChange,
}: SpecificationsStepProps) {
  function updateField<K extends keyof SpecificationsData>(
    field: K,
    value: SpecificationsData[K]
  ) {
    onChange({
      ...data,
      [field]: value,
    })
  }

  function updateSpecification(key: string, value: string) {
    onChange({
      ...data,
      specifications: {
        ...data.specifications,
        [key]: value,
      },
    })
  }
  function DimensionField({
    id,
    label,
    value,
    unit,
    onChange,
    optional = false,
  }: {
    id: string
    label: string
    value: string
    unit: string
    onChange: (value: string) => void
    optional?: boolean
  }) {
    const centimeters = convertToCentimeters(value, unit as DimensionUnit)

    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {label}

          {optional && (
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          )}
        </Label>

        <div className="relative">
          <Input
            id={id}
            type="number"
            min="0"
            step="0.01"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="0"
            className="pr-14"
          />

          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </span>
        </div>

        {centimeters !== null && unit !== "cm" && (
          <p className="text-xs text-muted-foreground">
            ≈ {formatCentimeters(centimeters)} cm
          </p>
        )}
      </div>
    )
  }
  function PreferenceSelect({
    label,
    placeholder,
    value,
    options,
    onChange,
  }: {
    label: string
    placeholder: string
    value: string
    options: {
      value: string
      label: string
    }[]
    onChange: (value: string) => void
  }) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>

        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
  function SectionHeading({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ComponentType<{
      className?: string
    }>
    title: string
    description: string
  }) {
    return (
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div>
          <h3 className="font-semibold">{title}</h3>

          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    )
  }
  function DynamicSpecifications({
  category,
  specifications,
  onChange,
}: {
  category: ProductCategory | ""
  specifications: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  switch (category) {
    case "window":
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <SpecificationSelect
            label="Window Type"
            placeholder="Select window type"
            value={specifications.windowType ?? ""}
            options={[
              { value: "sliding", label: "Sliding" },
              { value: "casement", label: "Casement" },
              { value: "awning", label: "Awning" },
              { value: "fixed", label: "Fixed" },
              { value: "other", label: "Other / Based on Reference" },
            ]}
            onChange={(value) => onChange("windowType", value)}
          />

          <SpecificationSelect
            label="Number of Panels"
            placeholder="Select panel count"
            value={specifications.panelCount ?? ""}
            options={[
              { value: "1", label: "1 Panel" },
              { value: "2", label: "2 Panels" },
              { value: "3", label: "3 Panels" },
              { value: "4", label: "4 Panels" },
              { value: "5+", label: "5 or More Panels" },
              { value: "unsure", label: "Not Sure" },
            ]}
            onChange={(value) => onChange("panelCount", value)}
          />

          <SpecificationSelect
            label="Preferred Handle / Grip"
            placeholder="Select handle preference"
            value={specifications.windowHandlePreference ?? ""}
            options={windowHandleOptions}
            onChange={(value) =>
              onChange("windowHandlePreference", value)
            }
          />

          <SpecificationSelect
            label="Preferred Lock / Latch"
            placeholder="Select lock preference"
            value={specifications.windowLockPreference ?? ""}
            options={windowLockOptions}
            onChange={(value) =>
              onChange("windowLockPreference", value)
            }
          />

          <SpecificationSelect
            label="Preferred Window Hardware"
            placeholder="Select hardware preference"
            value={specifications.windowHardwarePreference ?? ""}
            options={windowHardwareOptions}
            onChange={(value) =>
              onChange("windowHardwarePreference", value)
            }
          />
        </div>
      )

    case "door":
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <SpecificationSelect
            label="Door Type"
            placeholder="Select door type"
            value={specifications.doorType ?? ""}
            options={[
              { value: "sliding", label: "Sliding" },
              { value: "swing", label: "Swing" },
              { value: "bifold", label: "Bi-fold" },
              { value: "other", label: "Other / Based on Reference" },
            ]}
            onChange={(value) => onChange("doorType", value)}
          />

          <SpecificationSelect
            label="Opening Direction"
            placeholder="Select opening direction"
            value={specifications.openingDirection ?? ""}
            options={[
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
              { value: "both", label: "Double / Both" },
              { value: "unsure", label: "Not Sure" },
            ]}
            onChange={(value) => onChange("openingDirection", value)}
          />

          <SpecificationSelect
            label="Preferred Handle / Knob"
            placeholder="Select handle or knob preference"
            value={specifications.handlePreference ?? ""}
            options={doorHandleOptions}
            onChange={(value) => onChange("handlePreference", value)}
          />

          <SpecificationSelect
            label="Preferred Lock"
            placeholder="Select lock preference"
            value={specifications.lockPreference ?? ""}
            options={doorLockOptions}
            onChange={(value) => onChange("lockPreference", value)}
          />

          <SpecificationSelect
            label="Preferred Hinges"
            placeholder="Select hinge preference"
            value={specifications.hingePreference ?? ""}
            options={hingeOptions}
            onChange={(value) => onChange("hingePreference", value)}
          />
        </div>
      )

    case "railing":
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <SpecificationSelect
            label="Railing Type"
            placeholder="Select railing type"
            value={specifications.railingType ?? ""}
            options={[
              { value: "glass", label: "Glass Railing" },
              { value: "aluminum", label: "Aluminum Railing" },
              {
                value: "glass-aluminum",
                label: "Glass with Aluminum Frame",
              },
              { value: "other", label: "Other / Based on Reference" },
            ]}
            onChange={(value) => onChange("railingType", value)}
          />

          <SpecificationSelect
            label="Installation Area"
            placeholder="Select installation area"
            value={specifications.installationArea ?? ""}
            options={[
              { value: "stairs", label: "Stairs" },
              { value: "balcony", label: "Balcony" },
              { value: "terrace", label: "Terrace" },
              { value: "other", label: "Other" },
            ]}
            onChange={(value) => onChange("installationArea", value)}
          />

          <SpecificationSelect
            label="Preferred Railing Hardware / Fittings"
            placeholder="Select hardware preference"
            value={specifications.railingHardwarePreference ?? ""}
            options={generalHardwareOptions}
            onChange={(value) =>
              onChange("railingHardwarePreference", value)
            }
          />
        </div>
      )

    case "partition":
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <SpecificationSelect
            label="Partition Type"
            placeholder="Select partition type"
            value={specifications.partitionType ?? ""}
            options={[
              { value: "fixed", label: "Fixed" },
              { value: "sliding", label: "Sliding" },
              { value: "folding", label: "Folding" },
              { value: "other", label: "Other / Based on Reference" },
            ]}
            onChange={(value) => onChange("partitionType", value)}
          />

          <SpecificationSelect
            label="Primary Use"
            placeholder="Select primary use"
            value={specifications.primaryUse ?? ""}
            options={[
              { value: "office", label: "Office" },
              { value: "residential", label: "Residential" },
              { value: "commercial", label: "Commercial" },
              { value: "other", label: "Other" },
            ]}
            onChange={(value) => onChange("primaryUse", value)}
          />

          <SpecificationSelect
            label="Preferred Handle / Knob"
            placeholder="Select handle preference"
            value={specifications.partitionHandlePreference ?? ""}
            options={doorHandleOptions}
            onChange={(value) =>
              onChange("partitionHandlePreference", value)
            }
          />

          <SpecificationSelect
            label="Preferred Lock / Latch"
            placeholder="Select lock preference"
            value={specifications.partitionLockPreference ?? ""}
            options={doorLockOptions}
            onChange={(value) =>
              onChange("partitionLockPreference", value)
            }
          />

          <SpecificationSelect
            label="Preferred Hinges / Hardware"
            placeholder="Select hardware preference"
            value={specifications.partitionHardwarePreference ?? ""}
            options={generalHardwareOptions}
            onChange={(value) =>
              onChange("partitionHardwarePreference", value)
            }
          />
        </div>
      )

    case "table":
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <SpecificationSelect
            label="Table Shape"
            placeholder="Select table shape"
            value={specifications.tableShape ?? ""}
            options={[
              { value: "rectangular", label: "Rectangular" },
              { value: "square", label: "Square" },
              { value: "round", label: "Round" },
              {
                value: "custom",
                label: "Custom / Based on Reference",
              },
            ]}
            onChange={(value) => onChange("tableShape", value)}
          />

          <SpecificationSelect
            label="Preferred Table Hardware / Fittings"
            placeholder="Select hardware preference"
            value={specifications.tableHardwarePreference ?? ""}
            options={generalHardwareOptions}
            onChange={(value) =>
              onChange("tableHardwarePreference", value)
            }
          />
        </div>
      )

    case "chair":
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <SpecificationSelect
            label="Chair Type"
            placeholder="Select chair type"
            value={specifications.chairType ?? ""}
            options={[
              { value: "dining", label: "Dining Chair" },
              { value: "office", label: "Office Chair" },
              { value: "stool", label: "Stool" },
              {
                value: "custom",
                label: "Custom / Based on Reference",
              },
            ]}
            onChange={(value) => onChange("chairType", value)}
          />

          <SpecificationSelect
            label="Preferred Chair Hardware / Fittings"
            placeholder="Select hardware preference"
            value={specifications.chairHardwarePreference ?? ""}
            options={generalHardwareOptions}
            onChange={(value) =>
              onChange("chairHardwarePreference", value)
            }
          />
        </div>
      )

    case "other":
      return (
        <div className="space-y-5">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Because this is a custom item outside the standard categories,
              FJGA will primarily use your project description and reference
              images to understand the design.
            </p>
          </div>

          <SpecificationSelect
            label="Preferred Hardware / Accessories"
            placeholder="Select hardware preference"
            value={specifications.otherHardwarePreference ?? ""}
            options={generalHardwareOptions}
            onChange={(value) =>
              onChange("otherHardwarePreference", value)
            }
          />
        </div>
      )

    default:
      return null
  }
}
  function SpecificationSelect({
    label,
    placeholder,
    value,
    options,
    onChange,
  }: {
    label: string
    placeholder: string
    value: string
    options: {
      value: string
      label: string
    }[]
    onChange: (value: string) => void
  }) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>

        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Dimensions */}
      <section className="space-y-5">
        <SectionHeading
          icon={Ruler}
          title="Dimensions"
          description="Provide the approximate size of the item you want FJGA to build."
        />

        <div className="space-y-2">
          <Label>Measurement Unit</Label>

          <Select
            value={data.dimensionUnit}
            onValueChange={(value: DimensionUnit) =>
              updateField("dimensionUnit", value)
            }
          >
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="cm">Centimeters (cm)</SelectItem>

              <SelectItem value="mm">Millimeters (mm)</SelectItem>

              <SelectItem value="in">Inches (in)</SelectItem>

              <SelectItem value="m">Meters (m)</SelectItem>

              <SelectItem value="ft">Feet (ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DimensionField
            id="width"
            label="Width"
            value={data.width}
            unit={data.dimensionUnit}
            onChange={(value) => updateField("width", value)}
          />

          <DimensionField
            id="height"
            label="Height"
            value={data.height}
            unit={data.dimensionUnit}
            onChange={(value) => updateField("height", value)}
          />

          <DimensionField
            id="depth"
            label="Depth"
            value={data.depth}
            unit={data.dimensionUnit}
            onChange={(value) => updateField("depth", value)}
            optional
          />
        </div>

        <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
          <Checkbox
            id="approximate-measurements"
            checked={data.measurementsApproximate}
            onCheckedChange={(checked) =>
              updateField("measurementsApproximate", checked === true)
            }
          />

          <div className="grid gap-1">
            <Label
              htmlFor="approximate-measurements"
              className="cursor-pointer"
            >
              These measurements are approximate
            </Label>

            <p className="text-sm leading-5 text-muted-foreground">
              That's okay. FJGA can verify the final measurements before
              fabrication.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t" />

      {/* Dynamic Product Specifications */}
      <section className="space-y-5">
        <SectionHeading
          icon={Info}
          title="Product Specifications"
          description="Provide a few additional details about how you want the item configured."
        />

        <DynamicSpecifications
          category={category}
          specifications={data.specifications}
          onChange={updateSpecification}
        />
      </section>

      <div className="border-t" />

      {/* Material Preferences */}
      <section className="space-y-5">
        <SectionHeading
          icon={Sparkles}
          title="Material Preferences"
          description="Tell us which materials or finishes you prefer. These are preferences only and will be reviewed by FJGA."
        />

        <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
          <Checkbox
            id="fjga-recommend"
            checked={data.letFjgaRecommend}
            onCheckedChange={(checked) =>
              updateField("letFjgaRecommend", checked === true)
            }
          />

          <div className="grid gap-1">
            <Label htmlFor="fjga-recommend" className="cursor-pointer">
              I'm not sure — let FJGA recommend suitable materials
            </Label>

            <p className="text-sm leading-5 text-muted-foreground">
              Our team can recommend materials based on your design, intended
              use, and budget.
            </p>
          </div>
        </div>

        {!data.letFjgaRecommend && (
          <div className="grid gap-5 md:grid-cols-3">
            <PreferenceSelect
              label="Preferred Frame / Aluminum"
              placeholder="Select aluminum"
              value={data.preferredFrame}
              options={frameOptions}
              onChange={(value) => updateField("preferredFrame", value)}
            />

            <PreferenceSelect
              label="Preferred Glass"
              placeholder="Select glass"
              value={data.preferredGlass}
              options={glassOptions}
              onChange={(value) => updateField("preferredGlass", value)}
            />

            <PreferenceSelect
              label="Preferred Finish / Color"
              placeholder="Select finish"
              value={data.preferredFinish}
              options={finishOptions}
              onChange={(value) => updateField("preferredFinish", value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="other-preferences">Other Preferences</Label>

          <Textarea
            id="other-preferences"
            value={data.otherPreferences}
            onChange={(event) =>
              updateField("otherPreferences", event.target.value)
            }
            placeholder="Example: I prefer a modern minimalist appearance, black framing, and materials suitable for outdoor exposure."
            className="min-h-[120px] resize-y"
            maxLength={1000}
          />

          <div className="flex justify-between gap-4 text-xs text-muted-foreground">
            <p>
              Add anything else FJGA should consider when preparing the
              quotation.
            </p>

            <span>{data.otherPreferences.length}/1000</span>
          </div>
        </div>
      </section>
    </div>
  )
}
