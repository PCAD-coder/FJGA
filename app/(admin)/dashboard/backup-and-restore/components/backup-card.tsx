"use client"

import { BackupRecord } from "../types/backup"

import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import { RotateCcw, Trash2, HardDrive } from "lucide-react"

interface Props {
  backup: BackupRecord

  onRestore: () => void

  onDelete: () => void
}

export default function BackupCard({ backup, onRestore, onDelete }: Props) {
  const statusStyles = {
    Completed: "bg-green-100 text-green-700",

    "In Progress": "bg-blue-100 text-blue-700",

    Failed: "bg-red-100 text-red-700",
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{backup.backupName}</h3>

            <p className="text-sm text-muted-foreground">{backup.backupType}</p>
          </div>

          <Badge className={statusStyles[backup.status]}>{backup.status}</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Backup Size</p>

            <p className="font-medium">{backup.size}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Created At</p>

            <p className="font-medium">{backup.createdAt}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={onRestore}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restore
          </Button>

          <Button variant="outline" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>

          <Button variant="secondary" disabled>
            <HardDrive className="mr-2 h-4 w-4" />
            Backup Ready
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
