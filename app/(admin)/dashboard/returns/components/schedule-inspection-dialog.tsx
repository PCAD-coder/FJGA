"use client"

import { useEffect, useState } from "react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getActiveEmployees } from "../../user-management/services/personnel.service"
import type { Employee } from "../../user-management/types/personnel"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

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
  const [date, setDate] = useState("")

  const [time, setTime] = useState("")

  const [assignedStaff, setAssignedStaff] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
const [loadingEmployees, setLoadingEmployees] = useState(false)

  const [notes, setNotes] = useState("")

  useEffect(() => {
  if (!open) return

  async function loadEmployees() {
    try {
      setLoadingEmployees(true)

      const data = await getActiveEmployees()
      setEmployees(data)
    } catch (error) {
      console.error("Failed to load employees:", error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  void loadEmployees()
}, [open])

const handleSchedule = () => {
  if (!date || !time || !assignedStaff) return

  onConfirm(date, time, assignedStaff, notes)

  setDate("")
  setTime("")
  setAssignedStaff("")
  setNotes("")
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Inspection</DialogTitle>

          <DialogDescription>
            Set an inspection schedule for this return request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Request</p>

            <p className="font-medium">{requestTitle}</p>
          </div>

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

<div className="space-y-2">
  <label className="text-sm font-medium">
  Assigned Staff
  <span className="ml-1 text-destructive">*</span>
</label>

  <Select
    value={assignedStaff || undefined}
    onValueChange={setAssignedStaff}
    disabled={loadingEmployees}
  >
    <SelectTrigger className="w-full">
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
      No active employees are available.
    </p>
  )}
</div>

          <Input
            placeholder="Inspection Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
  onClick={handleSchedule}
  disabled={!date || !time || !assignedStaff || loadingEmployees}
>
  Schedule
</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
