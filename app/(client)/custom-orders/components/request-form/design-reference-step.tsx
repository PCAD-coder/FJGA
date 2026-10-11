"use client"

import {
  FileImage,
  ImagePlus,
  Upload,
  X,
} from "lucide-react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface ReferenceImage {
  id: string
  file: File
  previewUrl: string
}

export interface DesignReferenceData {
  images: ReferenceImage[]
  notes: string
}

interface DesignReferenceStepProps {
  data: DesignReferenceData
  onChange: (data: DesignReferenceData) => void
  onFileError?: (message: string) => void
}

const MAX_IMAGES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
]

export function DesignReferenceStep({
  data,
  onChange,
  onFileError,
}: DesignReferenceStepProps) {
  function addFiles(fileList: FileList | null) {
  if (!fileList) return

  const incomingFiles = Array.from(fileList)

  const invalidType = incomingFiles.some(
    (file) => !acceptedTypes.includes(file.type)
  )

  if (invalidType) {
    onFileError?.(
      "Only JPG, PNG, and WEBP images are allowed."
    )
    return
  }

  const oversizedFile = incomingFiles.some(
    (file) => file.size > MAX_FILE_SIZE
  )

  if (oversizedFile) {
    onFileError?.(
      "Each reference image must be 10 MB or smaller."
    )
    return
  }

  const availableSlots =
    MAX_IMAGES - data.images.length

  if (availableSlots <= 0) {
    onFileError?.(
      "You can upload a maximum of 5 reference images."
    )
    return
  }

  const files = incomingFiles.slice(
    0,
    availableSlots
  )

  if (incomingFiles.length > availableSlots) {
    onFileError?.(
      `Only ${availableSlots} more ${
        availableSlots === 1 ? "image is" : "images are"
      } allowed.`
    )
  }

  const newImages: ReferenceImage[] = files.map(
    (file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    })
  )

  onChange({
    ...data,
    images: [...data.images, ...newImages],
  })
}

  function removeImage(id: string) {
    const image = data.images.find(
      (item) => item.id === id
    )

    if (image) {
      URL.revokeObjectURL(image.previewUrl)
    }

    onChange({
      ...data,
      images: data.images.filter(
        (item) => item.id !== id
      ),
    })
  }

  function handleDrop(
    event: React.DragEvent<HTMLLabelElement>
  ) {
    event.preventDefault()

    addFiles(event.dataTransfer.files)
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <section>
        <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
            <FileImage className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <p className="font-medium">
              Help us understand your design
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Upload photos, screenshots, sketches, or
              drawings that show what you would like FJGA
              to build. These references will help our team
              understand the style and design you have in
              mind.
            </p>
          </div>
        </div>
      </section>

      {/* Upload */}
      <section className="space-y-3">
        <div>
          <Label className="text-base font-semibold">
            Reference Images
          </Label>

          <p className="mt-1 text-sm text-muted-foreground">
            You can upload up to {MAX_IMAGES} reference
            images.
          </p>
        </div>

        <label
          htmlFor="reference-images"
          onDragOver={(event) =>
            event.preventDefault()
          }
          onDrop={handleDrop}
          className={[
            "flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            data.images.length >= MAX_IMAGES
              ? "cursor-not-allowed bg-muted/40 opacity-60"
              : "hover:border-primary/50 hover:bg-muted/30",
          ].join(" ")}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>

          <p className="mt-4 font-medium">
            Drag and drop your reference images here
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse files from your device
          </p>

          <p className="mt-4 text-xs text-muted-foreground">
            JPG, PNG or WEBP • Maximum 10 MB per image
          </p>

          <input
            id="reference-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={data.images.length >= MAX_IMAGES}
            onChange={(event) => {
              addFiles(event.target.files)

              // Allows the same file to be selected again
              // after it has been removed.
              event.target.value = ""
            }}
            className="sr-only"
          />
        </label>
      </section>

      {/* Uploaded References */}
      {data.images.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-base font-semibold">
                Uploaded References
              </Label>

              <p className="mt-1 text-sm text-muted-foreground">
                Review the images before continuing.
              </p>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              {data.images.length}/{MAX_IMAGES}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {data.images.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
              >
                <img
                  src={image.previewUrl}
                  alt={`Reference ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Number */}
                <div className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur-sm">
                  Reference {index + 1}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() =>
                    removeImage(image.id)
                  }
                  aria-label={`Remove reference ${
                    index + 1
                  }`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {data.images.length < MAX_IMAGES && (
              <label
                htmlFor="reference-images-additional"
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
              >
                <ImagePlus className="h-6 w-6 text-muted-foreground" />

                <span className="mt-2 text-sm font-medium">
                  Add Image
                </span>

                <span className="mt-1 text-xs text-muted-foreground">
                  {MAX_IMAGES - data.images.length} left
                </span>

                <input
                  id="reference-images-additional"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) => {
                    addFiles(event.target.files)
                    event.target.value = ""
                  }}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </section>
      )}

      {/* Notes */}
      <section className="space-y-2">
        <Label htmlFor="reference-notes">
          What do you like about these references?
        </Label>

        <Textarea
          id="reference-notes"
          value={data.notes}
          onChange={(event) =>
            onChange({
              ...data,
              notes: event.target.value,
            })
          }
          placeholder="Example: I like the black aluminum frame and the four-panel sliding design in the first image. I would like clear glass similar to the second image."
          className="min-h-[130px] resize-y"
          maxLength={1000}
        />

        <div className="flex justify-between gap-4 text-xs text-muted-foreground">
          <p>
            Explain which parts of the references you want
            FJGA to follow.
          </p>

          <span>{data.notes.length}/1000</span>
        </div>
      </section>
    </div>
  )
}