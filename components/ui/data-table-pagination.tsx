"use client"

import { Table } from "@tanstack/react-table"

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: Props<TData>) {
  return (
    <div className="flex items-center justify-between">

      <p className="text-sm text-muted-foreground">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </p>

      <div className="flex gap-2">

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

      </div>
    </div>
  )
}