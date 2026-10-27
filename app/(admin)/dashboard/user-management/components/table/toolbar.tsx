"use client"

import { Table } from "@tanstack/react-table"

import { DataTableToolbar } from "@/components/ui/data-table-toolbar"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"

interface Props<TData> {
  table: Table<TData>
}

export default function Toolbar<TData>({
  table,
}: Props<TData>) {
  return (
    <DataTableToolbar
      table={table}
      searchPlaceholder="Search registered accounts..."
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
    </DataTableToolbar>
  )
}