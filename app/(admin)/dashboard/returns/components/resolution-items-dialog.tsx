"use client"

import { useEffect, useState } from "react"

import {
  getReturnResolutionMaterials,
  getReturnResolutionLaborServices,
  getReturnResolutionDimensions,
  addReturnResolutionItems,
  type ReturnResolutionItemInput,
} from "../services/return-service"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { Plus, Trash2 } from "lucide-react"

interface MaterialOption {
  id: string
  material_name: string
  category: string | null
  specification: string | null
  size: string | null
  unit: string | null
  unit_cost: number
}

interface LaborOption {
  id: string
  service_name: string
  description: string | null
  unit: string | null
  labor_cost: number
}

interface ResolutionItemRow extends ReturnResolutionItemInput {
  id: string
}

interface ResolutionItemsDialogProps {
  open: boolean
  returnRequestId: string | null
  resolutionId: string | null
  resolutionType: "repair" | "replacement" | null
  onOpenChange: (open: boolean) => void
  onComplete: () => Promise<void>
}

function createEmptyItem(): ResolutionItemRow {
  return {
    id: crypto.randomUUID(),
    itemType: "material",
    inventoryMaterialId: null,
    laborServiceId: null,
    quantity: 1,
    width: null,
    height: null,
    depth: null,
    dimensionUnit: "cm",
    notes: "",
  }
}

