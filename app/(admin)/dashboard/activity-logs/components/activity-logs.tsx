"use client"

import { getErrorMessage } from "@/lib/error-message"

import { DashboardCard } from "@/components/dashboard_cards"
import ActivityLogsSkeleton from "./activity-logs-skeleton"
import { toast } from "sonner"

import { useEffect, useMemo, useState } from "react"

import { ActivityLog } from "../types/activity-log"
import { getActivityLogs } from "../services/activity-logs.service"

import LogsPagination from "./logs-pagination"
import ViewLogDialog from "./view-log-dialog"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import {
  Search,
  AlertTriangle,
  ShieldAlert,
  Activity,
  Info,
  Eye,
  Users,
  CalendarDays,
} from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const MODULE_FILTERS = [
  "all",
  "Inventory",
  "Pricing",
  "Products",
  "Orders",
  "Production",
  "Returns",
  "Feedback",
  "Content",
  "Backup",
]

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

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")

  const [moduleFilter, setModuleFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  const [viewOpen, setViewOpen] = useState(false)

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true)
        setError(null)

        const data = await getActivityLogs()

        setLogs(data)
      } catch (err) {
        console.error("Failed to load activity logs:", err)
        toast.error("Unable to load activity logs. Please try again.", {
          id: "activity-logs-load",
        })

        setError(
          getErrorMessage(err, "Failed to load activity logs.")
        )
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        log.action.toLowerCase().includes(searchValue) ||
        log.userName.toLowerCase().includes(searchValue) ||
        log.module.toLowerCase().includes(searchValue)

      const matchesModule =
        moduleFilter === "all" ? true : log.module === moduleFilter

      return matchesSearch && matchesModule
    })
  }, [logs, search, moduleFilter])

  const perPage = 10

  const totalPages = Math.ceil(filteredLogs.length / perPage)

  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1

  const paginatedLogs = filteredLogs.slice(
    (safeCurrentPage - 1) * perPage,
    safeCurrentPage * perPage
  )

  const totalLogs = logs.length

  const todayActivities = logs.filter((log) => {
    const logDate = new Date(log.timestamp)
    const today = new Date()

    return (
      logDate.getFullYear() === today.getFullYear() &&
      logDate.getMonth() === today.getMonth() &&
      logDate.getDate() === today.getDate()
    )
  }).length

  const criticalActions = logs.filter(
    (log) => log.severity === "critical"
  ).length

  const activeUsers = new Set(
    logs
      .map((log) => log.userId)
      .filter((userId): userId is string => Boolean(userId))
  ).size

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp)

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function handleModuleChange(value: string) {
    if (value) {
      setModuleFilter(value)
      setCurrentPage(1)
    }
  }

  function handlePageChange(page: number) {
    setCurrentPage(page)
  }

  if (loading) return <ActivityLogsSkeleton />

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Activity Logs
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Track system changes and administrative actions.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        <DashboardCard
          title="Total Logs"
          value={String(totalLogs)}
          description="Recorded system activities"
          icon={Activity}
          color="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="Today's Activities"
          value={String(todayActivities)}
          description="Activities recorded today"
          icon={CalendarDays}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <DashboardCard
          title="Critical Actions"
          value={String(criticalActions)}
          description="Logs with critical severity"
          icon={ShieldAlert}
          color="text-red-600 dark:text-red-400"
        />
        <DashboardCard
          title="Active Users"
          value={String(activeUsers)}
          description="Distinct users in the loaded logs"
          icon={Users}
          color="text-primary"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4">
        <ToggleGroup
          type="single"
          value={moduleFilter}
          onValueChange={handleModuleChange}
          className="flex h-auto max-w-full flex-wrap justify-start gap-1"
        >
          {MODULE_FILTERS.map((module) => (
            <ToggleGroupItem key={module} value={module}>
              {module === "all" ? "All" : module}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            aria-label="Search activity logs"
            className="h-9 rounded-lg bg-background/50 pl-9 shadow-none"
            placeholder="Search activity logs..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
        <CardContent className="p-0 [&_td]:px-4 [&_td]:py-3 [&_th]:h-12 [&_th]:px-4 [&_th]:text-xs">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User</TableHead>

                  <TableHead>Action</TableHead>

                  <TableHead>Module</TableHead>

                  <TableHead>Severity</TableHead>

                  <TableHead>Timestamp</TableHead>

                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading activity logs...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-destructive"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No activity logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.userName}</p>

                          <p className="text-xs text-muted-foreground">
                            {log.role}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {log.action}
                      </TableCell>

                      <TableCell>{log.module}</TableCell>

                      <TableCell>
                        <Badge
                          className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${severityStyles[log.severity]}`}
                        >
                          <span className="mr-1">
                            {severityIcons[log.severity]}
                          </span>

                          {log.severity}
                        </Badge>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log)
                            setViewOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {!error && filteredLogs.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {(safeCurrentPage - 1) * perPage + 1} to{" "}
            {Math.min(safeCurrentPage * perPage, filteredLogs.length)} of{" "}
            {filteredLogs.length} logs
          </p>
          <LogsPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ViewLogDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        log={selectedLog}
      />
    </div>
  )
}
