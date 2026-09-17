"use client"

import { useEffect, useState } from "react"

import type { Delivery } from "../types/delivery"

import { scheduleDelivery } from "../services/delivery-schedule-actions"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ScheduleDeliveryDialogProps {
  delivery: Delivery | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export default function ScheduleDeliveryDialog({
  delivery,
  open,
  onOpenChange,
  onSaved,
}: ScheduleDeliveryDialogProps) {

  // Get today's date in local time
  const getToday = () => {
    const date = new Date()

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  // Get current time in local time
  const getCurrentTime = () => {
    const date = new Date()

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${hours}:${minutes}`
  }

  const today = getToday()

  const [currentTime, setCurrentTime] = useState(
    getCurrentTime()
  )

  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [assignedDriver, setAssignedDriver] = useState("")
  const [assignedTruck, setAssignedTruck] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Keep currentTime updated every minute
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(getCurrentTime())
    }

    updateCurrentTime()

    const interval = setInterval(
      updateCurrentTime,
      60 * 1000
    )

    return () => clearInterval(interval)
  }, [])

  // Load existing delivery data
  useEffect(() => {
    if (!delivery || !open) {
      return
    }

    setScheduledDate(
      delivery.deliveryDate ?? ""
    )

    setScheduledTime(
      delivery.deliveryTime ?? ""
    )

    setAssignedDriver(
      delivery.assignedDriver ?? ""
    )

    setAssignedTruck(
      delivery.assignedTruck ?? ""
    )

    setDeliveryNotes(
      delivery.deliveryNotes ?? ""
    )

    setError(null)
  }, [delivery, open])

  if (!delivery) {
    return null
  }

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDate = event.target.value

    setScheduledDate(newDate)
    setError(null)

    // If changing to today and the currently selected
    // time is already in the past, clear it.
    if (
      newDate === today &&
      scheduledTime &&
      scheduledTime < currentTime
    ) {
      setScheduledTime("")
    }
  }

  const handleSave = async () => {
    if (!scheduledDate) {
      setError("Please select a delivery date.")
      return
    }

    if (scheduledDate < today) {
      setError("Delivery date cannot be in the past.")
      return
    }

    if (!scheduledTime) {
      setError("Please select a delivery time.")
      return
    }

    // If delivery is today, make sure the time isn't past
    if (
      scheduledDate === today &&
      scheduledTime < currentTime
    ) {
      setError("Delivery time cannot be in the past.")
      return
    }

    try {
      setSaving(true)
      setError(null)

      await scheduleDelivery({
        deliveryId: delivery.id,
        scheduledDate,
        scheduledTime,
        assignedDriver:
          assignedDriver.trim() || null,
        assignedTruck:
          assignedTruck.trim() || null,
        deliveryNotes:
          deliveryNotes.trim() || null,
      })

      onOpenChange(false)
      onSaved()
    } catch (error) {
      console.error(
        "Failed to schedule delivery:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to schedule delivery"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">

        <DialogHeader>
          <DialogTitle>
            Schedule Delivery
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          {/* PROJECT */}
          <div>
            <p className="text-sm text-muted-foreground">
              Project
            </p>

            <p className="font-medium">
              {delivery.projectName}
            </p>
          </div>

          {/* DATE */}
          <div className="space-y-2">
            <Label htmlFor="delivery-date">
              Delivery Date
            </Label>

            <Input
              id="delivery-date"
              type="date"
              min={today}
              value={scheduledDate}
              onChange={handleDateChange}
            />
          </div>

          {/* TIME */}
          <div className="space-y-2">
            <Label htmlFor="delivery-time">
              Delivery Time
            </Label>

            <Input
              id="delivery-time"
              type="time"
              min={
                scheduledDate === today
                  ? currentTime
                  : undefined
              }
              value={scheduledTime}
              onChange={(event) => {
                setScheduledTime(
                  event.target.value
                )
                setError(null)
              }}
            />
          </div>

          {/* TRUCK */}
          <div className="space-y-2">
            <Label htmlFor="assigned-truck">
              Assigned Truck
            </Label>

            <Input
              id="assigned-truck"
              placeholder="e.g. Truck 01"
              value={assignedTruck}
              onChange={(event) =>
                setAssignedTruck(
                  event.target.value
                )
              }
            />
          </div>

          {/* DRIVER */}
          <div className="space-y-2">
            <Label htmlFor="assigned-driver">
              Assigned Driver
            </Label>

            <Input
              id="assigned-driver"
              placeholder="e.g. Juan Dela Cruz"
              value={assignedDriver}
              onChange={(event) =>
                setAssignedDriver(
                  event.target.value
                )
              }
            />
          </div>

          {/* NOTES */}
          <div className="space-y-2">
            <Label htmlFor="delivery-notes">
              Delivery Notes
            </Label>

            <Textarea
              id="delivery-notes"
              placeholder="Add delivery instructions or notes..."
              value={deliveryNotes}
              onChange={(event) =>
                setDeliveryNotes(
                  event.target.value
                )
              }
              rows={4}
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Schedule"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}