"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  title?: string

  onConfirm: () => void
}

export default function ArchiveReturnDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive Return Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to archive this return request?
          </p>

          {title && (
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Request</p>

              <p className="font-medium">{title}</p>
            </div>
          )}

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <p className="text-sm text-yellow-800">
              Archived requests will no longer appear in the active returns
              list, but can still be retrieved from records in the future.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>Archive Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
