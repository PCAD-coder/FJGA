"use client"

import { getErrorMessage } from "@/lib/error-message"

import { toast } from "sonner"

import { ChangeEvent, useEffect, useState } from "react"
import { ImageIcon, Upload, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { uploadHomepageImage, validateContentImage } from "../services/content"

import type { HomepageContent } from "../types/content"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: HomepageContent | null
  onSave: (content: HomepageContent) => void | Promise<void>
}

export default function EditHomepageDialog({
  open,
  onOpenChange,
  content,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<HomepageContent | null>(null)

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setFormData(content)
    setSelectedImage(null)
    setPreviewUrl(null)
    setError(null)
  }, [content, open])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (!formData) {
    return null
  }

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
        getErrorMessage(error, "Unable to save homepage content.")
      )
      event.target.value = ""

      setError(getErrorMessage(error, "Invalid image."))
    }
  }

  function handleRemoveSelectedImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedImage(null)
    setPreviewUrl(null)
    setError(null)
  }

  async function handleSave() {
    if (!formData) {
      return
    }

    if (!formData.heroTitle.trim()) {
      setError("Hero title is required.")
      return
    }

    if (!formData.heroDescription.trim()) {
      setError("Hero description is required.")
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      let heroImageUrl = formData.heroImageUrl

      if (selectedImage) {
        heroImageUrl = await uploadHomepageImage(selectedImage)
      }

      await onSave({
        ...formData,
        heroTitle: formData.heroTitle.trim(),
        heroDescription: formData.heroDescription.trim(),
        heroImageUrl,
      })
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to save homepage content.")
      )
      console.error("Failed to save homepage content:", error)

      setError(
        getErrorMessage(error, "Failed to save homepage content.")
      )
    } finally {
      setIsSaving(false)
    }
  }

  const displayedImage = previewUrl ?? formData.heroImageUrl

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
          <DialogTitle>Edit Homepage Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Hero Title</Label>

            <Input
              id="hero-title"
              placeholder="Hero Title"
              value={formData.heroTitle}
              disabled={isSaving}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  heroTitle: event.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Hero Image</Label>

            {displayedImage ? (
              <div className="relative overflow-hidden rounded-lg border">
                <img
                  src={displayedImage}
                  alt="Hero preview"
                  className="h-64 w-full object-cover"
                />

                {selectedImage && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3"
                    disabled={isSaving}
                    onClick={handleRemoveSelectedImage}
                  >
                    <X className="size-4" />
                    <span className="sr-only">Remove selected image</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30">
                <ImageIcon className="mb-2 size-8 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  No hero image uploaded
                </p>
              </div>
            )}

            <div>
              <Input
                id="hero-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={isSaving}
                onChange={handleImageChange}
              />

              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                asChild
              >
                <label htmlFor="hero-image" className="cursor-pointer">
                  <Upload className="mr-2 size-4" />

                  {displayedImage ? "Choose New Image" : "Choose Image"}
                </label>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP. Maximum file size: 5 MB.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-description">Hero Description</Label>

            <Textarea
              id="hero-description"
              rows={6}
              placeholder="Company Description"
              value={formData.heroDescription}
              disabled={isSaving}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  heroDescription: event.target.value,
                })
              }
            />
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
