"use client"

import { useEffect, useRef } from "react"

export function UploadedPhotoPreview({ file }: { file: File }) {
  const imageRef = useRef<HTMLImageElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    if (imageRef.current) imageRef.current.src = url
    if (linkRef.current) linkRef.current.href = url

    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <figure className="overflow-hidden rounded-lg border bg-muted/30">
      {/* Local file previews use blob URLs and do not need image optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        alt={`Selected photo: ${file.name}`}
        className="max-h-64 w-full object-contain"
      />
      <figcaption className="border-t px-3 py-2 text-sm">
        <a
          ref={linkRef}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4"
          aria-label={`View ${file.name} at full size (opens in a new tab)`}
        >
          View full-size photo
        </a>
      </figcaption>
    </figure>
  )
}
