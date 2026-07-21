"use client"

import {
  flexRender,
  Table as TanStackTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData> {
  table: TanStackTable<TData>

  toolbar?: React.ReactNode

  pagination?: React.ReactNode
}

export function DataTable<TData>({
  table,
  toolbar,
  pagination,
}: DataTableProps<TData>) {
  return (
    <div className="space-y-4">

      {toolbar}

      <div className="rounded-md border overflow-hidden">

        <Table>

          <TableHeader>

            {table.getHeaderGroups().map((headerGroup) => (

              <TableRow key={headerGroup.id}>

                {headerGroup.headers.map((header) => (

                  <TableHead key={header.id}>

                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                  </TableHead>

                ))}

              </TableRow>

            ))}

          </TableHeader>

          <TableBody>

            {table.getRowModel().rows.length ? (

              table.getRowModel().rows.map((row) => (

                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >

                  {row.getVisibleCells().map((cell) => (

                    <TableCell key={cell.id}>

                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}

                    </TableCell>

                  ))}

                </TableRow>

              ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-32 text-center"
                >
                  No results found.
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </div>

      {pagination}

    </div>
  )
}