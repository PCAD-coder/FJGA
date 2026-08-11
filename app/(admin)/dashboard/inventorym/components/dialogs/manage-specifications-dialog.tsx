"use client"

import { useState } from "react"
import { Layers, Archive } from "lucide-react"

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
  getAllSpecifications,
  createSpecification,
  archiveSpecification,
} from "../../services/specification.service"
import type { MaterialSpecification } from "../../services/specification.service"

interface ManageSpecificationsDialogProps {
  trigger?: React.ReactNode
}

export function ManageSpecificationsDialog( {
  trigger,
}: ManageSpecificationsDialogProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState("")
  const [newSpecification, setNewSpecification] = useState("")
  const [saving, setSaving] = useState(false)
  const [specifications, setSpecifications] = useState<MaterialSpecification[]>(
    []
  )

  const { categories } = useCategories()

  async function loadSpecifications() {
    const data = await getAllSpecifications()
    setSpecifications(data)
  }

  async function handleAddSpecification() {
    if (!category || !newSpecification.trim()) return

    try {
      setSaving(true)

      await createSpecification(category, newSpecification.trim())

      setNewSpecification("")

      await loadSpecifications()
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id: string) {
    try {
      await archiveSpecification(id)

      await loadSpecifications()
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
          await loadSpecifications()
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
        <Button variant="outline">
          <Layers className="mr-2 h-4 w-4" />
          {/*Manage Variants*/}
        </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Variants or Finishes</DialogTitle>

          <DialogDescription>
            Add or archive material variants or finishes for each category.
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
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.category_name}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>New Specification</Label>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. Powder Coated"
                value={newSpecification}
                onChange={(e) => setNewSpecification(e.target.value)}
              />

              <Button onClick={handleAddSpecification} disabled={saving}>
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Specifications</Label>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-3">
              {specifications.map((spec) => (
                <div
                  key={spec.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div>
                    <p className="font-medium">{spec.specification_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {spec.category_name}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleArchive(spec.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {specifications.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No specifications available.
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
