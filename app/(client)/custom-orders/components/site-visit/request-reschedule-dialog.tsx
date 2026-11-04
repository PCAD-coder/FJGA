"use client"

import { useState } from "react"
import { CalendarClock } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { SiteVisitTimeSlot } from "../../types/site-visit"

interface RequestRescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    preferredDate: string,
    preferredTimeSlot: SiteVisitTimeSlot,
    notes: string
  ) => Promise<void>
}

export function RequestRescheduleDialog({
  open,
  onOpenChange,
  onSubmit,
}: RequestRescheduleDialogProps) {
  const [preferredDate, setPreferredDate] = useState("")
  const [preferredTimeSlot, setPreferredTimeSlot] =
    useState<SiteVisitTimeSlot>("morning")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    if (!preferredDate || isSubmitting) return

    try {
      setIsSubmitting(true)

      await onSubmit(preferredDate, preferredTimeSlot, notes)

      setPreferredDate("")
      setPreferredTimeSlot("morning")
      setNotes("")
      onOpenChange(false)
    } catch {
      // Parent component handles the error notification.
    } finally {
      setIsSubmitting(false)
    }
  }

  const todayInManila = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

  const minimumDate = new Date(
    `${todayInManila}T00:00:00+08:00`
  )

  minimumDate.setUTCDate(minimumDate.getUTCDate() + 1)

  const minDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(minimumDate)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Request Another Schedule
          </DialogTitle>

          <DialogDescription>
            Choose another preferred date and time slot.
            FJGA will review your request before confirming
            the appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="reschedule-date">
              Preferred Date
            </Label>

            <Input
              id="reschedule-date"
              type="date"
              min={minDate}
              value={preferredDate}
              onChange={(event) =>
                setPreferredDate(event.target.value)
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reschedule-time-slot">
              Preferred Time Slot
            </Label>

            <select
              id="reschedule-time-slot"
              value={preferredTimeSlot}
              onChange={(event) =>
                setPreferredTimeSlot(
                  event.target.value as SiteVisitTimeSlot
                )
              }
              disabled={isSubmitting}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="morning">
                Morning (8:00 AM – 12:00 PM)
              </option>
              <option value="afternoon">
                Afternoon (1:00 PM – 5:00 PM)
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reschedule-notes">
              Reason or Notes (Optional)
            </Label>

            <Textarea
              id="reschedule-notes"
              placeholder="Example: I am not available on the proposed date."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!preferredDate || preferredDate < minDate || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}