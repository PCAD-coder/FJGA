"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  User,
  UserRole,
} from "../../types/user-management"

interface ChangeRoleDialogProps {
  open: boolean

  loading?: boolean

  user: User | null

  onOpenChange: (open: boolean) => void

  onSubmit: (role: UserRole) => Promise<void>
}

export default function ChangeRoleDialog({
  open,
  loading = false,
  user,
  onOpenChange,
  onSubmit,
}: ChangeRoleDialogProps) {
  const [role, setRole] =
    useState<UserRole>("client")

  useEffect(() => {
    if (user) {
      setRole(user.role)
    }
  }, [user])

  if (!user) return null

  async function handleSave() {
    await onSubmit(role)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Change User Role
          </DialogTitle>

          <DialogDescription>
            Update the role for{" "}
            <span className="font-semibold">
              {user.first_name} {user.last_name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Select
            value={role}
            onValueChange={(value) =>
              setRole(value as UserRole)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="admin">
                Administrator
              </SelectItem>

              <SelectItem value="client">
                Client
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}