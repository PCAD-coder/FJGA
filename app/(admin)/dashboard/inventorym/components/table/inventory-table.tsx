import { Pencil, Archive } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Card, CardContent } from "@/components/ui/card"

import type { InventoryMaterial, InventoryUpdate } from "../../types/inventory"

import { EditMaterialDialog } from "../dialogs/edit-material-dialog"
import { ArchiveMaterialDialog } from "../dialogs/archive-material-dialog"

interface InventoryTableProps {
  materials: InventoryMaterial[]

  onEditMaterial: (id: string, form: InventoryUpdate) => Promise<void>
  onArchiveMaterial: (id: string) => Promise<void>
}

function getStatus(stock: number, minimumStock: number) {
  if (stock === 0) {
    return {
      label: "Out of Stock",
      variant: "destructive" as const,
    }
  }

  if (stock <= minimumStock) {
    return {
      label: "Low Stock",
      variant: "secondary" as const,
    }
  }

  return {
    label: "Healthy",
    variant: "default" as const,
  }
}

export function InventoryTable({
  materials,
  onEditMaterial,
  onArchiveMaterial,
}: InventoryTableProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Series</TableHead>
              <TableHead>Finish / Type</TableHead>
              <TableHead>Thickness</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Minimum Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {materials.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-8 text-center text-muted-foreground"
                >
                  No materials found.
                </TableCell>
              </TableRow>
            ) : (
              materials.map((material) => {
                const status = getStatus(
                  material.stock_quantity,
                  material.minimum_stock
                )

                return (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      {material.material_name}
                    </TableCell>

                    <TableCell>{material.category}</TableCell>

                    <TableCell>{material.series ?? "—"}</TableCell>

                    <TableCell>{material.specification}</TableCell>

                    <TableCell>{material.thickness ?? "—"}</TableCell>

                    <TableCell>{material.size}</TableCell>

                    <TableCell>{material.unit}</TableCell>

                    <TableCell>{material.stock_quantity}</TableCell>

                    <TableCell>{material.minimum_stock}</TableCell>

                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <EditMaterialDialog
                          material={material}
                          onSubmit={onEditMaterial}
                        />

                        <ArchiveMaterialDialog
                          material={material}
                          onArchive={onArchiveMaterial}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
