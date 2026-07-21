"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import UserForm from "./user-form"

import { CreateUserDto } from "../../types/user-management"

interface AddUserDialogProps {
  open: boolean
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateUserDto) => Promise<void>
}

export default function AddUserDialog({
  open,
  loading = false,
  onOpenChange,
  onSubmit,
}: AddUserDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>

          <DialogDescription>
            Create a new client account and assign their role.
          </DialogDescription>
        </DialogHeader>

        <UserForm
          loading={loading}
          submitLabel="Create User"
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}