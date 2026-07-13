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

import {
  Textarea,
} from "@/components/ui/textarea"

interface Props {
  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  title?: string

  onConfirm: (
    reason: string
  ) => void
}

export default function DeclineReturnDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
}: Props) {
  const [reason, setReason] =
    useState("")

  const handleConfirm = () => {
    if (!reason.trim()) return

    onConfirm(reason)

    setReason("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value)

        if (!value) {
          setReason("")
        }
      }}
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Decline Return Request
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <p className="text-sm text-muted-foreground">
            Please provide a reason for declining
            {title && (
              <>
                {" "}
                <span className="font-medium text-foreground">
                  {title}
                </span>
              </>
            )}
            .
          </p>

          <Textarea
            placeholder="Example: Damage appears to be caused by improper handling after installation."
            value={reason}
            onChange={(e) =>
              setReason(
                e.target.value
              )
            }
            rows={5}
          />

        </div>

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
            Decline Request
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}