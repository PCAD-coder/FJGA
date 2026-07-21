import {
  Download,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { AddMaterialDialog } from "./dialogs/add-material-dialog"

import type { InventoryInsert } from "../types/inventory"

interface InventoryToolbarProps {
  search: string
  setSearch: (value: string) => void

  categoryFilter: string
  setCategoryFilter: (value: string) => void

  glassCount: number
  aluminumCount: number
  lowStockCount: number

  onAddMaterial: (
    material: InventoryInsert
  ) => Promise<void>
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
        <ToggleGroupItem value="all">
          All
        </ToggleGroupItem>

        <ToggleGroupItem value="Glass">
          Glass ({glassCount})
        </ToggleGroupItem>

        <ToggleGroupItem value="Aluminum">
          Aluminum ({aluminumCount})
        </ToggleGroupItem>

        <ToggleGroupItem value="low-stock">
          Low Stock ({lowStockCount})
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search materials..."
            className="pl-9 w-full md:w-[350px]"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <AddMaterialDialog
            onSubmit={onAddMaterial}
          />
        </div>
      </div>
    </div>
  )
}