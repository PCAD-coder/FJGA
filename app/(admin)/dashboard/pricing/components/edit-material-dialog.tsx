"use client"

import { useEffect, useState } from "react"

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

  material:
    | MaterialPricing
    | null

  onSave: (
    material: MaterialPricing
  ) => void
}

export default function EditMaterialDialog({
  open,
  onOpenChange,
  material,
  onSave,
}: Props) {
  const [formData,
    setFormData] =
    useState<MaterialPricing | null>(
      null
    )

  useEffect(() => {
    setFormData(material)
  }, [material])

  if (!formData)
    return null

  const sellingPrice =
    formData.baseCost *
    (1 +
      formData.markupPercentage /
        100)

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
            Edit Material
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input
            value={
              formData.category
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                category:
                  e.target.value,
              })
            }
          />

          <Input
            value={
              formData.material
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                material:
                  e.target.value,
              })
            }
          />

          <Input
            value={
              formData.unit
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                unit:
                  e.target.value,
              })
            }
          />

          <Input
            type="number"
            value={
              formData.baseCost
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                baseCost:
                  Number(
                    e.target.value
                  ),
              })
            }
          />

          <Input
            type="number"
            value={
              formData.markupPercentage
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                markupPercentage:
                  Number(
                    e.target.value
                  ),
              })
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
            onClick={() =>
              onSave(formData)
            }
          >
            Save Changes
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}