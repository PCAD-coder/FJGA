"use client"

import { useMemo, useState } from "react"

import { ActivityLog } from "./types/activity-log"

import ActivityLogCard from "./components/activity-log-card"
import LogsPagination from "./components/logs-pagination"
import ViewLogDialog from "./components/view-log-dialog"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Search, AlertTriangle, ShieldAlert, Activity } from "lucide-react"

const initialLogs: ActivityLog[] = [
  {
    id: 1,
    userName: "John Admin",
    role: "Administrator",
    action: "Updated Material Pricing",
    module: "Pricing",
    description: 'Updated markup of 1/4" Clear Glass from 35% to 40%.',
    timestamp: "May 20, 2026 • 9:15 AM",
    severity: "info",
  },

  {
    id: 2,
    userName: "John Admin",
    role: "Administrator",
    action: "Approved Return Request",
    module: "Returns",
    description: "Approved repair request for damaged sliding window.",
    timestamp: "May 20, 2026 • 10:30 AM",
    severity: "warning",
  },

  {
    id: 3,
    userName: "Mary Manager",
    role: "Manager",
    action: "Published Feedback",
    module: "Feedback",
    description: "Published customer testimonial for storefront glass project.",
    timestamp: "May 20, 2026 • 11:00 AM",
    severity: "info",
  },

  {
    id: 4,
    userName: "John Admin",
    role: "Administrator",
    action: "Restored System Backup",
    module: "Backup",
    description: "Restored backup version from May 18, 2026.",
    timestamp: "May 20, 2026 • 12:45 PM",
    severity: "critical",
  },

  {
    id: 5,
    userName: "Mary Manager",
    role: "Manager",
    action: "Updated Homepage Content",
    module: "Content",
    description: "Modified hero section headline and company description.",
    timestamp: "May 21, 2026 • 8:00 AM",
    severity: "info",
  },

  {
    id: 6,
    userName: "John Admin",
    role: "Administrator",
    action: "Archived Return Request",
    module: "Returns",
    description: "Archived resolved return request.",
    timestamp: "May 21, 2026 • 9:10 AM",
    severity: "warning",
  },
]

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState(initialLogs)

  const [search, setSearch] = useState("")

  const [moduleFilter, setModuleFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  const [viewOpen, setViewOpen] = useState(false)

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.userName.toLowerCase().includes(search.toLowerCase())

      const matchesModule =
        moduleFilter === "all" ? true : log.module === moduleFilter

      return matchesSearch && matchesModule
    })
  }, [logs, search, moduleFilter])

  const perPage = 5

  const totalPages = Math.ceil(filteredLogs.length / perPage)

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const todayActivities = logs.length

  const criticalActions = logs.filter(
    (log) => log.severity === "critical"
  ).length

  const activeUsers = new Set(logs.map((log) => log.userName)).size

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

            <h2 className="text-3xl font-bold">{logs.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="mx-auto mb-2 h-6 w-6 text-green-600" />

            <p className="text-sm text-muted-foreground">Today's Activities</p>

            <h2 className="text-3xl font-bold">{todayActivities}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="mx-auto mb-2 h-6 w-6 text-red-600" />

            <p className="text-sm text-muted-foreground">Critical Actions</p>

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
          onValueChange={(value) => {
            if (value) setModuleFilter(value)
          }}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>

          <ToggleGroupItem value="Pricing">Pricing</ToggleGroupItem>

          <ToggleGroupItem value="Returns">Returns</ToggleGroupItem>

          <ToggleGroupItem value="Feedback">Feedback</ToggleGroupItem>

          <ToggleGroupItem value="Content">Content</ToggleGroupItem>

          <ToggleGroupItem value="Backup">Backup</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search activity logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-5">
        {paginatedLogs.map((log) => (
          <ActivityLogCard
            key={log.id}
            log={log}
            onView={() => {
              setSelectedLog(log)

              setViewOpen(true)
            }}
          />
        ))}
      </div>

      <LogsPagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
      />

      <ViewLogDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        log={selectedLog}
      />
    </div>
  )
}
