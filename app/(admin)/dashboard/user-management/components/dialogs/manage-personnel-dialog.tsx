"use client"

import { getErrorMessage } from "@/lib/error-message"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Pencil, Plus } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  createEmployee,
  createTeam,
  getEmployees,
  getTeams,
  setEmployeeActive,
  setTeamActive,
  updateEmployee,
  updateTeam,
} from "../../services/personnel.service"

import type { Employee, Team } from "../../types/personnel"

interface ManagePersonnelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManagePersonnelDialog({
  open,
  onOpenChange,
}: ManagePersonnelDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [employeeName, setEmployeeName] = useState("")
  const [employeePosition, setEmployeePosition] = useState("")
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const [teamName, setTeamName] = useState("")
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  const loadPersonnel = useCallback(async () => {
    try {
      setLoading(true)

      const [employeeData, teamData] = await Promise.all([
        getEmployees(),
        getTeams(),
      ])

      setEmployees(employeeData)
      setTeams(teamData)
    } catch (error) {
      console.error("Failed to load employees and teams:", error)
      toast.error(getErrorMessage(error, "Failed to load employees and teams."))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      void loadPersonnel()
    }
  }, [open, loadPersonnel])

  function resetEmployeeForm() {
    setEmployeeName("")
    setEmployeePosition("")
    setEditingEmployee(null)
  }

  function resetTeamForm() {
    setTeamName("")
    setEditingTeam(null)
  }

  function handleEditEmployee(employee: Employee) {
    setEditingEmployee(employee)
    setEmployeeName(employee.name)
    setEmployeePosition(employee.position ?? "")
  }

  function handleEditTeam(team: Team) {
    setEditingTeam(team)
    setTeamName(team.name)
  }

  async function handleSaveEmployee() {
    const name = employeeName.trim()

    if (!name) {
      toast.error("Employee name is required.")
      return
    }

    try {
      setSaving(true)

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          name,
          position: employeePosition.trim() || null,
        })

        toast.success("Employee updated successfully.")
      } else {
        await createEmployee({
          name,
          position: employeePosition.trim() || null,
        })

        toast.success("Employee added successfully.")
      }

      resetEmployeeForm()
      await loadPersonnel()
    } catch (error) {
      console.error("Failed to save employee:", error)
      toast.error(getErrorMessage(error, "Failed to save employee."))
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveTeam() {
    const name = teamName.trim()

    if (!name) {
      toast.error("Team name is required.")
      return
    }

    try {
      setSaving(true)

      if (editingTeam) {
        await updateTeam(editingTeam.id, { name })
        toast.success("Team updated successfully.")
      } else {
        await createTeam({ name })
        toast.success("Team added successfully.")
      }

      resetTeamForm()
      await loadPersonnel()
    } catch (error) {
      console.error("Failed to save team:", error)
      toast.error(getErrorMessage(error, "Failed to save team."))
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleEmployee(employee: Employee) {
    try {
      await setEmployeeActive(employee.id, !employee.is_active)

      toast.success(
        employee.is_active
          ? "Employee deactivated."
          : "Employee activated."
      )

      await loadPersonnel()
    } catch (error) {
      console.error("Failed to update employee status:", error)
      toast.error(getErrorMessage(error, "Failed to update employee status."))
    }
  }

  async function handleToggleTeam(team: Team) {
    try {
      await setTeamActive(team.id, !team.is_active)

      toast.success(
        team.is_active
          ? "Team deactivated."
          : "Team activated."
      )

      await loadPersonnel()
    } catch (error) {
      console.error("Failed to update team status:", error)
      toast.error(getErrorMessage(error, "Failed to update team status."))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] !max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Manage Employees & Teams</DialogTitle>
          <DialogDescription>
            Manage the employees and teams that can be assigned to operational
            tasks.
          </DialogDescription>
        </DialogHeader>

        <Tabs
  defaultValue="employees"
  className="min-h-0 flex-1 overflow-y-auto pr-1"
>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-5 pt-4">
            <div className="rounded-lg border p-4">
              <div className="mb-4">
                <h3 className="font-medium">
                  {editingEmployee ? "Edit Employee" : "Add Employee"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add an employee who can be selected for operational tasks.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employee-name">Employee Name</Label>
                  <Input
                    id="employee-name"
                    value={employeeName}
                    onChange={(event) => setEmployeeName(event.target.value)}
                    placeholder="e.g. Juan Dela Cruz"
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee-position">Position</Label>
                  <Input
                    id="employee-position"
                    value={employeePosition}
                    onChange={(event) =>
                      setEmployeePosition(event.target.value)
                    }
                    placeholder="e.g. Driver"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {editingEmployee && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetEmployeeForm}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={() => void handleSaveEmployee()}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : editingEmployee ? (
                    <Pencil className="mr-2 size-4" />
                  ) : (
                    <Plus className="mr-2 size-4" />
                  )}

                  {editingEmployee ? "Save Changes" : "Add Employee"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex min-h-32 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : employees.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No employees found.
                </div>
              ) : (
                employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{employee.name}</p>

                        <Badge
                          variant={
                            employee.is_active ? "default" : "secondary"
                          }
                        >
                          {employee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {employee.position || "No position specified"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant={
                          employee.is_active ? "destructive" : "secondary"
                        }
                        size="sm"
                        onClick={() => void handleToggleEmployee(employee)}
                      >
                        {employee.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-5 pt-4">
            <div className="rounded-lg border p-4">
              <div className="mb-4">
                <h3 className="font-medium">
                  {editingTeam ? "Edit Team" : "Add Team"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add a team that can be assigned to production work.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  placeholder="e.g. Fabrication Team A"
                  disabled={saving}
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {editingTeam && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetTeamForm}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={() => void handleSaveTeam()}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : editingTeam ? (
                    <Pencil className="mr-2 size-4" />
                  ) : (
                    <Plus className="mr-2 size-4" />
                  )}

                  {editingTeam ? "Save Changes" : "Add Team"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex min-h-32 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : teams.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No teams found.
                </div>
              ) : (
                teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{team.name}</p>

                      <Badge variant={team.is_active ? "default" : "secondary"}>
                        {team.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTeam(team)}
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant={team.is_active ? "destructive" : "secondary"}
                        size="sm"
                        onClick={() => void handleToggleTeam(team)}
                      >
                        {team.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}