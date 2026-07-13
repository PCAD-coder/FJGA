"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Textarea } from "@/components/ui/textarea"

interface DenyRequestDialogProps {
  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  onConfirm: (
    reason: string
  ) => void

  projectName?: string
}

export default function DenyRequestDialog({
  open,
  onOpenChange,
  onConfirm,
  projectName,
}: DenyRequestDialogProps) {
  const [reason, setReason] =
    useState("")

  const handleConfirm = () => {
    onConfirm(reason)

    setReason("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Deny Request
          </DialogTitle>

          <DialogDescription>
            Please provide a reason for
            denying{" "}
            <strong>
              {projectName}
            </strong>
            .
          </DialogDescription>

        </DialogHeader>

        <Textarea
          value={reason}
          onChange={(e) =>
            setReason(
              e.target.value
            )
          }
          placeholder="Enter denial reason..."
          rows={5}
        />

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={
              !reason.trim()
            }
          >
            Deny Request
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}