"use client"

import { getErrorMessage } from "@/lib/error-message"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { SiteVisit } from "../../types/site-visit"

interface Props {
  visit: SiteVisit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (id: string, width: number, height: number, depth: number | null, notes?: string) => Promise<void>
}

export default function CompleteSiteVisitDialog({ visit, open, onOpenChange, onComplete }: Props) {
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [depth, setDepth] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setWidth(visit?.actualWidth?.toString() ?? "")
    setHeight(visit?.actualHeight?.toString() ?? "")
    setDepth(visit?.actualDepth?.toString() ?? "")
    setNotes(visit?.measurementNotes ?? "")
  }, [open, visit])

  async function handleSubmit() {
    if (!visit) return
    const parsedWidth = Number(width)
    const parsedHeight = Number(height)
    const parsedDepth = depth.trim() ? Number(depth) : null
    if (!Number.isFinite(parsedWidth) || parsedWidth <= 0 || !Number.isFinite(parsedHeight) || parsedHeight <= 0) return toast.error("Confirmed width and height must be greater than zero.")
    if (parsedDepth !== null && (!Number.isFinite(parsedDepth) || parsedDepth <= 0)) return toast.error("Depth must be greater than zero when provided.")
    try {
      setSaving(true)
      await onComplete(visit.id, parsedWidth, parsedHeight, parsedDepth, notes)
      toast.success("On-site visit completed and measurements saved.")
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to complete visit."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>Complete On-Site Visit</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">Record the measurements confirmed by FJGA during the visit. Width and height are required; depth is optional.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="visit-width">Width (cm) *</Label><Input id="visit-width" type="number" min="0" step="0.01" value={width} onChange={(e) => setWidth(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="visit-height">Height (cm) *</Label><Input id="visit-height" type="number" min="0" step="0.01" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="visit-depth">Depth (cm)</Label><Input id="visit-depth" type="number" min="0" step="0.01" value={depth} onChange={(e) => setDepth(e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="visit-measurement-notes">Measurement notes</Label><Textarea id="visit-measurement-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="Additional measurements, site conditions, allowances, or installation notes..." /></div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !width || !height}>{saving ? "Saving..." : "Complete Visit"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
