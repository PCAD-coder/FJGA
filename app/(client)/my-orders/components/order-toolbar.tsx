"use client"

import { ArrowUpDown, Search } from "lucide-react"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type OrderSort = "newest" | "oldest" | "highest" | "lowest"

interface Props {
  search: string
  onSearch: (value: string) => void

  sort: OrderSort
  onSortChange: (value: OrderSort) => void
}

export default function OrderToolbar({
  search,
  onSearch,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by product or order number..."
          aria-label="Search orders"
          className="h-9 bg-background/60 pl-9 text-sm"
        />
      </div>

      {/* Sort */}
      <Select
        value={sort}
        onValueChange={(value) => onSortChange(value as OrderSort)}
      >
        <SelectTrigger
          aria-label="Sort orders"
          className="h-9 w-full bg-background/60 sm:w-[180px]"
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />

            <SelectValue />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>

          <SelectItem value="oldest">Oldest first</SelectItem>

          <SelectItem value="highest">Highest total</SelectItem>

          <SelectItem value="lowest">Lowest total</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
