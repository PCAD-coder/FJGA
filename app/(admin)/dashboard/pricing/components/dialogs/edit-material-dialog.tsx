"use client"

import { useEffect, useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { MaterialPricing } from "../../types/pricing"
import { updateMaterialPricing } from "../../services/pricing-service"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void

  material: MaterialPricing | null

  refresh: () => Promise<void>
}

export default function EditMaterialDialog({
  open,
  onOpenChange,
  material,
  refresh,
}: Props) {
  const [unitCost, setUnitCost] = useState(0)

  const [markup, setMarkup] = useState(0)

  const [saving, setSaving] = useState(false)

  useEffect(() => {
  if (!material) return

  setUnitCost(material.unit_cost ?? 0)
  setMarkup(material.markup_percentage ?? 0)
}, [material])

// ✅ Hook stays before any return
const sellingPrice = useMemo(() => {
  return unitCost * (1 + markup / 100)
}, [unitCost, markup])

// ✅ Conditional return after all hooks
if (!material) return null

const selectedMaterial = material

  async function handleSave() {
    try {
      setSaving(true)

      await updateMaterialPricing(selectedMaterial.id, {
        unit_cost: unitCost,
        markup_percentage: markup,
      })

      await refresh()

      onOpenChange(false)
    } catch (error) {
      console.error("Update Material Pricing:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Material Pricing</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Material</label>

            <Input value={selectedMaterial.material_name} disabled />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>

            <Input value={selectedMaterial.category} disabled />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Unit</label>

            <Input value={selectedMaterial.unit} disabled />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Unit Cost</label>

            <Input
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Markup Percentage
            </label>

            <Input
              type="number"
              value={markup}
              onChange={(e) => setMarkup(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Selling Price
            </label>

            <Input value={`₱${sellingPrice.toFixed(2)}`} disabled />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
