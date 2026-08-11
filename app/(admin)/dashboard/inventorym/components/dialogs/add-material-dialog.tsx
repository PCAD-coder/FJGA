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

import { useUnits } from "../../hooks/use-units"

import { useSpecifications } from "../../hooks/use-specifications"

import { useCategories } from "../../hooks/use-categories"
import { useColors } from "../../hooks/use-colors"
import { useSeries } from "../../hooks/use-series"
import { useThicknesses } from "../../hooks/use-thicknesses"

interface AddMaterialDialogProps {
  onSubmit: (form: InventoryInsert) => Promise<void>
}
type AddMaterialForm = {
  material_name: string
  category: string
  series: string
  specification: string
  thickness: string
  color: string
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
  series:"",
  specification: "",
  thickness:"",
  color: " ",
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
  const { categories, colorCategories } = useCategories()

  const { colors } = useColors(form.category)

  const { units } = useUnits()

  const { series } = useSeries()

  const { thicknesses } = useThicknesses(form.category)

  const categorySupportsColors = colorCategories.some(
    (category) => category.category_name === form.category
  )

  const { specifications } = useSpecifications(form.category)

  async function handleSave() {
    await onSubmit({
      ...form,
      stock_quantity: Number(form.stock_quantity),
      minimum_stock: Number(form.minimum_stock),
      series:form.category === "Aluminum"? form.series: null,
      thickness:form.category === "Glass"? form.thickness: null,
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
                    series: "",
                    specification: "",
                    thickness:"",
                    color: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.category_name}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.category === "Aluminum" && (
  <div className="space-y-2">
    <Label>Series</Label>

    <Select
      value={form.series}
      onValueChange={(value) =>
        setForm({
          ...form,
          series: value,
        })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select aluminum series" />
      </SelectTrigger>

      <SelectContent>
        {series.map((item) => (
          <SelectItem
            key={item.id}
            value={item.series_name}
          >
            {item.series_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Variant/Finish</Label>

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
                  <SelectValue placeholder="Select Variant/Finish" />
                </SelectTrigger>

                <SelectContent>
                  {specifications.map((spec) => (
                    <SelectItem key={spec.id} value={spec.specification_name}>
                      {spec.specification_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.category === "Glass" && (
  <div className="space-y-2">
    <Label>Thickness</Label>

    <Select
      value={form.thickness}
      onValueChange={(value) =>
        setForm({
          ...form,
          thickness: value,
        })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select glass thickness" />
      </SelectTrigger>

      <SelectContent>
        {thicknesses.map((item) => (
          <SelectItem
            key={item.id}
            value={item.thickness_name}
          >
            {item.thickness_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}

            <div className="space-y-2">
              <Label>Color</Label>

              <Select
                value={form.color ?? ""}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    color: value,
                  })
                }
                disabled={!categorySupportsColors}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>

                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={color.color_name}>
                      {color.color_name}
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
                  {units.map((unit) => (
  <SelectItem
    key={unit.id}
    value={unit.unit_name}
  >
    {unit.unit_name}
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
