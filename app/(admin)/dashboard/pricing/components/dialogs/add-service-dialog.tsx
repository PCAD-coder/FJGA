"use client"

import { useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { createLaborService } from "../../services/pricing-service"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  refresh: () => Promise<void>
}

export default function AddServiceDialog({
  open,
  onOpenChange,
  refresh,
}: Props) {
  const [serviceName, setServiceName] = useState("")

  const [description, setDescription] = useState("")

  const [unit, setUnit] = useState("")

  const [laborCost, setLaborCost] = useState("")

  const [markup, setMarkup] = useState("")

  const [saving, setSaving] = useState(false)

  const sellingPrice = useMemo(() => {
    const cost = Number(laborCost) || 0
    const markupValue = Number(markup) || 0

    return cost * (1 + markupValue / 100)
  }, [laborCost, markup])

  async function handleSave() {
    try {
      setSaving(true)

      await createLaborService({
        service_name: serviceName,
        description,
        unit,
        labor_cost: Number(laborCost),
        markup_percentage: Number(markup),
      })

      await refresh()

      onOpenChange(false)

      setServiceName("")
      setDescription("")
      setUnit("")
      setLaborCost("")
      setMarkup("")
    } catch (error) {
      console.error("Create Labor Service:", JSON.stringify(error, null, 2))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Labor Service</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Service Name
            </label>

            <Input
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Unit</label>

            <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Labor Cost</label>

            <Input
              type="number"
              value={laborCost}
              onChange={(e) => setLaborCost(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Markup %</label>

            <Input
              type="number"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
