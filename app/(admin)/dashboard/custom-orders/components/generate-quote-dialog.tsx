"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Plus, Trash2 } from "lucide-react"

interface MaterialItem {
  id: number
  material: string
  quantity: number
  unitPrice: number
}

interface Props {
  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  onSave: (quotation: {
    materials: MaterialItem[]
    laborCost: number
    deliveryFee: number
    totalCost: number
  }) => void
}

export default function GenerateQuoteDialog({
  open,
  onOpenChange,
  onSave,
}: Props) {
  const [materials, setMaterials] =
    useState<MaterialItem[]>([
      {
        id: 1,
        material: "",
        quantity: 1,
        unitPrice: 0,
      },
    ])

  const [laborCost, setLaborCost] =
    useState(0)

  const [deliveryFee, setDeliveryFee] =
    useState(0)

  const materialTotal =
    materials.reduce(
      (sum, item) =>
        sum +
        item.quantity *
          item.unitPrice,
      0
    )

  const total =
    materialTotal +
    laborCost +
    deliveryFee

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: Date.now(),
        material: "",
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeMaterial = (
    id: number
  ) => {
    setMaterials(
      materials.filter(
        (m) => m.id !== id
      )
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-4xl">

        <DialogHeader>
          <DialogTitle>
            Generate Quote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {materials.map(
            (item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2"
              >
                <Input
                  className="col-span-5"
                  placeholder="Material"
                  value={
                    item.material
                  }
                  onChange={(e) => {
                    const copy =
                      [
                        ...materials,
                      ]

                    copy[
                      index
                    ].material =
                      e.target.value

                    setMaterials(
                      copy
                    )
                  }}
                />

                <Input
                  type="number"
                  className="col-span-2"
                  placeholder="Qty"
                  value={
                    item.quantity
                  }
                  onChange={(e) => {
                    const copy =
                      [
                        ...materials,
                      ]

                    copy[
                      index
                    ].quantity =
                      Number(
                        e.target
                          .value
                      )

                    setMaterials(
                      copy
                    )
                  }}
                />

                <Input
                  type="number"
                  className="col-span-3"
                  placeholder="Unit Price"
                  value={
                    item.unitPrice
                  }
                  onChange={(e) => {
                    const copy =
                      [
                        ...materials,
                      ]

                    copy[
                      index
                    ].unitPrice =
                      Number(
                        e.target
                          .value
                      )

                    setMaterials(
                      copy
                    )
                  }}
                />

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() =>
                    removeMaterial(
                      item.id
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          )}

          <Button
            variant="outline"
            onClick={addMaterial}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Button>

          <Input
            type="number"
            placeholder="Labor Cost"
            value={laborCost}
            onChange={(e) =>
              setLaborCost(
                Number(
                  e.target.value
                )
              )
            }
          />

          <Input
            type="number"
            placeholder="Delivery Fee"
            value={deliveryFee}
            onChange={(e) =>
              setDeliveryFee(
                Number(
                  e.target.value
                )
              )
            }
          />

          <div className="rounded-lg border p-4">

            <p>
              Materials:
              ₱
              {materialTotal.toLocaleString()}
            </p>

            <p>
              Labor:
              ₱
              {laborCost.toLocaleString()}
            </p>

            <p>
              Delivery:
              ₱
              {deliveryFee.toLocaleString()}
            </p>

            <p className="font-bold text-lg mt-2">
              Total:
              ₱
              {total.toLocaleString()}
            </p>

          </div>

          <Button
            className="w-full"
            onClick={() =>
              onSave({
                materials,
                laborCost,
                deliveryFee,
                totalCost:
                  total,
              })
            }
          >
            Save Quote
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  )
}