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

import type { InventoryInsert } from "../types/inventory"

import { ManageCategoriesDialog } from "./dialogs/manage-categories-dialog"

import { ManageColorsDialog } from "./dialogs/manage-colors-dialog"

import { ManageSpecificationsDialog } from "./dialogs/manage-specifications-dialog"

import { ManageUnitsDialog } from "./dialogs/manage-units-dialog"

import { ManageSeriesDialog } from "./dialogs/manage-series-dialog"

import { ManageThicknessesDialog } from "./dialogs/manage-thicknesses-dialog"

interface InventoryToolbarProps {
  search: string
  setSearch: (value: string) => void

  categoryFilter: string
  setCategoryFilter: (value: string) => void

  glassCount: number
  aluminumCount: number
  lowStockCount: number

  onAddMaterial: (material: InventoryInsert) => Promise<void>
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
}: InventoryToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        type="single"
        value={categoryFilter}
        onValueChange={(value) => {
          if (value) {
            setCategoryFilter(value)
          }
        }}
        className="justify-start"
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

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <Search className="absolute top-2 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search materials..."
            className="w-full pl-9 md:w-[350px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
  <Button variant="outline">
    <Download className="mr-2 h-4 w-4" />
    Export
  </Button>

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        <Settings2 className="mr-2 h-4 w-4" />
        Manage Options
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      className="w-38 p-2 space-y-2"
    >
      <ManageCategoriesDialog
        trigger={
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            Categories
          </Button>
        }
      />

      <ManageSpecificationsDialog
        trigger={
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            Variants/Finishes
          </Button>
        }
      />

      <ManageColorsDialog
        trigger={
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            Colors
          </Button>
        }
      />

      <ManageUnitsDialog
        trigger={
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            Units
          </Button>
        }
      />

      <ManageSeriesDialog
        trigger={
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            Series
          </Button>
        }
      />

      <ManageThicknessesDialog
        trigger={
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
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
