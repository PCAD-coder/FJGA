"use client"

import { useState } from "react"
import { Palette, Archive } from "lucide-react"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useCategories } from "../../hooks/use-categories"
import {
  getAllColors,
  createColor,
  archiveColor,
} from "../../services/color.service"
import type { MaterialColor } from "../../services/color.service"

interface ManageColorsDialogProps {
  trigger?: React.ReactNode
}

export function ManageColorsDialog( {
    trigger,
}: ManageColorsDialogProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState("")
  const [newColor, setNewColor] = useState("")
  const [saving, setSaving] = useState(false)
  const [colors, setColors] = useState<MaterialColor[]>([])

 const { colorCategories } =useCategories()

  async function loadColors() {
    const data = await getAllColors()
    setColors(data)
  }

  async function handleAddColor() {
    if (!category || !newColor.trim()) return

    try {
      setSaving(true)

      await createColor(category, newColor.trim())

      setNewColor("")

      await loadColors()
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id: string) {
    try {
      await archiveColor(id)

      await loadColors()
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
          await loadColors()
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
        <Button variant="outline">
          <Palette className="mr-2 h-4 w-4" />
          Manage Colors
        </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Colors</DialogTitle>

          <DialogDescription>
            Add or archive colors for inventory materials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Category</Label>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {colorCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.category_name}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>New Color</Label>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. Matte Black"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />

              <Button onClick={handleAddColor} disabled={saving}>
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Colors</Label>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-3">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div>
                    <p className="font-medium">{color.color_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {color.category}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleArchive(color.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {colors.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No colors available.
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
