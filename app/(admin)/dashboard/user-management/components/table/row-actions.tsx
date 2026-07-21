"use client"

import {
  MoreHorizontal,
  Pencil,
  Shield,
  KeyRound,
  Trash2,
} from "lucide-react"

import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { User } from "../../types/user-management"

interface Props {
  row: Row<User>
  onEdit?: (user: User) => void

  onChangeRole?: (user: User) => void  

  onDelete?: (user: User) => void
}

export default function RowActions({ row, onEdit, onChangeRole, onDelete}: Props) {
  const user = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem onClick={() => onEdit?.(user)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onChangeRole?.(user)}>
          <Shield className="mr-2 h-4 w-4" />
          Change Role
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(user)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}