"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { ProductionProject } from "../../types/production"
import { Textarea } from "@/components/ui/textarea"

import {
  getProductionReplacementMaterials,
  type ProductionReplacementMaterial,
} from "../../services/production"

interface Props {
  project: ProductionProject | null

  open: boolean

  onOpenChange: (open: boolean) => void

  onStageChange: (
    stage: string,
    notes?: string,
    replacement?: {
      orderItemId: string
      materialId: string
      quantity: number
      reason: string
    }
  ) => void
}

const stageToDb: Record<string, string> = {
  Pending: "pending",
  "Material Prep": "material_prep",
  "Glass Cutting": "glass_cutting",
  "Frame Fabrication": "frame_fabrication",
  Assembly: "assembly",
  Finishing: "finishing",
  "Quality Check": "quality_check",
  "Ready for Delivery": "ready_for_delivery",
}

const dbToStage: Record<string, string> = {
  pending: "Pending",
  material_prep: "Material Prep",
  glass_cutting: "Glass Cutting",
  frame_fabrication: "Frame Fabrication",
  assembly: "Assembly",
  finishing: "Finishing",
  quality_check: "Quality Check",
  ready_for_delivery: "Ready for Delivery",
}

export default function UpdateStageDialog({
  project,
  open,
  onOpenChange,
  onStageChange,
}: Props) {
  const [stage, setStage] = useState("Pending")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const [replacement, setReplacement] = useState(false)
  const [replacementMaterialId, setReplacementMaterialId] = useState("")
  const [replacementQuantity, setReplacementQuantity] = useState("")
  const [replacementReason, setReplacementReason] = useState("")

  const [replacementMaterials, setReplacementMaterials] = useState<
    ProductionReplacementMaterial[]
  >([])

  const [replacementMaterialUnit, setReplacementMaterialUnit] = useState("")

  const [loadingReplacementMaterials, setLoadingReplacementMaterials] =
    useState(false)

  useEffect(() => {
    if (project) {
      setStage(project.stage)
      setNotes("")
      setReplacement(false)
      setReplacementMaterialId("")
      setReplacementQuantity("")
      setReplacementReason("")
      setReplacementMaterialUnit("")
      setReplacementMaterials([])
    }
  }, [project])
  useEffect(() => {
    if (!replacement || !project) {
      setReplacementMaterials([])
      return
    }
    const projectId = project.id

    let cancelled = false

    async function loadReplacementMaterials() {
      try {
        setLoadingReplacementMaterials(true)

        const materials = await getProductionReplacementMaterials(projectId)

        if (!cancelled) {
          setReplacementMaterials(materials)
        }
      } catch (error) {
        console.error("Failed to load replacement materials:", error)

        if (!cancelled) {
          setReplacementMaterials([])
        }
      } finally {
        if (!cancelled) {
          setLoadingReplacementMaterials(false)
        }
      }
    }

    loadReplacementMaterials()

    return () => {
      cancelled = true
    }
  }, [replacement, project])

  if (!project) return null
  const currentStageDb = stageToDb[project.stage]
  const selectedStageDb = stageToDb[stage]

  const stageOrder: Record<string, number> = {
    pending: 0,
    material_prep: 1,
    glass_cutting: 2,
    frame_fabrication: 3,
    assembly: 4,
    finishing: 5,
    quality_check: 6,
    ready_for_delivery: 7,
  }

  const isGoingBackward =
    stageOrder[selectedStageDb] < stageOrder[currentStageDb]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle>Update production stage</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Move this order to another production stage and optionally leave a
            note for the production team.
          </p>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto py-2 pr-2">
          {/* Current stage summary */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Current stage
            </p>
            <p className="mt-1 text-base font-semibold">{project.stage}</p>
          </div>

          {/* New stage */}
          <div className="space-y-2">
            <p className="text-sm font-medium">New stage</p>

            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a production stage" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Material Prep">Material Prep</SelectItem>
                <SelectItem value="Glass Cutting">Glass Cutting</SelectItem>
                <SelectItem value="Frame Fabrication">
                  Frame Fabrication
                </SelectItem>
                <SelectItem value="Assembly">Assembly</SelectItem>
                <SelectItem value="Finishing">Finishing</SelectItem>
                <SelectItem value="Quality Check">Quality Check</SelectItem>
                <SelectItem value="Ready for Delivery">
                  Ready for Delivery
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isGoingBackward && (
            <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
              <div>
                <p className="text-sm font-semibold">Material replacement</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Use this when a material was damaged or needs to be replaced
                  while returning the order to an earlier production stage.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                <div>
                  <p className="text-sm font-medium">Replace a material</p>

                  <p className="text-xs text-muted-foreground">
                    Deduct the replacement material from inventory.
                  </p>
                </div>

                <Button
                  type="button"
                  variant={replacement ? "default" : "outline"}
                  onClick={() => {
                    setReplacement((value) => !value)

                    if (replacement) {
                      setReplacementMaterialId("")
                      setReplacementQuantity("")
                    }
                  }}
                >
                  {replacement ? "Enabled" : "Enable"}
                </Button>
              </div>

              {replacement && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Replacement material</p>

                    <Select
                      value={replacementMaterialId}
                      onValueChange={(value) => {
                        setReplacementMaterialId(value)

                        const selectedMaterial = replacementMaterials.find(
                          (material) => material.id === value
                        )

                        if (selectedMaterial) {
                          setReplacementMaterialUnit(selectedMaterial.unit)
                          setReplacementQuantity(
                            String(selectedMaterial.snapshotQuantity)
                          )
                        } else {
                          setReplacementMaterialUnit("")
                          setReplacementQuantity("")
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>

                      <SelectContent>
                        {loadingReplacementMaterials ? (
                          <SelectItem value="loading" disabled>
                            Loading materials...
                          </SelectItem>
                        ) : replacementMaterials.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            No order materials available
                          </SelectItem>
                        ) : (
                          replacementMaterials.map((material) => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.material_name}
                              {material.specification
                                ? ` — ${material.specification}`
                                : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Replacement quantity</p>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.0001"
                        value={replacementQuantity}
                        onChange={(e) => setReplacementQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                      />

                      <div className="flex h-10 min-w-[100px] items-center justify-center rounded-md border bg-muted px-3 text-sm font-medium">
                        {replacementMaterialUnit || "Unit"}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      The quantity is automatically based on the material
                      requirement for this order. Adjust it only if the actual
                      replacement amount is different.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Replacement reason</p>

                    <Textarea
                      placeholder="Example: Glass cracked during assembly and needs to be replaced."
                      className="min-h-[90px] resize-none"
                      value={replacementReason}
                      onChange={(e) => setReplacementReason(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Production notes</p>

            <Textarea
              placeholder="Add notes about delays, defects, material changes, or handoff instructions."
              className="min-h-[120px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            disabled={
              saving ||
              stage === project.stage ||
              (replacement &&
                (!replacementMaterialId ||
                  !replacementQuantity ||
                  Number(replacementQuantity) <= 0))
            }
            onClick={async () => {
              setSaving(true)

              try {
                const finalNotes = replacementReason.trim()
                  ? `${notes.trim()}${
                      notes.trim() ? "\n\n" : ""
                    }Replacement reason: ${replacementReason.trim()}`
                  : notes

                await onStageChange(
                  stageToDb[stage],
                  finalNotes,
                  replacement
                    ? {
                        orderItemId: project.orderItemId,
                        materialId: replacementMaterialId,
                        quantity: Number(replacementQuantity),
                        reason: replacementReason,
                      }
                    : undefined
                )
                setNotes("")
                onOpenChange(false)
              } finally {
                setSaving(false)
              }
            }}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
