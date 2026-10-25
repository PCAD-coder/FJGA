"use client"

import { useState } from "react"
import AnalyticsPagination from "./analytics-pagination"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { MaterialUsage } from "../types/analytics"

interface Props {
  materials: MaterialUsage[]
}

export default function MaterialsUsageTable({ materials }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const page = Math.min(
    currentPage,
    Math.max(1, Math.ceil(materials.length / 10))
  )
  const visibleRows = materials.slice((page - 1) * 10, page * 10)

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <CardTitle className="text-base font-semibold">
          Most Used Materials
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 py-0 [&_td]:px-5 [&_td]:py-3 [&_th]:px-5 [&_th]:text-xs">
        <Table className="min-w-[420px]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Material</TableHead>

              <TableHead>Quantity Used</TableHead>

              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleRows.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">
                  {material.materialName}
                </TableCell>

                <TableCell>
                  {material.quantityUsed.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>

                <TableCell>{material.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <AnalyticsPagination
        total={materials.length}
        page={page}
        onPageChange={setCurrentPage}
        label="materials"
      />
    </Card>
  )
}
