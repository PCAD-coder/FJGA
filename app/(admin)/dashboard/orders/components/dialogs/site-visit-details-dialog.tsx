"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import type { SiteVisit } from "../../types/site-visit"

interface Props {
  visit: SiteVisit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule: () => void
  onDecline: () => void
  onComplete: () => void
}

function money(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value)
}
function date(value: string) {
  return new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Manila" }).format(new Date(`${value}T00:00:00+08:00`))
}
function dateTime(value: string | null) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" }).format(new Date(value))
}
function purpose(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function SiteVisitDetailsDialog({ visit, open, onOpenChange, onSchedule, onDecline, onComplete }: Props) {
  if (!visit) return null
  const address = [visit.unitFloor, visit.houseBuildingNumber, visit.street, visit.buildingSubdivision, visit.barangayName, visit.cityName, visit.provinceName, visit.regionName, visit.postalCode].filter(Boolean).join(", ")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2"><DialogTitle>{visit.visitNumber}</DialogTitle><Badge variant={visit.status === "declined" ? "destructive" : "outline"}>{visit.status.replace(/_/g, " ")}</Badge></div>
        </DialogHeader>
        <div className="space-y-6 text-sm">
          <section className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
            <div><p className="text-xs text-muted-foreground">Client</p><p className="font-medium">{visit.clientName}</p></div>
            <div><p className="text-xs text-muted-foreground">Contact Number</p><p className="font-medium">{visit.contactNumber}</p></div>
            <div><p className="text-xs text-muted-foreground">Preferred Date</p><p className="font-medium">{date(visit.preferredDate)}</p></div>
            <div><p className="text-xs text-muted-foreground">Preferred Time</p><p className="font-medium capitalize">{visit.preferredTimeSlot}</p></div>
            <div><p className="text-xs text-muted-foreground">Purpose</p><p className="font-medium">{purpose(visit.purpose)}</p></div>
            <div><p className="text-xs text-muted-foreground">Requested</p><p className="font-medium">{dateTime(visit.createdAt)}</p></div>
          </section>
          <section><h4 className="mb-2 font-semibold">Visit Address</h4><div className="rounded-lg border p-4"><p>{address}</p>{visit.landmark && <p className="mt-2 text-muted-foreground">Landmark: {visit.landmark}</p>}</div></section>
          {visit.clientNotes && <section><h4 className="mb-2 font-semibold">Client Notes</h4><div className="rounded-lg border p-4 whitespace-pre-wrap">{visit.clientNotes}</div></section>}
          <section><h4 className="mb-2 font-semibold">Fee Breakdown</h4><div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Service Fee</p><p className="font-medium">{money(visit.serviceFee)}</p></div><div><p className="text-xs text-muted-foreground">Travel Fee</p><p className="font-medium">{money(visit.travelFee)}</p></div><div><p className="text-xs text-muted-foreground">Estimated Total</p><p className="font-semibold">{money(visit.totalFee)}</p></div></div></section>
          {visit.scheduledAt && <section><h4 className="mb-2 font-semibold">Schedule</h4><div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Scheduled Visit</p><p className="font-medium">{dateTime(visit.scheduledAt)}</p></div><div><p className="text-xs text-muted-foreground">Assigned Staff</p><p className="font-medium">{visit.assignedStaff || "Not assigned"}</p></div></div></section>}
          {visit.status === "completed" && <section><h4 className="mb-2 font-semibold">Confirmed Measurements</h4><div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Width</p><p className="font-medium">{visit.actualWidth} {visit.dimensionUnit}</p></div><div><p className="text-xs text-muted-foreground">Height</p><p className="font-medium">{visit.actualHeight} {visit.dimensionUnit}</p></div><div><p className="text-xs text-muted-foreground">Depth</p><p className="font-medium">{visit.actualDepth == null ? "—" : `${visit.actualDepth} ${visit.dimensionUnit}`}</p></div>{visit.measurementNotes && <div className="sm:col-span-3"><p className="text-xs text-muted-foreground">Measurement Notes</p><p className="mt-1 whitespace-pre-wrap">{visit.measurementNotes}</p></div>}</div></section>}
          {visit.status === "declined" && <section><h4 className="mb-2 font-semibold">Decline Reason</h4><div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">{visit.declineReason}</div></section>}
        </div>
        <DialogFooter className="flex-wrap sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <div className="flex flex-wrap gap-2">
            {visit.status === "pending" && <><Button variant="destructive" onClick={onDecline}>Decline</Button><Button onClick={onSchedule}>Schedule Visit</Button></>}
            {visit.status === "scheduled" && <><Button variant="outline" onClick={onSchedule}>Reschedule</Button><Button onClick={onComplete}>Complete Visit</Button></>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
