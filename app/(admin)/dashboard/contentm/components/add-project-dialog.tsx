"use client"

import { toast } from "sonner"

import { ChangeEvent, useEffect, useState } from "react"
import { ImageIcon, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  createContentProject,
  deleteContentImage,
  uploadProjectImage,
  validateContentImage,
} from "../services/content"

import type { ContentProject } from "../types/content"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (project: ContentProject) => void
}

export default function AddProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [displayOrder, setDisplayOrder] = useState("0")

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) {
      setTitle("")
      setCategory("")
      setDescription("")
      setDisplayOrder("0")
      setSelectedImage(null)
      setPreviewUrl(null)
      setError(null)
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      validateContentImage(file)

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save content."
      )
      event.target.value = ""

      setError(error instanceof Error ? error.message : "Invalid image.")
    }
  }

  function removeSelectedImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedImage(null)
    setPreviewUrl(null)
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Project title is required.")
      return
    }

    if (!selectedImage) {
      setError("Project image is required.")
      return
    }

    const parsedDisplayOrder = Number(displayOrder)

    if (!Number.isInteger(parsedDisplayOrder) || parsedDisplayOrder < 0) {
      setError("Display order must be a whole number of 0 or greater.")
      return
    }

    let uploadedImageUrl: string | null = null

    try {
      setIsSaving(true)
      setError(null)

      uploadedImageUrl = await uploadProjectImage(selectedImage)

      const project = await createContentProject({
        title,
        category,
        description,
        imageUrl: uploadedImageUrl,
        isVisible: true,
        displayOrder: parsedDisplayOrder,
      })

      toast.success("Project added successfully.")
      onCreated(project)
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save content."
      )
      console.error("Failed to create content project:", error)

      if (uploadedImageUrl) {
        try {
          await deleteContentImage(uploadedImageUrl)
        } catch (cleanupError) {
          console.error(
            "Project creation failed and uploaded image cleanup also failed:",
            cleanupError
          )
        }
      }

      setError(
        error instanceof Error ? error.message : "Failed to create project."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSaving) {
          onOpenChange(nextOpen)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title</Label>

            <Input
              id="project-title"
              placeholder="e.g. Sliding Glass Door"
              value={title}
              disabled={isSaving}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-category">Category</Label>

            <Input
              id="project-category"
              placeholder="e.g. Doors, Tables, Cabinets"
              value={category}
              disabled={isSaving}
              onChange={(event) => setCategory(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>

            <Textarea
              id="project-description"
              rows={4}
              placeholder="Describe the completed project..."
              value={description}
              disabled={isSaving}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-display-order">Display Order</Label>

            <Input
              id="project-display-order"
              type="number"
              min="0"
              step="1"
              value={displayOrder}
              disabled={isSaving}
              onChange={(event) => setDisplayOrder(event.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Lower numbers appear first on the website.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Project Image</Label>

            {previewUrl ? (
              <div className="relative overflow-hidden rounded-lg border">
                <img
                  src={previewUrl}
                  alt="Project preview"
                  className="h-64 w-full object-cover"
                />

                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-3 right-3"
                  disabled={isSaving}
                  onClick={removeSelectedImage}
                >
                  <X className="size-4" />
                  <span className="sr-only">Remove selected image</span>
                </Button>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30">
                <ImageIcon className="mb-2 size-8 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  No project image selected
                </p>
              </div>
            )}

            <Input
              id="project-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={isSaving}
              onChange={handleImageChange}
            />

            <Button type="button" variant="outline" disabled={isSaving} asChild>
              <label htmlFor="project-image" className="cursor-pointer">
                <Upload className="mr-2 size-4" />

                {selectedImage ? "Choose Different Image" : "Choose Image"}
              </label>
            </Button>

            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP. Maximum file size: 5 MB.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Adding..." : "Add Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
