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

  onConfirm: () => void

  clientName?: string
}

export default function ApproveFeedbackDialog({
  open,
  onOpenChange,
  onConfirm,
  clientName,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Feedback</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Publish feedback from{" "}
          <span className="font-medium text-foreground">{clientName}</span>?
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
