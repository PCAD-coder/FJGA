"use client"

import { ActivityLog } from "../types/activity-log"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import { Eye, AlertTriangle, ShieldAlert, Info } from "lucide-react"

interface Props {
  log: ActivityLog

  onView: () => void
}

export default function ActivityLogCard({ log, onView }: Props) {
  const severityStyles = {
    info: "bg-blue-100 text-blue-700",

    warning: "bg-orange-100 text-orange-700",

    critical: "bg-red-100 text-red-700",
  }

  const severityIcons = {
    info: <Info className="h-4 w-4" />,

    warning: <AlertTriangle className="h-4 w-4" />,

    critical: <ShieldAlert className="h-4 w-4" />,
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{log.action}</h3>

            <p className="text-sm text-muted-foreground">{log.module}</p>
          </div>

          <Badge className={severityStyles[log.severity]}>
            <span className="mr-1">{severityIcons[log.severity]}</span>

            {log.severity}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">User</p>

            <p className="font-medium">{log.userName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Role</p>

            <p className="font-medium">{log.role}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Timestamp</p>

            <p className="font-medium">{log.timestamp}</p>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