export default function ResolutionItemsDialog({
  open,
  returnRequestId,
  resolutionId,
  resolutionType,
  onOpenChange,
  onComplete,
}: ResolutionItemsDialogProps) {
  const [materials, setMaterials] = useState<MaterialOption[]>([])
  const [laborServices, setLaborServices] = useState<LaborOption[]>([])
  const [productDimensions, setProductDimensions] = useState<{
    width: number | null
    height: number | null
    depth: number | null
    dimensionUnit: string
  } | null>(null)

  const [items, setItems] = useState<ResolutionItemRow[]>([createEmptyItem()])

  const [loadingOptions, setLoadingOptions] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    setItems([createEmptyItem()])
    setError(null)
    setSaving(false)

    async function loadOptions() {
      setLoadingOptions(true)

      if (!returnRequestId) {
        setError("The return request could not be identified.")
        setLoadingOptions(false)
        return
      }

      const [materialsResult, laborResult, dimensionsResult] =
        await Promise.all([
          getReturnResolutionMaterials(returnRequestId),
          getReturnResolutionLaborServices(returnRequestId),
          getReturnResolutionDimensions(returnRequestId),
        ])

      if (materialsResult.error) {
        setError(materialsResult.error)
        setLoadingOptions(false)
        return
      }

      if (laborResult.error) {
        setError(laborResult.error)
        setLoadingOptions(false)
        return
      }
      if (dimensionsResult.error) {
        setError(dimensionsResult.error)
        setLoadingOptions(false)
        return
      }

      setMaterials(materialsResult.data)
      setLaborServices(laborResult.data)
      setProductDimensions(dimensionsResult.data)

      setItems([
        {
          ...createEmptyItem(),
          width: dimensionsResult.data?.width ?? null,
          height: dimensionsResult.data?.height ?? null,
          depth: dimensionsResult.data?.depth ?? null,
          dimensionUnit: dimensionsResult.data?.dimensionUnit ?? "cm",
        },
      ])

      setLoadingOptions(false)
    }

    loadOptions()
  }, [open])

  function updateItem(id: string, changes: Partial<ResolutionItemRow>) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              ...changes,
            }
          : item
      )
    )
  }

  function changeItemType(id: string, itemType: "material" | "labor") {
    updateItem(id, {
      itemType,
      inventoryMaterialId: null,
      laborServiceId: null,
    })
  }

  function addItem() {
    setItems((previous) => [...previous, createEmptyItem()])
  }

  function removeItem(id: string) {
    setItems((previous) => {
      if (previous.length === 1) {
        return previous
      }

      return previous.filter((item) => item.id !== id)
    })
  }

  function validateItems(): string | null {
    if (!resolutionId) {
      return "A resolution could not be identified."
    }

    if (items.length === 0) {
      return "Add at least one material or labor item."
    }

    for (const item of items) {
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
        return "All quantities must be greater than zero."
      }

      if (item.itemType === "material" && !item.inventoryMaterialId) {
        return "Select a material for every material item."
      }

      if (item.itemType === "labor" && !item.laborServiceId) {
        return "Select a labor service for every labor item."
      }

      const dimensions = [item.width, item.height, item.depth]

      if (
        dimensions.some(
          (value) =>
            value !== null &&
            value !== undefined &&
            (!Number.isFinite(value) || value <= 0)
        )
      ) {
        return "Dimensions must be greater than zero."
      }
    }

    return null
  }

  async function handleSave() {
    setError(null)

    const validationError = validateItems()

    if (validationError) {
      setError(validationError)
      return
    }

    if (!resolutionId) return

    setSaving(true)

    try {
      const result = await addReturnResolutionItems(
        resolutionId,
        items.map((item) => ({
          itemType: item.itemType,
          inventoryMaterialId: item.inventoryMaterialId,
          laborServiceId: item.laborServiceId,
          quantity: item.quantity,
          width: item.width,
          height: item.height,
          depth: item.depth,
          dimensionUnit: item.dimensionUnit,
          notes: item.notes,
        }))
      )

      if (result.error) {
        throw new Error(result.error)
      }

      await onComplete()

      onOpenChange(false)
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save resolution items."
      )
    } finally {
      setSaving(false)
    }
  }

  const title =
    resolutionType === "replacement" ? "Replacement Items" : "Repair Items"

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!saving) {
          onOpenChange(value)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>
            Add the materials and labor required to complete this return
            resolution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loadingOptions && (
            <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
              Loading materials and labor services...
            </div>
          )}

          {!loadingOptions &&
            items.map((item, index) => (
              <div key={item.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Item {index + 1}</h3>

                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={saving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Item Type</Label>

                    <Select
                      value={item.itemType}
                      onValueChange={(value) =>
                        changeItemType(item.id, value as "material" | "labor")
                      }
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="material">Material</SelectItem>

                        <SelectItem value="labor">Labor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>

                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(item.id, {
                          quantity: Number(event.target.value) || 0,
                        })
                      }
                      disabled={saving}
                    />
                  </div>
                </div>

                {item.itemType === "material" && (
                  <div className="space-y-2">
                    <Label>Material</Label>

                    <Select
                      value={item.inventoryMaterialId ?? ""}
                      onValueChange={(value) =>
                        updateItem(item.id, {
                          inventoryMaterialId: value,
                        })
                      }
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>

                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.material_name}
                            {material.category ? ` — ${material.category}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {item.itemType === "labor" && (
                  <div className="space-y-2">
                    <Label>Labor Service</Label>

                    <Select
                      value={item.laborServiceId ?? ""}
                      onValueChange={(value) =>
                        updateItem(item.id, {
                          laborServiceId: value,
                        })
                      }
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select labor service" />
                      </SelectTrigger>

                      <SelectContent>
                        {laborServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.service_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Dimensions</Label>

                  <div className="grid gap-3 md:grid-cols-4">
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Width"
                      value={item.width ?? ""}
                      onChange={(event) =>
                        updateItem(item.id, {
                          width:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                      disabled={saving}
                    />

                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Height"
                      value={item.height ?? ""}
                      onChange={(event) =>
                        updateItem(item.id, {
                          height:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                      disabled={saving}
                    />

                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Depth"
                      value={item.depth ?? ""}
                      onChange={(event) =>
                        updateItem(item.id, {
                          depth:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                      disabled={saving}
                    />

                    <Input
                      placeholder="Unit"
                      value={item.dimensionUnit ?? ""}
                      onChange={(event) =>
                        updateItem(item.id, {
                          dimensionUnit: event.target.value,
                        })
                      }
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>

                  <Textarea
                    placeholder="Optional notes for this item..."
                    value={item.notes ?? ""}
                    onChange={(event) =>
                      updateItem(item.id, {
                        notes: event.target.value,
                      })
                    }
                    disabled={saving}
                  />
                </div>
              </div>
            ))}

          {!loadingOptions && (
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              disabled={saving}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || loadingOptions}
          >
            {saving ? "Saving..." : "Save Resolution Items"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
