"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { GalleryItem } from "../types/content"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  onAdd: (item: GalleryItem) => void
}

export default function AddGalleryItemDialog({
  open,
  onOpenChange,
  onAdd,
}: Props) {
  const [title, setTitle] = useState("")

  const [category, setCategory] = useState("")

  const [image, setImage] = useState("")

  const handleSave = () => {
    onAdd({
      id: Date.now(),
      title,
      category,
      image,
      uploadedAt: new Date().toLocaleDateString(),
    })

    onOpenChange(false)

    setTitle("")
    setCategory("")
    setImage("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Gallery Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
