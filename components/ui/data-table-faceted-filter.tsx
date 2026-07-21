"use client"

import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

interface Option {
  label: string
  value: string
}

interface Props<TData> {
  table: Table<TData>
  column: string
  title: string
  options: Option[]
}

export function DataTableFacetedFilter<TData>({
  table,
  column,
  title,
  options,
}: Props<TData>) {
  const current =
    table.getColumn(column)?.getFilterValue() ?? ""

  return (
    <div className="flex items-center gap-2">

      <span className="text-sm font-medium">
        {title}
      </span>

      <div className="flex gap-2">

        {options.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={
              current === option.value
                ? "default"
                : "outline"
            }
            onClick={() =>
              table
                .getColumn(column)
                ?.setFilterValue(
                  current === option.value
                    ? ""
                    : option.value
                )
            }
          >
            {option.label}
          </Button>
        ))}

      </div>

    </div>
  )
}