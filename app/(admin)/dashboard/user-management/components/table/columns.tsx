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
        <DataTableColumnHeader
          column={column}
          title="User"
        />
      ),
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.profile_image ?? ""} />

              <AvatarFallback>
                {user.first_name?.charAt(0)}
                {user.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">
                {user.first_name} {user.last_name}
              </p>

              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        )
      },
    },

    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Role"
        />
      ),
      cell: ({ row }) => (
        <RoleBadge role={row.original.role} />
      ),
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
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