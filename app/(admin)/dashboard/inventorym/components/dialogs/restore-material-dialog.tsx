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

interface RestoreMaterialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  materialName: string
  onConfirm: () => void
  saving: boolean
}

export function RestoreMaterialDialog({
  open,
  onOpenChange,
  materialName,
  onConfirm,
  saving,
}: RestoreMaterialDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Make Material Active
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to make{" "}
            <strong>{materialName}</strong> active again?
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