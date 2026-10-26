"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

import { User } from "../../types/user-management"

import RoleBadge from "./role-badge"
import StatusBadge from "./status-badge"
import RowActions from "./row-actions"

interface ColumnOptions {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onChangeRole: (user: User) => void
}

export function getColumns({
  onEdit,
  onDelete,
  onChangeRole,
}: ColumnOptions): ColumnDef<User>[] {
  return [
    {
      accessorKey: "first_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        const user = row.original

        const firstName = user.first_name?.trim() ?? ""
const lastName = user.last_name?.trim() ?? ""
const fullName = user.full_name?.trim() ?? ""

const nameFromParts = [firstName, lastName].filter(Boolean).join(" ")

const displayName =
  nameFromParts ||
  fullName ||
  "Unknown User"

const initials = displayName
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((name) => name.charAt(0).toUpperCase())
  .join("")

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-border/60">
              <AvatarImage src={user.profile_image ?? ""} />

<AvatarFallback className="bg-primary/10 text-base font-medium text-primary">
  {initials || "U"}
</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
<p className="text-sm font-medium">
  {displayName}
</p>

              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )
      },
    },

    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },

    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <RowActions
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
          onChangeRole={onChangeRole}
        />
      ),
    },
  ]
}
