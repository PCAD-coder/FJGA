"use client"

import { useState } from "react"
import { CircleGauge, Archive } from "lucide-react"

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

import {
  getAllThicknesses,
  createThickness,
  archiveThickness,
} from "../../services/thickness.service"
import type { MaterialThickness } from "../../services/thickness.service"

interface ManageThicknessDialogProps {
  trigger?: React.ReactNode
}

export function ManageThicknessesDialog( {
    trigger,
}: ManageThicknessDialogProps) {
  const [open, setOpen] = useState(false)
  const [newThickness, setNewThickness] = useState("")
  const [saving, setSaving] = useState(false)
  const [thicknesses, setThicknesses] = useState<MaterialThickness[]>([])

  async function loadThicknesses() {
    const data = await getAllThicknesses()
    setThicknesses(data)
  }

  async function handleAddThickness() {
    if (!newThickness.trim()) return

    try {
      setSaving(true)

      await createThickness("Glass", newThickness.trim())

      setNewThickness("")

      await loadThicknesses()
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id: string) {
    try {
      await archiveThickness(id)

      await loadThicknesses()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={async (value) => {
        setOpen(value)

        if (value) {
          await loadThicknesses()
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
        <Button variant="outline">
          <CircleGauge className="mr-2 h-4 w-4" />
          Manage Thicknesses
        </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Glass Thicknesses</DialogTitle>

          <DialogDescription>
            Add or archive glass thickness options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Thickness</Label>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. 15 mm"
                value={newThickness}
                onChange={(e) => setNewThickness(e.target.value)}
              />

              <Button onClick={handleAddThickness} disabled={saving}>
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Thicknesses</Label>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-3">
              {thicknesses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <span>{item.thickness_name}</span>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleArchive(item.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {thicknesses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No glass thicknesses available.
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
