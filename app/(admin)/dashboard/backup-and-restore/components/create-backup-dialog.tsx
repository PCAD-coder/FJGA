"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { BackupRecord } from "../types/backup"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  onCreate: (backup: BackupRecord) => void
}

export default function CreateBackupDialog({
  open,
  onOpenChange,
  onCreate,
}: Props) {
  const [backupName, setBackupName] = useState("")

  const [backupType, setBackupType] =
    useState<BackupRecord["backupType"]>("Full Backup")

  const handleCreate = () => {
    onCreate({
      id: Date.now(),
      backupName,
      backupType,
      size: "0 MB",
      createdAt: new Date().toLocaleString(),
      status: "Completed",
    })

    setBackupName("")
    setBackupType("Full Backup")

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Backup</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Backup Name"
            value={backupName}
            onChange={(e) => setBackupName(e.target.value)}
          />

          <Select
            value={backupType}
            onValueChange={(value) =>
              setBackupType(value as BackupRecord["backupType"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Full Backup">Full Backup</SelectItem>

              <SelectItem value="Database Backup">Database Backup</SelectItem>

              <SelectItem value="Content Backup">Content Backup</SelectItem>

              <SelectItem value="Documents Backup">Documents Backup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={handleCreate}>Create Backup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
