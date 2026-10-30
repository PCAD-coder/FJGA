"use client"

import { getErrorMessage } from "@/lib/error-message"

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
  deleteContentImage,
  updateContentProject,
  uploadProjectImage,
  validateContentImage,
} from "../services/content"

import type { ContentProject } from "../types/content"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ContentProject | null
  onUpdated: (project: ContentProject) => void
}

export default function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onUpdated,
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
    if (!open || !project) {
      return
    }

    setTitle(project.title)
    setCategory(project.category ?? "")
    setDescription(project.description ?? "")
    setDisplayOrder(String(project.displayOrder))
    setSelectedImage(null)
    setPreviewUrl(null)
    setError(null)
  }, [open, project])

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
        getErrorMessage(error, "Unable to save content.")
      )
      event.target.value = ""

      setError(getErrorMessage(error, "Invalid image."))
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
    if (!project) {
      return
    }

    if (!title.trim()) {
      setError("Project title is required.")
      return
    }

    const parsedDisplayOrder = Number(displayOrder)

    if (!Number.isInteger(parsedDisplayOrder) || parsedDisplayOrder < 0) {
      setError("Display order must be a whole number of 0 or greater.")
      return
    }

    let newImageUrl: string | null = null

    try {
      setIsSaving(true)
      setError(null)

      if (selectedImage) {
        newImageUrl = await uploadProjectImage(selectedImage)
      }

      const updatedProject = await updateContentProject(project.id, {
        title,
        category,
        description,
        displayOrder: parsedDisplayOrder,
        imageUrl: newImageUrl ?? project.imageUrl,
      })

      toast.success("Project updated successfully.")
      onUpdated(updatedProject)
      onOpenChange(false)

      if (newImageUrl && project.imageUrl !== newImageUrl) {
        try {
          await deleteContentImage(project.imageUrl)
        } catch (cleanupError) {
          console.error(
            "Project updated, but the previous image could not be deleted:",
            cleanupError
          )
        }
      }
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to save content.")
      )
      console.error("Failed to update content project:", error)

      /*
       * If we successfully uploaded a replacement image but
       * the database update failed, remove the newly uploaded
       * orphan image.
       */
      if (newImageUrl) {
        try {
          await deleteContentImage(newImageUrl)
        } catch (cleanupError) {
          console.error(
            "Project update failed and new image cleanup also failed:",
            cleanupError
          )
        }
      }

      setError(
        getErrorMessage(error, "Failed to update project.")
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!project) {
    return null
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
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-project-title">Project Title</Label>

            <Input
              id="edit-project-title"
              value={title}
              disabled={isSaving}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-project-category">Category</Label>

            <Input
              id="edit-project-category"
              value={category}
              disabled={isSaving}
              onChange={(event) => setCategory(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-project-description">Description</Label>

            <Textarea
              id="edit-project-description"
              rows={4}
              value={description}
              disabled={isSaving}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-project-display-order">Display Order</Label>

            <Input
              id="edit-project-display-order"
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

            <div className="relative overflow-hidden rounded-lg border">
              <img
                src={previewUrl ?? project.imageUrl}
                alt={project.title}
                className="h-64 w-full object-cover"
              />

              {previewUrl && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-3 right-3"
                  disabled={isSaving}
                  onClick={removeSelectedImage}
                >
                  <X className="size-4" />

                  <span className="sr-only">Remove replacement image</span>
                </Button>
              )}

              {!previewUrl && (
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
                  <ImageIcon className="size-3.5" />
                  Current image
                </div>
              )}
            </div>

            <Input
              id="edit-project-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={isSaving}
              onChange={handleImageChange}
            />

            <Button type="button" variant="outline" disabled={isSaving} asChild>
              <label htmlFor="edit-project-image" className="cursor-pointer">
                <Upload className="mr-2 size-4" />
                Replace Image
              </label>
            </Button>

            <p className="text-xs text-muted-foreground">
              Leave the image unchanged if you only want to edit the project
              information.
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
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
