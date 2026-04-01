'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, CheckCircle, XCircle, Clock } from "lucide-react"

const summary = [
  {
    title: "Total Backups",
    value: "6",
    icon: Database,
    color: "text-blue-500",
  },
  {
    title: "Successful",
    value: "5",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    title: "Failed",
    value: "1",
    icon: XCircle,
    color: "text-red-500",
  },
  {
    title: "Last Backup",
    value: "4/1/2026",
    icon: Clock,
    color: "text-purple-500",
  },
]

const backups = [
  {
    date: "2026-04-01 02:00 AM",
    size: "245.8 MB",
    createdBy: "System Auto-Backup",
    status: "Success",
  },
  {
    date: "2026-03-31 02:00 AM",
    size: "243.2 MB",
    createdBy: "System Auto-Backup",
    status: "Success",
  },
  {
    date: "2026-03-30 02:00 AM",
    size: "241.5 MB",
    createdBy: "System Auto-Backup",
    status: "Success",
  },
  {
    date: "2026-03-29 03:15 PM",
    size: "240.1 MB",
    createdBy: "Admin User",
    status: "Failed",
  },
]

export default function BackupPage() {
  return (
    <div className="space-y-6">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Backup & Restore</h1>
        <p className="text-sm text-muted-foreground">
          Manage database backups and restoration
        </p>
      </div>

      {/* 🔹 SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summary.map((item, i) => {
          const Icon = item.icon
          return (
            <Card key={i} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
              <Icon className={`w-5 h-5 ${item.color}`} />
            </Card>
          )
        })}
      </div>

      {/* 🔹 BACKUP ACTION */}
      <Card className="p-8 text-center bg-gradient-to-r from-primary/20 to-muted">
        <div className="flex flex-col items-center gap-4">
          <Database className="w-10 h-10 text-primary" />

          <h2 className="text-lg font-semibold">
            Create Full Database Backup
          </h2>

          <p className="text-sm text-muted-foreground max-w-xl">
            Create a complete backup of your database including inventory,
            orders, clients, and system settings. This may take a few minutes.
          </p>

          <Button>Start Full Backup</Button>
        </div>
      </Card>

      {/* 🔹 WARNING */}
      <Card className="p-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
        <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
          ⚠ Important Notice
        </p>
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Restoring a backup will overwrite all current data. Always create a backup before restoring.
        </p>
      </Card>

      {/* 🔹 BACKUP HISTORY */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4">Backup History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="p-2">Backup Date</th>
                <th className="p-2">File Size</th>
                <th className="p-2">Created By</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {backups.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.size}</td>
                  <td className="p-2">{item.createdBy}</td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status === "Success"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-2 text-right space-x-2">
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                    <Button variant="destructive" size="sm">
                      Restore
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </Card>

    </div>
  )
}