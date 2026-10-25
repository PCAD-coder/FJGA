"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CategoryFilter() {
  return (
    <div className="flex items-center gap-3">
      <span
        id="catalog-category-label"
        className="text-xs font-medium text-muted-foreground"
      >
        Category
      </span>
      <Select defaultValue="All">
        <SelectTrigger
          aria-labelledby="catalog-category-label"
          className="h-10 w-full min-w-0 rounded-md bg-card shadow-none sm:w-[200px]"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          <SelectItem value="Furniture">Furniture</SelectItem>
          <SelectItem value="Windows">Windows</SelectItem>
          <SelectItem value="Doors">Doors</SelectItem>
          <SelectItem value="Partitions">Partitions</SelectItem>
          <SelectItem value="Bathroom">Bathroom</SelectItem>
          <SelectItem value="Railings">Railings</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
