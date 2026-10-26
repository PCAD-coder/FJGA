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

import { User } from "../../types/user-management"

interface DeleteUserDialogProps {
  open: boolean
  loading?: boolean
  user: User | null

  onOpenChange: (open: boolean) => void

  onConfirm: () => Promise<void>
}

export default function DeleteUserDialog({
  open,
  loading = false,
  user,
  onOpenChange,
  onConfirm,
}: DeleteUserDialogProps) {
  if (!user) return null

  const firstName = user.first_name?.trim() ?? ""
  const lastName = user.last_name?.trim() ?? ""
  const fullName = user.full_name?.trim() ?? ""

  const nameFromParts = [firstName, lastName].filter(Boolean).join(" ")

  const displayName = nameFromParts || fullName || "Unknown User"

  async function handleDelete() {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{displayName}</span>
            ?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction disabled={loading} onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
