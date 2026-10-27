"use client"

import { CalendarDays, Eye, MapPin, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import type { SiteVisit, SiteVisitStatus } from "../../types/site-visit"

interface Props {
  visit: SiteVisit
  onView: () => void
}

const statusLabels: Record<SiteVisitStatus, string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value)
}

function formatPreferredDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(`${value}T00:00:00+08:00`))
}

export default function SiteVisitCard({ visit, onView }: Props) {
  return (
    <Card className="min-w-0 overflow-hidden rounded-xl border border-border/80 shadow-none ring-0">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{visit.visitNumber}</h3>
              <Badge variant={visit.status === "declined" ? "destructive" : "outline"}>
                {statusLabels[visit.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{visit.serviceName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Estimated Visit Fee</p>
            <p className="text-lg font-semibold">{formatCurrency(visit.totalFee)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex gap-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="text-sm font-medium">{visit.clientName}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Preferred Visit</p>
              <p className="text-sm font-medium">
                {formatPreferredDate(visit.preferredDate)} · {visit.preferredTimeSlot === "morning" ? "Morning" : "Afternoon"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{visit.cityName}{visit.provinceName ? `, ${visit.provinceName}` : ""}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end border-t pt-4">
          <Button variant="outline" onClick={onView}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
