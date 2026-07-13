"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { MaterialUsage } from "../types/analytics"

interface Props {
  materials: MaterialUsage[]
}

export default function MaterialsUsageTable({
  materials,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Most Used Materials
        </CardTitle>

      </CardHeader>

      <CardContent>

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Material
              </TableHead>

              <TableHead>
                Quantity Used
              </TableHead>

              <TableHead>
                Unit
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {materials.map(
              (material) => (
                <TableRow
                  key={material.id}
                >
                  <TableCell className="font-medium">
                    {
                      material.materialName
                    }
                  </TableCell>

                  <TableCell>
                    {
                      material.quantityUsed
                    }
                  </TableCell>

                  <TableCell>
                    {
                      material.unit
                    }
                  </TableCell>

                </TableRow>
              )
            )}

          </TableBody>

        </Table>

      </CardContent>

    </Card>
  )
}