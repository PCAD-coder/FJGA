"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  onConfirm: (
    date: string,
    time: string,
    assignedStaff: string,
    notes: string
  ) => void

  requestTitle?: string
}

export default function ScheduleInspectionDialog({
  open,
  onOpenChange,
  onConfirm,
  requestTitle,
}: Props) {
  const [date, setDate] =
    useState("")

  const [time, setTime] =
    useState("")

  const [assignedStaff,
    setAssignedStaff] =
    useState("")

  const [notes, setNotes] =
    useState("")

  const handleSchedule = () => {
    onConfirm(
      date,
      time,
      assignedStaff,
      notes
    )

    setDate("")
    setTime("")
    setAssignedStaff("")
    setNotes("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Schedule Inspection
          </DialogTitle>

          <DialogDescription>
            Set an inspection schedule
            for this return request.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-4">

          <div className="rounded-lg border p-4">

            <p className="text-sm text-muted-foreground">
              Request
            </p>

            <p className="font-medium">
              {requestTitle}
            </p>

          </div>

          <Input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
          />

          <Input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(
                e.target.value
              )
            }
          />

          <Input
            placeholder="Assigned Staff (optional)"
            value={assignedStaff}
            onChange={(e) =>
              setAssignedStaff(
                e.target.value
              )
            }
          />

          <Input
            placeholder="Inspection Notes"
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
          />

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleSchedule
            }
          >
            Schedule
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}