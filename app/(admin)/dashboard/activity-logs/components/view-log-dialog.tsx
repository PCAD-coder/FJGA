"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

import { AlertTriangle, ShieldAlert, Info } from "lucide-react"

import { ActivityLog } from "../types/activity-log"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  log: ActivityLog | null
}

export default function ViewLogDialog({ open, onOpenChange, log }: Props) {
  if (!log) return null

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Activity Log Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Action</p>

              <p className="text-lg font-semibold">{log.action}</p>
            </div>

            <Badge
              className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${severityStyles[log.severity]}`}
            >
              <span className="mr-1">{severityIcons[log.severity]}</span>

              {log.severity}
            </Badge>
          </div>

          <div className="grid gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">User</p>

              <p className="mt-1 text-sm font-medium wrap-break-word">
                {log.userName}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Role</p>

              <p className="mt-1 text-sm font-medium wrap-break-word">
                {log.role}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Module</p>

              <p className="mt-1 text-sm font-medium wrap-break-word">
                {log.module}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Timestamp</p>

              <p className="mt-1 text-sm font-medium wrap-break-word">
                {log.timestamp}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Description</p>

            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm leading-7 wrap-break-word whitespace-pre-wrap">
              {log.description}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
