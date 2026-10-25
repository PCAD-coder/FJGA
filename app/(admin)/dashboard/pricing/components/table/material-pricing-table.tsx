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
    <div className="min-w-0 overflow-hidden rounded-xl border border-border/80 bg-card [&_td]:px-4 [&_td]:py-3 [&_th]:px-4">
      <Table className="min-w-[700px]">
        <TableHeader className="bg-muted/50">
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

                <TableCell>
                  &#8369;{(material.unit_cost ?? 0).toFixed(2)}
                </TableCell>

                <TableCell>
                  {(material.markup_percentage ?? 0).toFixed(2)}%
                </TableCell>

                <TableCell className="font-semibold text-primary tabular-nums">
                  &#8369;{material.selling_price.toFixed(2)}
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
