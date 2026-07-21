"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import UserForm from "./user-form"

import {
  UpdateUserDto,
  User,
} from "../../types/user-management"

interface EditUserDialogProps {
  open: boolean

  user: User | null

  loading?: boolean

  onOpenChange: (open: boolean) => void

  onSubmit: (
    data: UpdateUserDto
  ) => Promise<void>
}

export default function EditUserDialog({
  open,
  user,
  loading = false,
  onOpenChange,
  onSubmit,
}: EditUserDialogProps) {
    if (!user) return null
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>

          <DialogDescription>
            Update the user's information.
          </DialogDescription>
        </DialogHeader>

        <UserForm
          defaultValues={user}
          loading={loading}
          submitLabel="Save Changes"
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}