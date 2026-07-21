"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { useState } from "react"

interface UseDataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]

  globalFilterFn?: FilterFn<TData>
   
  enableRowSelection?: boolean

  initialPageSize?: number
}

export function useDataTable<TData>({
  data,
  columns,
  globalFilterFn,
}: UseDataTableProps<TData>) {
  const [sorting, setSorting] =
    useState<SortingState>([])

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([])

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})

  const [rowSelection, setRowSelection] =
    useState({})

  const [globalFilter, setGlobalFilter] =
    useState("")

  return useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },

    onSortingChange: setSorting,

    onColumnFiltersChange:
      setColumnFilters,

    onColumnVisibilityChange:
      setColumnVisibility,

    onRowSelectionChange:
      setRowSelection,

    onGlobalFilterChange:
      setGlobalFilter,

    getCoreRowModel:
      getCoreRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    getSortedRowModel:
      getSortedRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),

    globalFilterFn,
  })
}