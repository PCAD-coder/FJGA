"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value)
}
function date(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(`${value}T00:00:00+08:00`))
}
function dateTime(value: string | null) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  }).format(new Date(value))
}
function purpose(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function SiteVisitDetailsDialog({
  visit,
  open,
  onOpenChange,
  onSchedule,
  onDecline,
  onComplete,
}: Props) {
  const [currentTime, setCurrentTime] = useState<number | null>(null)

  useEffect(() => {
    if (!open) return

    const updateTime = () => {
      setCurrentTime(Date.now())
    }

    updateTime()

    const interval = setInterval(updateTime, 60_000)

    return () => clearInterval(interval)
  }, [open])

  if (!visit) return null

  const canCompleteVisit =
    visit.status === "scheduled" &&
    !!visit.scheduledAt &&
    currentTime !== null &&
    !Number.isNaN(new Date(visit.scheduledAt).getTime()) &&
    new Date(visit.scheduledAt).getTime() <= currentTime

  const address = [
    visit.unitFloor,
    visit.houseBuildingNumber,
    visit.street,
    visit.buildingSubdivision,
    visit.barangayName,
    visit.cityName,
    visit.provinceName,
    visit.regionName,
    visit.postalCode,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>{visit.visitNumber}</DialogTitle>
            <Badge
              variant={visit.status === "declined" ? "destructive" : "outline"}
            >
              {visit.status === "proposed" && (
                <p className="text-sm text-muted-foreground">
                  Waiting for client confirmation
                </p>
              )}
            </Badge>
          </div>
        </DialogHeader>
        <div className="space-y-6 text-sm">
          <section className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-medium">{visit.clientName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contact Number</p>
              <p className="font-medium">{visit.contactNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Preferred Date</p>
              <p className="font-medium">{date(visit.preferredDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Preferred Time</p>
              <p className="font-medium capitalize">
                {visit.preferredTimeSlot}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Purpose</p>
              <p className="font-medium">{purpose(visit.purpose)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Requested</p>
              <p className="font-medium">{dateTime(visit.createdAt)}</p>
            </div>
          </section>
          <section>
            <h4 className="mb-2 font-semibold">Visit Address</h4>
            <div className="rounded-lg border p-4">
              <p>{address}</p>
              {visit.landmark && (
                <p className="mt-2 text-muted-foreground">
                  Landmark: {visit.landmark}
                </p>
              )}
            </div>
          </section>
          {visit.clientNotes && (
            <section>
              <h4 className="mb-2 font-semibold">Client Notes</h4>
              <div className="rounded-lg border p-4 whitespace-pre-wrap">
                {visit.clientNotes}
              </div>
            </section>
          )}
          <section>
  <h4 className="mb-2 font-semibold">Fee Breakdown</h4>

  <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-4">
    <div>
      <p className="text-xs text-muted-foreground">
        Service Fee
      </p>
      <p className="font-medium">{money(visit.serviceFee)}</p>
    </div>

    {visit.totalFee > visit.serviceFee + visit.travelFee + 0.005 && (
      <div>
        <p className="text-xs text-muted-foreground">
          VAT (12% - Measurement Service)
        </p>
        <p className="font-medium">
          {money(
            Math.round(
              (visit.totalFee - visit.serviceFee - visit.travelFee) * 100
            ) / 100
          )}
        </p>
      </div>
    )}

    <div>
      <p className="text-xs text-muted-foreground">
        Travel Fee
      </p>
      <p className="font-medium">{money(visit.travelFee)}</p>
    </div>

    <div>
      <p className="text-xs text-muted-foreground">
        Estimated Total
      </p>
      <p className="font-semibold">{money(visit.totalFee)}</p>
    </div>
  </div>
</section>
          {visit.pendingProposal && (
            <section>
              <h4 className="mb-2 font-semibold">Schedule Proposal</h4>

              <div className="space-y-3 rounded-lg border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Proposal From</p>

                  <p className="font-medium">
                    {visit.pendingProposal.proposedByRole === "admin"
                      ? "Administrator"
                      : "Client"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Proposed Date
                    </p>

                    <p className="font-medium">
                      {date(visit.pendingProposal.proposedDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Proposed Time Slot
                    </p>

                    <p className="font-medium capitalize">
                      {visit.pendingProposal.proposedTimeSlot}
                    </p>
                  </div>
                </div>

                {visit.pendingProposal.proposedScheduledAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Proposed Appointment
                    </p>

                    <p className="font-medium">
                      {dateTime(visit.pendingProposal.proposedScheduledAt)}
                    </p>
                  </div>
                )}

                {visit.pendingProposal.assignedStaff && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Proposed Assigned Staff
                    </p>

                    <p className="font-medium">
                      {visit.pendingProposal.assignedStaff}
                    </p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {visit.pendingProposal.proposedByRole === "admin"
                    ? "Waiting for the client to accept or request another schedule."
                    : "The client requested another schedule. Administrator review is required."}
                </p>
              </div>
            </section>
          )}
          {visit.scheduledAt && (
            <section>
              <h4 className="mb-2 font-semibold">Schedule</h4>
              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Scheduled Visit
                  </p>
                  <p className="font-medium">{dateTime(visit.scheduledAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Assigned Staff
                  </p>
                  <p className="font-medium">
                    {visit.assignedStaff || "Not assigned"}
                  </p>
                </div>
              </div>
            </section>
          )}
          {visit.status === "completed" && (
            <section>
              <h4 className="mb-2 font-semibold">Confirmed Measurements</h4>
              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Width</p>
                  <p className="font-medium">
                    {visit.actualWidth} {visit.dimensionUnit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="font-medium">
                    {visit.actualHeight} {visit.dimensionUnit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Depth</p>
                  <p className="font-medium">
                    {visit.actualDepth == null
                      ? "—"
                      : `${visit.actualDepth} ${visit.dimensionUnit}`}
                  </p>
                </div>
                {visit.measurementNotes && (
                  <div className="sm:col-span-3">
                    <p className="text-xs text-muted-foreground">
                      Measurement Notes
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">
                      {visit.measurementNotes}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
          {visit.status === "declined" && (
            <section>
              <h4 className="mb-2 font-semibold">Decline Reason</h4>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
                {visit.declineReason}
              </div>
            </section>
          )}
        </div>
        {visit.status === "scheduled" &&
          visit.scheduledAt &&
          !canCompleteVisit && (
            <p className="mt-4 text-sm text-muted-foreground">
              This visit can only be marked as completed once its scheduled
              appointment has started.
            </p>
          )}
        <DialogFooter className="flex-wrap sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex flex-wrap gap-2">
            {visit.status === "pending" && !visit.pendingProposal && (
              <>
                <Button variant="destructive" onClick={onDecline}>
                  Decline
                </Button>

                <Button onClick={onSchedule}>Review Schedule</Button>
              </>
            )}

            {visit.status === "pending" &&
              visit.pendingProposal?.proposedByRole === "client" && (
                <Button onClick={onSchedule}>Review Client Proposal</Button>
              )}

            {visit.status === "scheduled" && (
              <Button onClick={onComplete} disabled={!canCompleteVisit}>
                Complete Visit
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
