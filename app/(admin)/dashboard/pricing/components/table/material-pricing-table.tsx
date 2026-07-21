"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Pencil } from "lucide-react"

import { MaterialPricing } from "../../types/pricing"

interface MaterialPricingTableProps {
  materials: MaterialPricing[]
  onEdit: (material: MaterialPricing) => void
}

export default function MaterialPricingTable({
  materials,
  onEdit,
}: MaterialPricingTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>

            <TableHead>Material</TableHead>

            <TableHead>Unit</TableHead>

            <TableHead>Base Cost</TableHead>

            <TableHead>Markup %</TableHead>

            <TableHead>Selling Price</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {materials.map((material) => {
            return (
              <TableRow key={material.id}>
                <TableCell>{material.category}</TableCell>

                <TableCell>{material.material_name}</TableCell>

                <TableCell>{material.unit}</TableCell>

                <TableCell>₱{(material.unit_cost ?? 0).toFixed(2)}</TableCell>

                <TableCell>
                  {(material.markup_percentage ?? 0).toFixed(2)}%
                </TableCell>

                <TableCell className="font-semibold text-green-600">
                  ₱{material.selling_price.toFixed(2)}
                </TableCell>

                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(material)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
