"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { Textarea } from "@/components/ui/textarea"

import type { ReturnResolutionType } from "../types/return"

export interface ResolutionDialogData {
  resolutionType: ReturnResolutionType
  resolutionNotes: string
}

interface ResolutionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue: (data: ResolutionDialogData) => Promise<void>
}

export default function ResolutionDialog({
  open,
  onOpenChange,
  onContinue,
}: ResolutionDialogProps) {
  const [resolutionType, setResolutionType] =
    useState<ReturnResolutionType>("replacement")

  const [resolutionNotes, setResolutionNotes] =
    useState("")

  const [error, setError] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)

  function resetForm() {
    setResolutionType("replacement")
    setResolutionNotes("")
    setError(null)
  }

  function handleOpenChange(value: boolean) {
    if (!value && !saving) {
      resetForm()
    }

    onOpenChange(value)
  }

  async function handleSubmit() {
    setError(null)

    if (resolutionNotes.trim().length < 10) {
      setError(
        "Resolution notes must be at least 10 characters."
      )
      return
    }

    try {
      setSaving(true)

      await onContinue({
        resolutionType,
        resolutionNotes: resolutionNotes.trim(),
      })

      resetForm()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save the resolution."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            Set Return Resolution
          </DialogTitle>

          <DialogDescription>
            Select what should happen after the physical
            inspection has been completed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Resolution
            </label>

            <Select
              value={resolutionType}
              onValueChange={(value) =>
                setResolutionType(
                  value as ReturnResolutionType
                )
              }
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="replacement">
                  Replacement
                </SelectItem>

                <SelectItem value="repair">
                  Repair
                </SelectItem>

                <SelectItem value="no_action">
                  No Action
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Resolution Notes
            </label>

            <Textarea
              value={resolutionNotes}
              onChange={(event) =>
                setResolutionNotes(event.target.value)
              }
              placeholder="Explain the resolution and the work required..."
              rows={5}
              disabled={saving}
            />

            <p className="text-xs text-muted-foreground">
              Provide enough detail for the next stage of
              the return process.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}