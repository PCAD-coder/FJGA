"use client"

import { useState } from "react"
import { FolderPlus, Archive } from "lucide-react"

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

import { useCategories } from "../../hooks/use-categories"
import {
  createCategory,
  archiveCategory,
} from "../../services/category.service"

interface ManageCategoriesDialogProps {
  trigger?: React.ReactNode
}

export function ManageCategoriesDialog({
  trigger,
}: ManageCategoriesDialogProps) {
  const [open, setOpen] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [saving, setSaving] = useState(false)

  const { categories, refresh } = useCategories()

  async function handleAddCategory() {
    if (!newCategory.trim()) return

    try {
      setSaving(true)

      await createCategory(newCategory.trim())

      setNewCategory("")

      await refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id: string) {
    try {
      await archiveCategory(id)

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
            <FolderPlus className="mr-2 h-4 w-4" />
            Manage Categories
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>

          <DialogDescription>
            Add or archive inventory material categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Category</Label>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. Stainless Steel"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <Button onClick={handleAddCategory} disabled={saving}>
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Categories</Label>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <span>{category.category_name}</span>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleArchive(category.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No categories available.
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
