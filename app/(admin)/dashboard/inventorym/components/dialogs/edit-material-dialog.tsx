"use client"

import { type ReactNode, useState } from "react"
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

import type { InventoryMaterial, InventoryUpdate } from "../../types/inventory"

import { useUnits } from "../../hooks/use-units"

import { useSpecifications } from "../../hooks/use-specifications"

import { useCategories } from "../../hooks/use-categories"
import { useColors } from "../../hooks/use-colors"
import { useSeries } from "../../hooks/use-series"
import { useThicknesses } from "../../hooks/use-thicknesses"

interface EditMaterialDialogProps {
  material: InventoryMaterial
  trigger?: ReactNode
  onSubmit: (id: string, form: InventoryUpdate) => Promise<void>
}

type EditMaterialForm = {
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
  tracks_expiration: boolean
}

export function EditMaterialDialog({
  material,
  trigger,
  onSubmit,
}: EditMaterialDialogProps) {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<EditMaterialForm>({
    material_name: material.material_name,
    category: material.category,
    series: material.series ?? "",
    specification: material.specification,
    thickness: material.thickness ?? "",
    color: material.color ?? "",
    size: material.size,
    unit: material.unit,
    stock_quantity: String(material.stock_quantity),
    minimum_stock: String(material.minimum_stock),
    remarks: material.remarks ?? "",
    tracks_expiration: material.tracks_expiration,
  })

  const { categories, colorCategories } = useCategories()

  const { colors } = useColors(form.category)

  const { specifications } = useSpecifications(form.category)

  const { units } = useUnits()

  const { series } = useSeries()

  const { thicknesses } = useThicknesses(form.category)

  const categorySupportsColors = colorCategories.some(
    (category) => category.category_name === form.category
  )

  async function handleSave() {
    try {
      await onSubmit(material.id, {
        material_name: form.material_name,
        category: form.category,
        series: form.category === "Aluminum" ? form.series : null,
        specification: form.specification,
        thickness: form.category === "Glass" ? form.thickness : null,
        color: categorySupportsColors ? form.color : null,
        size: form.size,
        unit: form.unit,
        minimum_stock: Number(form.minimum_stock),
        remarks: form.remarks,
        tracks_expiration: form.tracks_expiration,
      })

      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="icon" variant="outline">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>

          <DialogDescription>
            Update the inventory material information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto py-4 pr-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Material Name</Label>

              <Input
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
                    thickness: "",
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
                    <SelectItem key={item.id} value={item.series_name}>
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
                  <SelectValue placeholder="Select specification" />
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
                      <SelectItem key={item.id} value={item.thickness_name}>
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
                value={form.color}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem key={unit.id} value={unit.unit_name}>
                      {unit.unit_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input type="number" value={form.stock_quantity} disabled />
              <p className="text-xs text-muted-foreground">
                Stock quantity is managed through inventory transactions.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Minimum Stock</Label>

              <Input
                type="number"
                min="0"
                step="0.0001"
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
            <Label>Remarks</Label>

            <Textarea
              value={form.remarks}
              onChange={(e) =>
                setForm({
                  ...form,
                  remarks: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <input
              id={`tracks-expiration-${material.id}`}
              type="checkbox"
              checked={form.tracks_expiration}
              disabled={material.stock_quantity > 0}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tracks_expiration: e.target.checked,
                }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="space-y-1">
              <Label htmlFor={`tracks-expiration-${material.id}`}>
                Track Expiration / Shelf Life
              </Label>

              {!material.tracks_expiration && material.stock_quantity > 0 ? (
                <p className="text-sm text-muted-foreground">
                  This material already has {material.stock_quantity}{" "}
                  {material.unit} in stock. Use the Enable Expiration Tracking
                  action from the inventory table so the existing stock can be
                  assigned to an initial expiration batch.
                </p>
              ) : material.tracks_expiration && material.stock_quantity > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Expiration tracking cannot be disabled while this material
                  still has inventory remaining. Existing expiration batches
                  must remain active until their stock is fully consumed or
                  properly removed.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enable this for materials that require expiration-date
                  tracking when restocked.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
