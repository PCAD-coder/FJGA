import { Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Settings2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { AddMaterialDialog } from "./dialogs/add-material-dialog"

import type { InventoryInsert, InventoryMaterial } from "../types/inventory"

import { InventoryExportMenu } from "./inventory-export-menu"

import { ManageCategoriesDialog } from "./dialogs/manage-categories-dialog"

import { ManageColorsDialog } from "./dialogs/manage-colors-dialog"

import { ManageSpecificationsDialog } from "./dialogs/manage-specifications-dialog"

import { ManageUnitsDialog } from "./dialogs/manage-units-dialog"

import { ManageSeriesDialog } from "./dialogs/manage-series-dialog"

import { ManageThicknessesDialog } from "./dialogs/manage-thicknesses-dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InventoryToolbarProps {
  search: string
  setSearch: (value: string) => void

  categoryFilter: string
  setCategoryFilter: (value: string) => void

  glassCount: number
  aluminumCount: number
  lowStockCount: number

  onAddMaterial: (material: InventoryInsert) => Promise<void>

  stockStatusFilter: "all" | "in-stock" | "low-stock" | "out-of-stock"
  setStockStatusFilter: (
    value: "all" | "in-stock" | "low-stock" | "out-of-stock"
  ) => void

  expirationStatusFilter: "all" | "not-expiring" | "expiring-soon" | "expired"
  setExpirationStatusFilter: (
    value: "all" | "not-expiring" | "expiring-soon" | "expired"
  ) => void
  materials: InventoryMaterial[]
}

export function InventoryToolbar({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  glassCount,
  aluminumCount,
  lowStockCount,
  onAddMaterial,
  stockStatusFilter,
  setStockStatusFilter,
  expirationStatusFilter,
  setExpirationStatusFilter,
  materials,
}: InventoryToolbarProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border/80 bg-card p-4">
      <ToggleGroup
        type="single"
        value={categoryFilter}
        onValueChange={(value) => {
          if (value) {
            setCategoryFilter(value)
          }
        }}
        className="h-auto max-w-full flex-wrap justify-start gap-1"
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>

        <ToggleGroupItem value="Glass">Glass ({glassCount})</ToggleGroupItem>

        <ToggleGroupItem value="Aluminum">
          Aluminum ({aluminumCount})
        </ToggleGroupItem>

        <ToggleGroupItem value="low-stock">
          Low Stock ({lowStockCount})
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-[1_1_550px] flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-[1_1_220px]">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search materials..."
              aria-label="Search materials"
              className="h-9 w-full rounded-lg bg-background/50 pl-9 shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={stockStatusFilter}
            onValueChange={(value) =>
              setStockStatusFilter(
                value as "all" | "in-stock" | "low-stock" | "out-of-stock"
              )
            }
          >
            <SelectTrigger
              aria-label="Filter stock status"
              className="h-9 w-full min-w-0 flex-[1_1_150px] rounded-lg bg-background/50"
            >
              <SelectValue placeholder="Stock status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={expirationStatusFilter}
            onValueChange={(value) =>
              setExpirationStatusFilter(
                value as "all" | "not-expiring" | "expiring-soon" | "expired"
              )
            }
          >
            <SelectTrigger
              aria-label="Filter expiration status"
              className="h-9 w-full min-w-0 flex-[1_1_170px] rounded-lg bg-background/50"
            >
              <SelectValue placeholder="Expiration status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Expiration</SelectItem>
              <SelectItem value="not-expiring">Not Expiring</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex max-w-full flex-wrap gap-2 [&>button]:min-w-0">
          <InventoryExportMenu
            materials={materials}
            categoryFilter={categoryFilter}
            stockStatusFilter={stockStatusFilter}
            expirationStatusFilter={expirationStatusFilter}
            search={search}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings2 className="mr-2 h-4 w-4" />
                Manage Options
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-38 space-y-2 p-2">
              <ManageCategoriesDialog
                trigger={
                  <Button variant="ghost" className="w-full justify-start">
                    Categories
                  </Button>
                }
              />

              <ManageSpecificationsDialog
                trigger={
                  <Button variant="ghost" className="w-full justify-start">
                    Variants/Finishes
                  </Button>
                }
              />

              <ManageColorsDialog
                trigger={
                  <Button variant="ghost" className="w-full justify-start">
                    Colors
                  </Button>
                }
              />

              <ManageUnitsDialog
                trigger={
                  <Button variant="ghost" className="w-full justify-start">
                    Units
                  </Button>
                }
              />

              <ManageSeriesDialog
                trigger={
                  <Button variant="ghost" className="w-full justify-start">
                    Series
                  </Button>
                }
              />

              <ManageThicknessesDialog
                trigger={
                  <Button variant="ghost" className="w-full justify-start">
                    Thicknesses
                  </Button>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <AddMaterialDialog onSubmit={onAddMaterial} />
        </div>
      </div>
    </div>
  )
}
