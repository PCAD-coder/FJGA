"use client"

import Image from "next/image"

import { GalleryItem } from "../types/content"

import { Card, CardContent } from "@/components/ui/card"

interface Props {
  items: GalleryItem[]
}

export default function GalleryGrid({
  items,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      {items.map((item) => (
        <Card key={item.id}>

          <CardContent className="p-4">

            <div className="relative h-48 overflow-hidden rounded-lg border">

              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />

            </div>

            <div className="mt-3">

              <h3 className="font-medium">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {item.category}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Uploaded: {item.uploadedAt}
              </p>

            </div>

          </CardContent>

        </Card>
      ))}

    </div>
  )
}