"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName?: string
  onConfirm: (
    assignedTo: string,
    estimatedCompletionDate: string
  ) => Promise<void>
}

export default function StartProductionDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
}: Props) {
  const [assignedTo, setAssignedTo] = useState("")
  const [estimatedCompletionDate, setEstimatedCompletionDate] =
    useState("")
  const [saving, setSaving] = useState(false)

  const handleConfirm = async () => {
    if (!assignedTo || !estimatedCompletionDate) return

    setSaving(true)

    await onConfirm(assignedTo, estimatedCompletionDate)

    setSaving(false)

    setAssignedTo("")
    setEstimatedCompletionDate("")

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start Production</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Assign this order to production and set the expected
            completion date.
          </p>

          {projectName && (
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">
                Product
              </p>
              <p className="font-semibold">{projectName}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Assigned Staff / Team
            </label>
            <Input
              placeholder="e.g. Team A or Juan Dela Cruz"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Estimated Completion Date
            </label>
            <Input
              type="date"
              value={estimatedCompletionDate}
              onChange={(e) =>
                setEstimatedCompletionDate(e.target.value)
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={handleConfirm}
            disabled={
              saving ||
              !assignedTo ||
              !estimatedCompletionDate
            }
          >
            {saving ? "Starting Production..." : "Start Production"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}