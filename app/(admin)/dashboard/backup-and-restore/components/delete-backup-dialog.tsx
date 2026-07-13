"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { BackupRecord } from "../types/backup"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  backup: BackupRecord | null

  onDelete: () => void
}

export default function DeleteBackupDialog({
  open,
  onOpenChange,
  backup,
  onDelete,
}: Props) {
  if (!backup) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Backup</DialogTitle>

          <DialogDescription>
            This backup will be permanently deleted. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border p-4">
          <p className="font-medium">{backup.backupName}</p>

          <p className="text-sm text-muted-foreground">{backup.backupType}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={onDelete}>
            Delete Backup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
