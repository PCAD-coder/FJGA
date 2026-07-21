"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

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
import type { InventoryInsert } from "../../types/inventory"

import {
  MATERIAL_CATEGORIES,
  MATERIAL_SPECIFICATIONS,
  MATERIAL_UNITS,
} from "../../constants/material-options"

interface AddMaterialDialogProps {
  onSubmit: (form: InventoryInsert) => Promise<void>
}
type AddMaterialForm = {
  material_name: string
  category: string
  specification: string
  size: string
  unit: string
  stock_quantity: string
  minimum_stock: string
  remarks: string
  is_active: boolean
}
const initialForm: AddMaterialForm = {
  material_name: "",
  category: "",
  specification: "",
  size: "",
  unit: "",
  stock_quantity: "",
  minimum_stock: "",
  remarks: "",
  is_active: true,
}

export function AddMaterialDialog({ onSubmit }: AddMaterialDialogProps) {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState(initialForm)

  async function handleSave() {
    await onSubmit({
      ...form,
      stock_quantity: Number(form.stock_quantity),
      minimum_stock: Number(form.minimum_stock),
    })

    setOpen(false)

    setForm(initialForm)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Material</DialogTitle>

          <DialogDescription>
            Enter the details of the inventory material.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Material Name</Label>

              <Input
                placeholder="e.g. 798 Series Aluminum"
                value={form.material_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    material_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>

              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    category: value,
                    specification: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {MATERIAL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Specification</Label>

              <Select
                value={form.specification}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    specification: value,
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
                    ]?.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>

              <Input
                value={form.size}
                onChange={(e) =>
                  setForm({
                    ...form,
                    size: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Unit</Label>

              <Select
                value={form.unit}
                onValueChange={(value) =>
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
                  {MATERIAL_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stock Quantity</Label>

              <Input
                type="number"
                value={form.stock_quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock_quantity: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Minimum Stock</Label>

              <Input
                type="number"
                value={form.minimum_stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minimum_stock: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Remarks </Label>
            <Textarea
              placeholder="Optional notes..."
              value={form.remarks ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  remarks: e.target.value,
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave}>Save Material</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
