"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { SiteVisit } from "../../types/site-visit"

interface Props {
  visit: SiteVisit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule: (id: string, scheduledAt: string, assignedStaff?: string) => Promise<void>
}

export default function ScheduleSiteVisitDialog({ visit, open, onOpenChange, onSchedule }: Props) {
  const [scheduledAt, setScheduledAt] = useState("")
  const [assignedStaff, setAssignedStaff] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || !visit) return
    setAssignedStaff(visit.assignedStaff ?? "")
    setScheduledAt(visit.scheduledAt ? visit.scheduledAt.slice(0, 16) : "")
  }, [open, visit])

  async function handleSubmit() {
    if (!visit || !scheduledAt) return toast.error("Schedule date and time are required.")
    try {
      setSaving(true)
      await onSchedule(visit.id, new Date(scheduledAt).toISOString(), assignedStaff)
      toast.success("On-site visit scheduled successfully.")
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to schedule visit.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Schedule On-Site Visit</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-visit-schedule">Date and time</Label>
            <Input id="site-visit-schedule" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-visit-staff">Assigned staff (optional)</Label>
            <Input id="site-visit-staff" value={assignedStaff} onChange={(e) => setAssignedStaff(e.target.value)} placeholder="Staff name" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !scheduledAt}>{saving ? "Saving..." : visit?.status === "scheduled" ? "Update Schedule" : "Schedule Visit"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
