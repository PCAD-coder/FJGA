"use client"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

import { CustomOrder } from "../types/custom-order"

interface Props {
  order: CustomOrder | null

  open: boolean

  onOpenChange: (
    open: boolean
  ) => void
}

export default function ViewRequestDialog({
  order,
  open,
  onOpenChange,
}: Props) {
  if (!order) return null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-4xl">

        <DialogHeader>

          <DialogTitle>
            {order.projectName}
          </DialogTitle>

        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="relative h-[300px] rounded-lg overflow-hidden border">

            <Image
              src={order.image}
              alt={order.projectName}
              fill
              className="object-cover"
            />

          </div>

          <div className="space-y-4">

            <div>
              <h4 className="font-medium">
                Client
              </h4>

              <p>
                {order.clientName}
              </p>
            </div>

            <div>
              <h4 className="font-medium">
                Dimensions
              </h4>

              <p>
                {order.width}ft ×{" "}
                {order.height}ft
              </p>
            </div>

            <div>
              <h4 className="font-medium">
                Notes
              </h4>

              <p>
                {order.notes}
              </p>
            </div>

            <div>
              <h4 className="font-medium">
                Status
              </h4>

              <Badge>
                {order.status}
              </Badge>
            </div>

            {order.denialReason && (
              <div>
                <h4 className="font-medium">
                  Denial Reason
                </h4>

                <p>
                  {
                    order.denialReason
                  }
                </p>
              </div>
            )}

          </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}