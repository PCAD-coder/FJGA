"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

interface ApproveRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  projectName?: string
}

export default function ApproveRequestDialog({
  open,
  onOpenChange,
  onConfirm,
  projectName,
}: ApproveRequestDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Approve Request
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to approve
            <strong>
              {" "}
              {projectName}
            </strong>
            ?
          </DialogDescription>

        </DialogHeader>

        <div className="rounded-lg border p-4 bg-muted/50">

          This request will be moved to
          Production Management and marked
          as Approved.

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
            Approve Request
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}