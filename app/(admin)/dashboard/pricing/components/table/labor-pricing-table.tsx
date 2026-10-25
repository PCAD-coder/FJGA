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

import { Pencil } from "lucide-react"

import { LaborPricing } from "../../types/pricing"

interface LaborPricingTableProps {
  services: LaborPricing[]
  onEdit: (service: LaborPricing) => void
  onArchive: (service: LaborPricing) => void
}

export default function LaborPricingTable({
  services,
  onEdit,
  onArchive,
}: LaborPricingTableProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border/80 bg-card [&_td]:px-4 [&_td]:py-3 [&_th]:px-4">
      <Table className="min-w-[700px]">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Service Name</TableHead>

            <TableHead>Unit</TableHead>

            <TableHead>Labor Cost</TableHead>

            <TableHead>Markup</TableHead>

            <TableHead>Selling Price</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.service_name}</TableCell>

              <TableCell>{service.unit}</TableCell>

              <TableCell>&#8369;{service.labor_cost.toFixed(2)}</TableCell>

              <TableCell>{service.markup_percentage.toFixed(2)}%</TableCell>

              <TableCell className="font-semibold text-primary tabular-nums">
                &#8369;{service.selling_price.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(service)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onArchive(service)}
                  >
                    Archive
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
