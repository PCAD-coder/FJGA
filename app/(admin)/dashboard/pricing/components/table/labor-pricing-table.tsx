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
  onArchive
}: LaborPricingTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
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

              <TableCell>₱{service.labor_cost.toFixed(2)}</TableCell>

              <TableCell>{service.markup_percentage.toFixed(2)}%</TableCell>

              <TableCell className="font-semibold text-green-600">
                ₱{service.selling_price.toFixed(2)}
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
