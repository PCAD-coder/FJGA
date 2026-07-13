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

import { LaborService } from "../types/pricing"

interface Props {
  services: LaborService[]

  onEdit?: (
    service: LaborService
  ) => void
}

export default function LaborPricingTable({
  services,
  onEdit,
}: Props) {
  return (
    <div className="rounded-lg border">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>
              Service Type
            </TableHead>

            <TableHead>
              Unit
            </TableHead>

            <TableHead>
              Rate
            </TableHead>

            <TableHead>
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {services.map(
            (service) => (
              <TableRow
                key={service.id}
              >
                <TableCell className="font-medium">
                  {
                    service.serviceType
                  }
                </TableCell>

                <TableCell>
                  {service.unit}
                </TableCell>

                <TableCell className="font-semibold">
                  ₱
                  {service.rate.toLocaleString()}
                </TableCell>

                <TableCell>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onEdit?.(
                        service
                      )
                    }
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>

                </TableCell>
              </TableRow>
            )
          )}

        </TableBody>

      </Table>

    </div>
  )
}