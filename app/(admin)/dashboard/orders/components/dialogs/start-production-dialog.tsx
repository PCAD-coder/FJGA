"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  getActiveEmployees,
  getActiveTeams,
} from "../../../user-management/services/personnel.service"

import type { Employee, Team } from "../../../user-management/types/personnel"

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
  const [employees, setEmployees] = useState<Employee[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingPersonnel, setLoadingPersonnel] = useState(false)
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    async function loadPersonnel() {
      try {
        setLoadingPersonnel(true)

        const [employeeData, teamData] = await Promise.all([
          getActiveEmployees(),
          getActiveTeams(),
        ])

        setEmployees(employeeData)
        setTeams(teamData)
      } catch (error) {
        console.error("Failed to load employees and teams:", error)
      } finally {
        setLoadingPersonnel(false)
      }
    }

    void loadPersonnel()
  }, [open])

  const handleConfirm = async () => {
    if (!assignedTo || !estimatedCompletionDate) return

    try {
      setSaving(true)

      await onConfirm(assignedTo, estimatedCompletionDate)

      setAssignedTo("")
      setEstimatedCompletionDate("")

      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start Production</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Assign this order to production and set the expected completion
            date.
          </p>

          {projectName && (
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="font-semibold">{projectName}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Assigned Staff / Team</label>

            <Select
              value={assignedTo || undefined}
              onValueChange={setAssignedTo}
              disabled={loadingPersonnel || saving}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingPersonnel
                      ? "Loading employees and teams..."
                      : "Select an employee or team"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {employees.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Employees</SelectLabel>

                    {employees.map((employee) => (
                      <SelectItem
                        key={`employee-${employee.id}`}
                        value={employee.name}
                      >
                        {employee.position
                          ? `${employee.name} — ${employee.position}`
                          : employee.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}

                {teams.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Teams</SelectLabel>

                    {teams.map((team) => (
                      <SelectItem key={`team-${team.id}`} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>

            {!loadingPersonnel &&
              employees.length === 0 &&
              teams.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No active employees or teams are available.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Estimated Completion Date
            </label>
            <Input
              type="date"
              value={estimatedCompletionDate}
              onChange={(e) => setEstimatedCompletionDate(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleConfirm}
            disabled={saving || !assignedTo || !estimatedCompletionDate}
          >
            {saving ? "Starting Production..." : "Start Production"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
