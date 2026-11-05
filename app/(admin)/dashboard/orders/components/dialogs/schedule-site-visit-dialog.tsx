
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/error-message"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getActiveEmployees } from "../../../user-management/services/personnel.service"
import type { Employee } from "../../../user-management/types/personnel"
import type { SiteVisit, SiteVisitTimeSlot } from "../../types/site-visit"

interface Props {
  visit: SiteVisit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule: (
    id: string,
    scheduledAt: string,
    assignedStaff: string
  ) => Promise<void>
  onProposeSchedule: (
    id: string,
    scheduledAt: string,
    assignedStaff: string
  ) => Promise<void>
  onAcceptClientProposal: (
    proposalId: string,
    scheduledAt: string,
    assignedStaff: string
  ) => Promise<void>
}

function getManilaDateTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)

  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? ""

  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`
}

function getTimeSlot(time: string): SiteVisitTimeSlot | null {
  if (time >= "08:00" && time < "12:00") return "morning"
  if (time >= "13:00" && time < "17:00") return "afternoon"
  return null
}

function toManilaISOString(value: string): string {
  const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

  if (!pattern.test(value)) {
    throw new Error("Please select a valid appointment date and time.")
  }

  const date = new Date(`${value}:00+08:00`)

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid appointment date and time.")
  }

  if (getManilaDateTime(date.toISOString()) !== value) {
    throw new Error("Invalid appointment date and time.")
  }

  return date.toISOString()
}

export default function ScheduleSiteVisitDialog({
  visit,
  open,
  onOpenChange,
  onSchedule,
  onProposeSchedule,
  onAcceptClientProposal,
}: Props) {
  const [scheduledAt, setScheduledAt] = useState("")
  const [assignedStaff, setAssignedStaff] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [saving, setSaving] = useState(false)

  const clientProposal =
    visit?.status === "pending" &&
    visit.pendingProposal?.proposedByRole === "client"
      ? visit.pendingProposal
      : null

  const selectedDate = scheduledAt.slice(0, 10)
  const selectedTime = scheduledAt.slice(11, 16)
  const selectedSlot = getTimeSlot(selectedTime)

  const preferredDate = clientProposal
    ? clientProposal.proposedDate
    : visit?.preferredDate

  const preferredSlot = clientProposal
    ? clientProposal.proposedTimeSlot
    : visit?.preferredTimeSlot

  const matchesPreference =
    selectedDate === preferredDate &&
    selectedSlot !== null &&
    selectedSlot === preferredSlot

  const action = clientProposal
    ? "accept-client-proposal"
    : matchesPreference
      ? "confirm"
      : "propose"

  useEffect(() => {
    if (!open || !visit) return

    setAssignedStaff(visit.assignedStaff ?? "")

    if (clientProposal) {
      const initialTime =
        clientProposal.proposedTimeSlot === "morning"
          ? "08:00"
          : "13:00"

      setScheduledAt(
        `${clientProposal.proposedDate}T${initialTime}`
      )
    } else if (visit.scheduledAt) {
      setScheduledAt(getManilaDateTime(visit.scheduledAt))
    } else {
      const initialTime =
        visit.preferredTimeSlot === "morning"
          ? "08:00"
          : "13:00"

      setScheduledAt(
        `${visit.preferredDate}T${initialTime}`
      )
    }
  }, [open, visit, clientProposal])

  useEffect(() => {
    if (!open) return

    async function loadEmployees() {
      try {
        setLoadingEmployees(true)
        const data = await getActiveEmployees()
        setEmployees(
          data.filter(
            (employee) =>
              employee.position?.trim().replace(/\s+/g, " ").toLowerCase() ===
              "on-site measurement staff"
          )
        )
      } catch (error) {
        console.error("Failed to load employees:", error)
        toast.error(
          getErrorMessage(error, "Unable to load employees.")
        )
      } finally {
        setLoadingEmployees(false)
      }
    }

    void loadEmployees()
  }, [open])

  async function handleSubmit() {
    if (!visit || !scheduledAt) {
      toast.error("Schedule date and time are required.")
      return
    }

    if (!assignedStaff.trim()) {
      toast.error("Please select an assigned staff member.")
      return
    }

    if (!selectedSlot) {
      toast.error(
        "Select a time between 8 AM–12 PM or 1 PM–5 PM."
      )
      return
    }

    if (clientProposal && !matchesPreference) {
      toast.error(
        "The appointment must match the client's proposed date and time slot."
      )
      return
    }

    try {
      const appointmentISO = toManilaISOString(scheduledAt)

      if (new Date(appointmentISO).getTime() <= Date.now()) {
        toast.error("Please select a future appointment.")
        return
      }

      setSaving(true)

      if (clientProposal) {
        await onAcceptClientProposal(
          clientProposal.id,
          appointmentISO,
          assignedStaff
        )
        toast.success("Client's proposed schedule confirmed.")
      } else if (action === "confirm") {
        await onSchedule(
          visit.id,
          appointmentISO,
          assignedStaff
        )
        toast.success("On-site visit scheduled successfully.")
      } else {
        await onProposeSchedule(
          visit.id,
          appointmentISO,
          assignedStaff
        )
        toast.success(
          "Schedule proposal sent for client confirmation."
        )
      }

      onOpenChange(false)
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to process the schedule.")
      )
    } finally {
      setSaving(false)
    }
  }

  const buttonLabel = saving
    ? "Saving..."
    : action === "accept-client-proposal"
      ? "Accept Client Proposal"
      : action === "confirm"
        ? "Confirm Schedule"
        : "Send Schedule Proposal"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {clientProposal
              ? "Review Client Schedule Proposal"
              : "Schedule On-Site Visit"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-medium">
              {clientProposal
                ? "Client's Proposed Schedule"
                : "Client's Original Preference"}
            </p>

            <p className="mt-1 text-muted-foreground">
              {preferredDate} ·{" "}
              {preferredSlot === "morning"
                ? "Morning (8 AM–12 PM)"
                : "Afternoon (1 PM–5 PM)"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-visit-schedule">
              Appointment Date and Time
            </Label>

            <Input
              id="site-visit-schedule"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              disabled={saving}
            />

            <p className="text-xs text-muted-foreground">
              All appointment times use Philippine Standard Time (UTC+8).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-visit-staff">
              Assigned Staff
              <span className="ml-1 text-destructive">*</span>
            </Label>

            <Select
              value={assignedStaff || undefined}
              onValueChange={setAssignedStaff}
              disabled={loadingEmployees || saving}
            >
              <SelectTrigger id="site-visit-staff">
                <SelectValue
                  placeholder={
                    loadingEmployees
                      ? "Loading employees..."
                      : "Select an employee"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem
                    key={employee.id}
                    value={employee.name}
                  >
                    {employee.position
                      ? `${employee.name} — ${employee.position}`
                      : employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!loadingEmployees && employees.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No active On-Site Measurement Staff employees are available.
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {clientProposal
              ? "Accepting this schedule will confirm the client's requested date and time slot."
              : action === "confirm"
                ? "This matches the client's original preference and can be confirmed directly."
                : "This differs from the client's preference and requires client approval."}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              saving ||
              loadingEmployees ||
              !scheduledAt ||
              !assignedStaff ||
              !selectedSlot ||
              (clientProposal !== null && !matchesPreference)
            }
          >
            {buttonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
