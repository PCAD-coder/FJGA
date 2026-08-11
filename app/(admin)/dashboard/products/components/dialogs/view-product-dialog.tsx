"use client"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Product } from "../../types/product"

interface Props {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ViewProductDialog({
  product,
  open,
  onOpenChange,
}: Props) {
  if (!product) return null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            {product.product_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div className="relative h-72 rounded-lg overflow-hidden">

          {/*image here*/}

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-muted-foreground">
                Category
              </p>

              <p>{product.category}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Dimensions
              </p>

              <p>{product.dimension_unit}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Price
              </p>

              <p>
                ₱
      
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Status
              </p>

     
            </div>

          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Description
            </p>

            <p>{product.description}</p>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}