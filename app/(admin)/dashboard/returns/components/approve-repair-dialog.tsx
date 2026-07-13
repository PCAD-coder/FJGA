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

interface Props {
  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  onConfirm: () => void

  requestTitle?: string
}

export default function ApproveRepairDialog({
  open,
  onOpenChange,
  onConfirm,
  requestTitle,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Approve Repair Request
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to approve
            this repair request?
          </DialogDescription>

        </DialogHeader>

        <div className="rounded-lg border p-4">

          <p className="text-sm text-muted-foreground">
            Request
          </p>

          <p className="font-medium">
            {requestTitle}
          </p>

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
            onClick={onConfirm}
          >
            Approve Repair
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}