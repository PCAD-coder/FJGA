"use client"

import { getErrorMessage } from "@/lib/error-message"

import { useEffect, useState } from "react"
import { toast } from "sonner"

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
import type { SiteVisit } from "../../types/site-visit"

interface Props {
  visit: SiteVisit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule: (
    id: string,
    scheduledAt: string,
    assignedStaff?: string
  ) => Promise<void>
}

export default function ScheduleSiteVisitDialog({
  visit,
  open,
  onOpenChange,
  onSchedule,
}: Props) {
  const [scheduledAt, setScheduledAt] = useState("")
  const [assignedStaff, setAssignedStaff] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || !visit) return
    setAssignedStaff(visit.assignedStaff ?? "")
    setScheduledAt(visit.scheduledAt ? visit.scheduledAt.slice(0, 16) : "")
  }, [open, visit])

  useEffect(() => {
    if (!open) return

    async function loadEmployees() {
      try {
        setLoadingEmployees(true)

        const data = await getActiveEmployees()
        setEmployees(data)
      } catch (error) {
        console.error("Failed to load employees:", error)
        toast.error(getErrorMessage(error, "Unable to load employees."))
      } finally {
        setLoadingEmployees(false)
      }
    }

    void loadEmployees()
  }, [open])

  async function handleSubmit() {
if (!visit || !scheduledAt) {
  return toast.error("Schedule date and time are required.")
}

if (!assignedStaff) {
  return toast.error("Please select an assigned staff member.")
}
    try {
      setSaving(true)
      await onSchedule(
        visit.id,
        new Date(scheduledAt).toISOString(),
        assignedStaff
      )
      toast.success("On-site visit scheduled successfully.")
      onOpenChange(false)
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to schedule visit.")
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule On-Site Visit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-visit-schedule">Date and time</Label>
            <Input
              id="site-visit-schedule"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
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
                {assignedStaff &&
                  !employees.some(
                    (employee) => employee.name === assignedStaff
                  ) && (
                    <SelectItem value={assignedStaff}>
                      {assignedStaff} — Previously assigned
                    </SelectItem>
                  )}
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.name}>
                    {employee.position
                      ? `${employee.name} — ${employee.position}`
                      : employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!loadingEmployees && employees.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No active employees are available.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !scheduledAt || !assignedStaff || loadingEmployees}>
            {saving
              ? "Saving..."
              : visit?.status === "scheduled"
                ? "Update Schedule"
                : "Schedule Visit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
