"use client"

import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
} from "../../constants/product-options"

interface ProductToolbarProps {
  search: string
  onSearchChange: (value: string) => void

  selectedCategory: string
  onCategoryChange: (value: string) => void

  selectedType: string
  onTypeChange: (value: string) => void

  onAddProduct: () => void
}

export function ProductToolbar({
  search,
  onSearchChange,

  selectedCategory,
  onCategoryChange,

  selectedType,
  onTypeChange,

  onAddProduct,
}: ProductToolbarProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            aria-label="Search products"
            className="h-10 rounded-lg bg-background/50 pl-9 shadow-none"
            placeholder="Search by product name or code..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Button
          onClick={onAddProduct}
          className="h-10 shrink-0 rounded-lg px-4 shadow-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:max-w-md sm:grid-cols-2">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger
            className="h-9 w-full rounded-lg bg-background/50 shadow-none"
            aria-label="Filter by category"
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>

            {PRODUCT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger
            className="h-9 w-full rounded-lg bg-background/50 shadow-none"
            aria-label="Filter by product type"
          >
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>

            {PRODUCT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
