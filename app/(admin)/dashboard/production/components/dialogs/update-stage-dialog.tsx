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

interface Props {
  project: ProductionProject | null

  open: boolean

  onOpenChange: (open: boolean) => void

  onStageChange: (stage: string, notes?: string) => void
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

  useEffect(() => {
    if (project) {
      setStage(project.stage)
      setNotes("")
    }
  }, [project])

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle>Update production stage</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Move this order to another production stage and optionally leave a
            note for the production team.
          </p>
        </DialogHeader>

        <div className="space-y-2 py-2">
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
            disabled={saving || stage === project.stage}
            onClick={async () => {
              setSaving(true)

              try {
                await onStageChange(stageToDb[stage], notes)
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
