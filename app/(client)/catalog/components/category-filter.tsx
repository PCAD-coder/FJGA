"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CategoryFilterProps {
  value: string
  onValueChange: (value: string) => void
  categories: string[]
}

export default function CategoryFilter({ value, onValueChange, categories }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        id="catalog-category-label"
        className="text-xs font-medium text-muted-foreground"
      >
        Category
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-labelledby="catalog-category-label"
          className="h-10 w-full min-w-0 rounded-md bg-card shadow-none sm:w-[200px]"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
