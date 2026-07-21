"use client"

import { Table } from "@tanstack/react-table"

import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: Props<TData>) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) =>
                column.toggleVisibility(!!value)
              }
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}

      </DropdownMenuContent>

    </DropdownMenu>
  )
}