"use client"

import { CalendarDays, CheckCircle2, MapPin, Ruler, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { ClientSiteVisit } from "../../types/site-visit"

interface SiteVisitHistoryProps {
  visits: ClientSiteVisit[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onCreateCustomRequest: (visit: ClientSiteVisit) => void
}

const statusLabel: Record<ClientSiteVisit["status"], string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
}

export function SiteVisitHistory({
  visits,
  isLoading,
  error,
  onRetry,
  onCreateCustomRequest,
}: SiteVisitHistoryProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">On-Site Visits</h2>
        <p className="text-sm text-muted-foreground">
          Track measurement visits and use completed measurements for a custom request.
        </p>
      </div>

      {isLoading ? (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading on-site visits...</CardContent></Card>
      ) : error ? (
        <Card className="border-destructive/50">
          <CardContent className="flex items-center justify-between gap-4 p-6">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>Try Again</Button>
          </CardContent>
        </Card>
      ) : visits.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No on-site visit requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
            <Card key={visit.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{visit.visitNumber}</p>
                      <Badge variant="outline">{statusLabel[visit.status]}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{visit.serviceName}</p>
                  </div>
                  <p className="font-semibold">₱{visit.totalFee.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="grid gap-3 text-sm md:grid-cols-3">
                  <div className="flex gap-2"><CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" /><span>{visit.scheduledAt ? formatDateTime(visit.scheduledAt) : `${formatDate(visit.preferredDate)} · ${capitalize(visit.preferredTimeSlot)}`}</span></div>
                  <div className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" /><span>{visit.address.barangayName}, {visit.address.cityName}</span></div>
                  {visit.status === "completed" && visit.actualWidth != null && visit.actualHeight != null && (
                    <div className="flex gap-2"><Ruler className="mt-0.5 h-4 w-4 text-muted-foreground" /><span>{formatMeasurements(visit)}</span></div>
                  )}
                </div>

                {visit.status === "declined" && visit.declineReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <div className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 text-destructive" /><div><p className="font-medium">Decline Reason</p><p className="text-muted-foreground">{visit.declineReason}</p></div></div>
                  </div>
                )}

                {visit.status === "completed" && (
                  <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium">Confirmed by FJGA</p>
                        <p className="text-sm text-muted-foreground">{formatMeasurements(visit)}</p>
                        {visit.measurementNotes && <p className="mt-1 text-xs text-muted-foreground">{visit.measurementNotes}</p>}
                      </div>
                    </div>
                    {visit.customRequestId ? (
                      <Button type="button" variant="outline" disabled>
                        {visit.customRequestNumber ?? "Custom Request Created"}
                      </Button>
                    ) : (
                      <Button type="button" onClick={() => onCreateCustomRequest(visit)}>Create Custom Request</Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

function formatMeasurements(visit: ClientSiteVisit) {
  const unit = visit.dimensionUnit || "cm"
  return visit.actualDepth == null
    ? `${visit.actualWidth} × ${visit.actualHeight} ${unit}`
    : `${visit.actualWidth} × ${visit.actualHeight} × ${visit.actualDepth} ${unit}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Manila" }).format(new Date(`${value}T00:00:00+08:00`))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" }).format(new Date(value))
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
