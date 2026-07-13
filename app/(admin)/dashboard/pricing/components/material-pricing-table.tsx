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

import { MaterialPricing } from "../types/pricing"

interface Props {
  materials: MaterialPricing[]

  onEdit?: (
    material: MaterialPricing
  ) => void
}

export default function MaterialPricingTable({
  materials,
  onEdit,
}: Props) {
  return (
    <div className="rounded-lg border">

      <Table>

        <TableHeader>

          <TableRow>
            <TableHead>
              Category
            </TableHead>

            <TableHead>
              Material
            </TableHead>

            <TableHead>
              Unit
            </TableHead>

            <TableHead>
              Base Cost
            </TableHead>

            <TableHead>
              Markup %
            </TableHead>

            <TableHead>
              Selling Price
            </TableHead>

            <TableHead>
              Actions
            </TableHead>
          </TableRow>

        </TableHeader>

        <TableBody>

          {materials.map(
            (material) => {
              const sellingPrice =
                material.baseCost *
                (1 +
                  material.markupPercentage /
                    100)

              return (
                <TableRow
                  key={material.id}
                >
                  <TableCell>
                    <Badge
                      variant="secondary"
                    >
                      {
                        material.category
                      }
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium">
                    {
                      material.material
                    }
                  </TableCell>

                  <TableCell>
                    {material.unit}
                  </TableCell>

                  <TableCell>
                    ₱
                    {material.baseCost.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    {
                      material.markupPercentage
                    }
                    %
                  </TableCell>

                  <TableCell className="font-semibold text-green-600">
                    ₱
                    {sellingPrice.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits:
                          0,
                      }
                    )}
                  </TableCell>

                  <TableCell>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onEdit?.(
                          material
                        )
                      }
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>

                  </TableCell>
                </TableRow>
              )
            }
          )}

        </TableBody>

      </Table>

    </div>
  )
}