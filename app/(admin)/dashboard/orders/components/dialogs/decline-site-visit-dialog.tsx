"use client"

import { getErrorMessage } from "@/lib/error-message"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { SiteVisit } from "../../types/site-visit"

interface Props {
  visit: SiteVisit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDecline: (id: string, reason: string) => Promise<void>
}

export default function DeclineSiteVisitDialog({ visit, open, onOpenChange, onDecline }: Props) {
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (open) setReason("") }, [open])

  async function handleSubmit() {
    if (!visit || !reason.trim()) return toast.error("A decline reason is required.")
    try {
      setSaving(true)
      await onDecline(visit.id, reason)
      toast.success("On-site visit declined.")
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to decline visit."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Decline On-Site Visit</DialogTitle></DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="site-visit-decline-reason">Reason *</Label>
          <Textarea id="site-visit-decline-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why FJGA cannot accommodate this visit..." rows={5} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={saving || !reason.trim()}>{saving ? "Declining..." : "Decline Visit"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
