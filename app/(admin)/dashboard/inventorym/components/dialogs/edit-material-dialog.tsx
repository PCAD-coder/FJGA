"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type {
  InventoryMaterial,
  InventoryUpdate,
} from "../../types/inventory"

import {
  MATERIAL_CATEGORIES,
  MATERIAL_SPECIFICATIONS,
  MATERIAL_UNITS,
} from "../../constants/material-options"

interface EditMaterialDialogProps {
  material: InventoryMaterial

  onSubmit: (
    id: string,
    form: InventoryUpdate
  ) => Promise<void>
}

type EditMaterialForm = {
  material_name: string
  category: string
  specification: string
  size: string
  unit: string
  stock_quantity: string
  minimum_stock: string
  remarks: string
}

export function EditMaterialDialog({
  material,
  onSubmit,
}: EditMaterialDialogProps) {
  const [open, setOpen] = useState(false)

  const [form, setForm] =
    useState<EditMaterialForm>({
      material_name:
        material.material_name,
      category: material.category,
      specification:
        material.specification,
      size: material.size,
      unit: material.unit,
      stock_quantity: String(
        material.stock_quantity
      ),
      minimum_stock: String(
        material.minimum_stock
      ),
      remarks:
        material.remarks ?? "",
    })

  async function handleSave() {
    try {
      await onSubmit(material.id, {
        material_name:
          form.material_name,
        category: form.category,
        specification:
          form.specification,
        size: form.size,
        unit: form.unit,
        stock_quantity: Number(
          form.stock_quantity
        ),
        minimum_stock: Number(
          form.minimum_stock
        ),
        remarks: form.remarks,
      })

      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Material
          </DialogTitle>

          <DialogDescription>
            Update the inventory
            material information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>
                Material Name
              </Label>

              <Input
                value={
                  form.material_name
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    material_name:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Category
              </Label>

              <Select
                value={form.category}
                onValueChange={(
                  value
                ) =>
                  setForm({
                    ...form,
                    category: value,
                    specification:
                      "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {MATERIAL_CATEGORIES.map(
                    (
                      category
                    ) => (
                      <SelectItem
                        key={
                          category
                        }
                        value={
                          category
                        }
                      >
                        {category}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>
                Specification
              </Label>

              <Select
                value={
                  form.specification
                }
                onValueChange={(
                  value
                ) =>
                  setForm({
                    ...form,
                    specification:
                      value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specification" />
                </SelectTrigger>

                <SelectContent>
                  {form.category &&
                    MATERIAL_SPECIFICATIONS[
                      form.category as keyof typeof MATERIAL_SPECIFICATIONS
                    ]?.map(
                      (
                        spec
                      ) => (
                        <SelectItem
                          key={
                            spec
                          }
                          value={
                            spec
                          }
                        >
                          {spec}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Size
              </Label>

              <Input
                value={form.size}
                onChange={(e) =>
                  setForm({
                    ...form,
                    size:
                      e.target.value,
                  })
                }
              />
            </div>

          </div>

          <div className="grid grid-cols-3 gap-4">

            <div className="space-y-2">
              <Label>
                Unit
              </Label>

              <Select
                value={form.unit}
                onValueChange={(
                  value
                ) =>
                  setForm({
                    ...form,
                    unit: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>

                <SelectContent>
                  {MATERIAL_UNITS.map(
                    (unit) => (
                      <SelectItem
                        key={unit}
                        value={unit}
                      >
                        {unit}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Stock Quantity
              </Label>

              <Input
                type="number"
                value={
                  form.stock_quantity
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock_quantity:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Minimum Stock
              </Label>

              <Input
                type="number"
                value={
                  form.minimum_stock
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    minimum_stock:
                      e.target.value,
                  })
                }
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label>
              Remarks
            </Label>

            <Textarea
              value={
                form.remarks
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  remarks:
                    e.target.value,
                })
              }
            />
          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
          >
            Save Changes
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}