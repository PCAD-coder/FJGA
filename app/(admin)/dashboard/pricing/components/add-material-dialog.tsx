"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { MaterialPricing } from "../types/pricing"

interface Props {
  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  onAdd: (
    material: MaterialPricing
  ) => void
}

export default function AddMaterialDialog({
  open,
  onOpenChange,
  onAdd,
}: Props) {
  const [category, setCategory] =
    useState("")

  const [material, setMaterial] =
    useState("")

  const [unit, setUnit] =
    useState("")

  const [baseCost, setBaseCost] =
    useState(0)

  const [markupPercentage,
    setMarkupPercentage] =
    useState(0)

  const sellingPrice =
    baseCost *
    (1 + markupPercentage / 100)

  const handleSave = () => {
    onAdd({
      id: Date.now(),
      category,
      material,
      unit,
      baseCost,
      markupPercentage,
    })

    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Add Material
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          />

          <Input
            placeholder="Material Name"
            value={material}
            onChange={(e) =>
              setMaterial(
                e.target.value
              )
            }
          />

          <Input
            placeholder="Unit"
            value={unit}
            onChange={(e) =>
              setUnit(
                e.target.value
              )
            }
          />

          <Input
            type="number"
            placeholder="Base Cost"
            value={baseCost}
            onChange={(e) =>
              setBaseCost(
                Number(
                  e.target.value
                )
              )
            }
          />

          <Input
            type="number"
            placeholder="Markup %"
            value={
              markupPercentage
            }
            onChange={(e) =>
              setMarkupPercentage(
                Number(
                  e.target.value
                )
              )
            }
          />

          <div className="rounded-lg border p-3">
            <p className="text-sm">
              Selling Price
            </p>

            <p className="font-bold text-lg">
              ₱
              {sellingPrice.toLocaleString()}
            </p>
          </div>

        </div>

        <DialogFooter>

          <Button
            onClick={
              handleSave
            }
          >
            Save
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}