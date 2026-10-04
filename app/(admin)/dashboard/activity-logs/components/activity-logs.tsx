"use client"

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

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load activity logs."
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

  const perPage = 5

  const totalPages = Math.ceil(filteredLogs.length / perPage)

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Logs</h1>

        <p className="text-muted-foreground">
          Track system changes and administrative actions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="mx-auto mb-2 h-6 w-6 text-blue-600" />

            <p className="text-sm text-muted-foreground">Total Logs</p>

            <h2 className="text-3xl font-bold">{totalLogs}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="mx-auto mb-2 h-6 w-6 text-green-600" />

            <p className="text-sm text-muted-foreground">
              Today's Activities
            </p>

            <h2 className="text-3xl font-bold">{todayActivities}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="mx-auto mb-2 h-6 w-6 text-red-600" />

            <p className="text-sm text-muted-foreground">
              Critical Actions
            </p>

            <h2 className="text-3xl font-bold">{criticalActions}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-orange-600" />

            <p className="text-sm text-muted-foreground">Active Users</p>

            <h2 className="text-3xl font-bold">{activeUsers}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <ToggleGroup
          type="single"
          value={moduleFilter}
          onValueChange={handleModuleChange}
          className="flex flex-wrap justify-start"
        >
          {MODULE_FILTERS.map((module) => (
            <ToggleGroupItem
              key={module}
              value={module}
            >
              {module === "all" ? "All" : module}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search activity logs..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>

                  <TableHead>Action</TableHead>

                  <TableHead>Module</TableHead>

                  <TableHead>Severity</TableHead>

                  <TableHead>Timestamp</TableHead>

                  <TableHead className="text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center"
                    >
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
                          <p className="font-medium">
                            {log.userName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {log.role}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {log.action}
                      </TableCell>

                      <TableCell>
                        {log.module}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={
                            severityStyles[log.severity]
                          }
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

      <LogsPagination
        currentPage={safeCurrentPage}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
      />

      <ViewLogDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        log={selectedLog}
      />
    </div>
  )
}