"use client"

import { useMemo, useState } from "react"

import { BackupRecord } from "./types/backup"

import BackupCard from "./components/backup-card"
import BackupPagination from "./components/backup-pagination"

import CreateBackupDialog from "./components/create-backup-dialog"
import RestoreBackupDialog from "./components/restore-backup-dialog"
import DeleteBackupDialog from "./components/delete-backup-dialog"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Search, Plus, Database, HardDrive, RotateCcw } from "lucide-react"

const initialBackups: BackupRecord[] = [
  {
    id: 1,
    backupName: "Full System Backup",
    backupType: "Full Backup",
    size: "145 MB",
    createdAt: "May 24, 2026 • 11:30 PM",
    status: "Completed",
  },

  {
    id: 2,
    backupName: "Database Backup",
    backupType: "Database Backup",
    size: "52 MB",
    createdAt: "May 25, 2026 • 12:00 AM",
    status: "Completed",
  },

  {
    id: 3,
    backupName: "Documents Backup",
    backupType: "Documents Backup",
    size: "78 MB",
    createdAt: "May 25, 2026 • 8:15 AM",
    status: "Completed",
  },

  {
    id: 4,
    backupName: "Content Backup",
    backupType: "Content Backup",
    size: "34 MB",
    createdAt: "May 25, 2026 • 10:45 AM",
    status: "Completed",
  },
]

export default function BackupPage() {
  const [backups, setBackups] = useState(initialBackups)

  const [search, setSearch] = useState("")

  const [currentPage, setCurrentPage] = useState(1)

  const [createOpen, setCreateOpen] = useState(false)

  const [restoreOpen, setRestoreOpen] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)

  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(
    null
  )

  const handleCreateBackup = (backup: BackupRecord) => {
    setBackups((prev) => [backup, ...prev])
  }

  const handleDeleteBackup = () => {
    if (!selectedBackup) return

    setBackups((prev) =>
      prev.filter((backup) => backup.id !== selectedBackup.id)
    )

    setDeleteOpen(false)
  }

  const handleRestoreBackup = () => {
    setRestoreOpen(false)

    console.log("Restore backup:", selectedBackup)
  }

  const filteredBackups = useMemo(() => {
    return backups.filter(
      (backup) =>
        backup.backupName.toLowerCase().includes(search.toLowerCase()) ||
        backup.backupType.toLowerCase().includes(search.toLowerCase())
    )
  }, [backups, search])

  const perPage = 5

  const totalPages = Math.ceil(filteredBackups.length / perPage)

  const paginatedBackups = filteredBackups.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const latestBackup = backups[0]?.createdAt ?? "N/A"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backup & Restore</h1>

          <p className="text-muted-foreground">
            Manage system backups and recovery points.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Backup
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Database className="mx-auto mb-2 h-6 w-6 text-blue-600" />

            <p className="text-sm text-muted-foreground">Total Backups</p>

            <h2 className="text-3xl font-bold">{backups.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <HardDrive className="mx-auto mb-2 h-6 w-6 text-green-600" />

            <p className="text-sm text-muted-foreground">Storage Used</p>

            <h2 className="text-3xl font-bold">
              {backups.length * 50}
              MB
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <RotateCcw className="mx-auto mb-2 h-6 w-6 text-orange-600" />

            <p className="text-sm text-muted-foreground">Restore Points</p>

            <h2 className="text-3xl font-bold">{backups.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Database className="mx-auto mb-2 h-6 w-6 text-purple-600" />

            <p className="text-sm text-muted-foreground">Latest Backup</p>

            <p className="mt-2 text-sm font-medium">{latestBackup}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

        <Input
          className="pl-9"
          placeholder="Search backups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-5">
        {paginatedBackups.map((backup) => (
          <BackupCard
            key={backup.id}
            backup={backup}
            onRestore={() => {
              setSelectedBackup(backup)

              setRestoreOpen(true)
            }}
            onDelete={() => {
              setSelectedBackup(backup)

              setDeleteOpen(true)
            }}
          />
        ))}
      </div>

      <BackupPagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
      />

      <CreateBackupDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreateBackup}
      />

      <RestoreBackupDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        backup={selectedBackup}
        onRestore={handleRestoreBackup}
      />

      <DeleteBackupDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        backup={selectedBackup}
        onDelete={handleDeleteBackup}
      />
    </div>
  )
}
