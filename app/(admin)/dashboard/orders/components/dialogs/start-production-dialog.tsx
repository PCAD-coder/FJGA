"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

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

import { getActiveTeams } from "../../../user-management/services/personnel.service"

import type { Team } from "../../../user-management/types/personnel"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName?: string
  onConfirm: (
    assignedTo: string,
    estimatedCompletionDate: string
  ) => Promise<void>
}

function getTodayInManila() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())
  const year = parts.find((part) => part.type === "year")!.value
  const month = parts.find((part) => part.type === "month")!.value
  const day = parts.find((part) => part.type === "day")!.value
  return `${year}-${month}-${day}`
}

export default function StartProductionDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
}: Props) {
  const [assignedTo, setAssignedTo] = useState("")
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingPersonnel, setLoadingPersonnel] = useState(false)
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("")
  const [saving, setSaving] = useState(false)
  const minimumCompletionDate = getTodayInManila()
  const isPastCompletionDate =
    !!estimatedCompletionDate && estimatedCompletionDate < minimumCompletionDate

  useEffect(() => {
    if (!open) return

    async function loadPersonnel() {
      try {
        setLoadingPersonnel(true)

        const teamData = await getActiveTeams()
        setTeams(teamData)
      } catch (error) {
        console.error("Failed to load teams:", error)
      } finally {
        setLoadingPersonnel(false)
      }
    }

    void loadPersonnel()
  }, [open])

  const handleConfirm = async () => {
    if (
      loadingPersonnel ||
      !teams.some((team) => team.name === assignedTo) ||
      !estimatedCompletionDate
    ) return
    if (estimatedCompletionDate < getTodayInManila()) {
      toast.error("Estimated completion date must be today or a future date.")
      return
    }

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
          <DialogTitle>Pass to Production</DialogTitle>
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
            <label className="text-sm font-medium">Assigned Team</label>

            <Select
              value={assignedTo || undefined}
              onValueChange={setAssignedTo}
              disabled={loadingPersonnel || saving}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingPersonnel
                      ? "Loading teams..."
                      : "Select a team"
                  }
                />
              </SelectTrigger>

              <SelectContent>
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
              teams.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No active teams are available.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="estimated-completion-date"
              className="text-sm font-medium"
            >
              Estimated Completion Date
            </label>
            <Input
              id="estimated-completion-date"
              type="date"
              min={minimumCompletionDate}
              value={estimatedCompletionDate}
              onChange={(event) => {
                const date = event.target.value
                if (date && date < getTodayInManila()) {
                  event.currentTarget.value = estimatedCompletionDate
                  toast.error("Choose today or a future date.")
                  return
                }
                setEstimatedCompletionDate(date)
              }}
              aria-invalid={isPastCompletionDate}
              aria-describedby={
                isPastCompletionDate ? "completion-date-error" : undefined
              }
            />
            {isPastCompletionDate && (
              <p
                id="completion-date-error"
                role="alert"
                className="text-xs text-destructive"
              >
                Choose today or a future date.
              </p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleConfirm}
            disabled={
              saving ||
              loadingPersonnel ||
              !teams.some((team) => team.name === assignedTo) ||
              !estimatedCompletionDate ||
              isPastCompletionDate
            }
          >
            {saving ? "Starting Production..." : "Start Production"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
