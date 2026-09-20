"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Loader2 } from "lucide-react"

interface CompleteInspectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: CompleteInspectionData) => Promise<void>
}

export interface CompleteInspectionData {
  inspectionResult:
    | "damage_confirmed"
    | "no_issue"
    | "not_covered"

  damageConfirmed: boolean

  damageDescription: string

  resolutionType:
    | "repair"
    | "replacement"
    | "no_action"

  resolutionNotes: string
}

const defaultForm: CompleteInspectionData = {
  inspectionResult: "damage_confirmed",
  damageConfirmed: true,
  damageDescription: "",
  resolutionType: "replacement",
  resolutionNotes: "",
}

export default function CompleteInspectionDialog({
  open,
  onOpenChange,
  onComplete,
}: CompleteInspectionDialogProps) {
  const [form, setForm] =
    useState<CompleteInspectionData>(defaultForm)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    setForm(defaultForm)
    setSaving(false)
    setError(null)
  }, [open])

  function updateForm<K extends keyof CompleteInspectionData>(
    key: K,
    value: CompleteInspectionData[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  async function handleSubmit() {
    setError(null)

    if (!form.damageDescription.trim()) {
      setError("Please describe what was found during the inspection.")
      return
    }

    if (form.damageDescription.trim().length < 10) {
      setError(
        "Please provide a more detailed inspection description."
      )
      return
    }

    if (!form.resolutionNotes.trim()) {
      setError("Please provide the resolution notes.")
      return
    }

    if (form.resolutionNotes.trim().length < 10) {
      setError(
        "Please provide more detailed resolution notes."
      )
      return
    }

    try {
      setSaving(true)

      await onComplete({
        inspectionResult: form.inspectionResult,
        damageConfirmed: form.damageConfirmed,
        damageDescription: form.damageDescription.trim(),
        resolutionType: form.resolutionType,
        resolutionNotes: form.resolutionNotes.trim(),
      })

      onOpenChange(false)
    } catch (err) {
      console.error(
        "Failed to complete inspection:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete the inspection."
      )
    } finally {
      setSaving(false)
    }
  }

  function handleInspectionResultChange(
    value: CompleteInspectionData["inspectionResult"]
  ) {
    updateForm("inspectionResult", value)

    if (value === "damage_confirmed") {
      updateForm("damageConfirmed", true)
      return
    }

    updateForm("damageConfirmed", false)

    if (value === "no_issue") {
      updateForm("resolutionType", "no_action")
    }

    if (value === "not_covered") {
      updateForm("resolutionType", "no_action")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (saving) return

        onOpenChange(value)
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Complete Inspection
          </DialogTitle>

          <DialogDescription>
            Record the findings of the physical inspection
            and determine the appropriate resolution.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label>
              Inspection Result
            </Label>

            <Select
              value={form.inspectionResult}
              onValueChange={handleInspectionResultChange}
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select inspection result" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="damage_confirmed">
                  Damage Confirmed
                </SelectItem>

                <SelectItem value="no_issue">
                  No Issue Found
                </SelectItem>

                <SelectItem value="not_covered">
                  Not Covered
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Damage Confirmed
            </Label>

            <Select
              value={
                form.damageConfirmed
                  ? "yes"
                  : "no"
              }
              onValueChange={(value) =>
                updateForm(
                  "damageConfirmed",
                  value === "yes"
                )
              }
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="yes">
                  Yes
                </SelectItem>

                <SelectItem value="no">
                  No
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="damage-description">
              Inspection Findings
            </Label>

            <Textarea
              id="damage-description"
              placeholder="Describe what was found during the physical inspection..."
              value={form.damageDescription}
              onChange={(event) =>
                updateForm(
                  "damageDescription",
                  event.target.value
                )
              }
              disabled={saving}
              rows={5}
            />

            <p className="text-xs text-muted-foreground">
              Include the affected component, type of
              damage, and any relevant measurements or
              observations.
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Resolution
            </Label>

            <Select
              value={form.resolutionType}
              onValueChange={(value) =>
                updateForm(
                  "resolutionType",
                  value as CompleteInspectionData["resolutionType"]
                )
              }
              disabled={
                saving ||
                form.inspectionResult === "no_issue" ||
                form.inspectionResult === "not_covered"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="repair">
                  Repair
                </SelectItem>

                <SelectItem value="replacement">
                  Replacement
                </SelectItem>

                <SelectItem value="no_action">
                  No Action
                </SelectItem>
              </SelectContent>
            </Select>

            {(form.inspectionResult === "no_issue" ||
              form.inspectionResult === "not_covered") && (
              <p className="text-xs text-muted-foreground">
                No action is automatically selected because
                the inspection did not confirm a qualifying
                damage.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolution-notes">
              Resolution Notes
            </Label>

            <Textarea
              id="resolution-notes"
              placeholder="Describe the work that should be performed..."
              value={form.resolutionNotes}
              onChange={(event) =>
                updateForm(
                  "resolutionNotes",
                  event.target.value
                )
              }
              disabled={saving}
              rows={5}
            />

            <p className="text-xs text-muted-foreground">
              These notes will be used when the repair or
              replacement work is prepared.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {saving
              ? "Completing..."
              : "Complete Inspection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}