"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  defaultImage?: string
  onImageChange?: (file: File | null) => void
}

export default function ImageUpload({
  defaultImage = "",
  onImageChange,
}: ImageUploadProps) {
  const [preview, setPreview] =
    useState(defaultImage)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0] ?? null

    if (!file) return

    const imageUrl =
      URL.createObjectURL(file)

    setPreview(imageUrl)

    onImageChange?.(file)
  }

  return (
    <div className="space-y-3">

      <Label>Product Image</Label>

      <div className="rounded-lg border overflow-hidden">

        {preview ? (
          <div className="relative h-56 w-full">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-56 flex flex-col items-center justify-center text-muted-foreground">
            <Upload className="h-10 w-10 mb-2" />
            <p>No Image Selected</p>
          </div>
        )}

      </div>

      <Input
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

    </div>
  )
}