"use client"

import { useState } from "react"
import { Ruler, Archive } from "lucide-react"

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
import { Label } from "@/components/ui/label"

import { useUnits } from "../../hooks/use-units"
import { createUnit, archiveUnit } from "../../services/unit.service"

interface ManageUnitsDialogProps {
  trigger?: React.ReactNode
}

export function ManageUnitsDialog({ trigger }: ManageUnitsDialogProps) {
  const [open, setOpen] = useState(false)
  const [newUnit, setNewUnit] = useState("")
  const [saving, setSaving] = useState(false)

  const { units, refresh } = useUnits()

  async function handleAddUnit() {
    if (!newUnit.trim()) return

    try {
      setSaving(true)

      await createUnit(newUnit.trim())

      setNewUnit("")

      await refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id: string) {
    try {
      await archiveUnit(id)

      await refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
        <Button variant="outline">
          <Ruler className="mr-2 h-4 w-4" />
          Manage Units
        </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Units</DialogTitle>

          <DialogDescription>Add or archive inventory units.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Unit</Label>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. Bundle"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
              />

              <Button onClick={handleAddUnit} disabled={saving}>
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Units</Label>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-3">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <span>{unit.unit_name}</span>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleArchive(unit.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {units.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No units available.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
