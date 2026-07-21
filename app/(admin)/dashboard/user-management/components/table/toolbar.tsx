"use client"

import { Table } from "@tanstack/react-table"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { DataTableToolbar } from "@/components/ui/data-table-toolbar"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"

interface Props<TData> {
  table: Table<TData>
  onAddUser?: () => void
}

export default function Toolbar<TData>({
  table,
  onAddUser,
}: Props<TData>) {
  return (
    <DataTableToolbar
      table={table}
      searchPlaceholder="Search users..."
    >
      <DataTableFacetedFilter
        table={table}
        column="role"
        title="Role"
        options={[
          {
            label: "Administrator",
            value: "admin",
          },
          {
            label: "Client",
            value: "client",
          },
        ]}
      />

      <DataTableFacetedFilter
        table={table}
        column="status"
        title="Status"
        options={[
          {
            label: "Active",
            value: "Active",
          },
          {
            label: "Inactive",
            value: "Inactive",
          },
        ]}
      />

      <DataTableViewOptions table={table} />

      <Button className="ml-auto" onClick={onAddUser}>
        <Plus className="mr-2 h-4 w-4" />
        Add New User
      </Button>
    </DataTableToolbar>
  )
}