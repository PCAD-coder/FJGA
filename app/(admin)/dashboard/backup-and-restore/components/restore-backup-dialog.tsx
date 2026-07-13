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

  onRestore: () => void
}

export default function RestoreBackupDialog({
  open,
  onOpenChange,
  backup,
  onRestore,
}: Props) {
  if (!backup) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Backup</DialogTitle>

          <DialogDescription>
            This will restore the system using the selected backup and may
            overwrite current data.
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

          <Button onClick={onRestore}>Restore Backup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
