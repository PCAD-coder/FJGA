"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RestoreReturnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  onConfirm: () => void
  saving: boolean
}

export default function RestoreReturnDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  saving,
}: RestoreReturnDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Make Return Active
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to make{" "}
            <strong>{title ?? "this return request"}</strong>{" "}
            active again?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? "Activating..." : "Make Active"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}