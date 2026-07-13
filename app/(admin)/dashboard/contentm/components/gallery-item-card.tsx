"use client"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Pencil, Trash2 } from "lucide-react"

import { GalleryItem } from "../types/content"

interface Props {
  item: GalleryItem

  onEdit: () => void

  onDelete: () => void
}

export default function GalleryItemCard({ item, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative mb-4 h-[180px] overflow-hidden rounded-lg border">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">{item.title}</h3>

            <p className="text-sm text-muted-foreground">
              Uploaded: {item.uploadedAt}
            </p>
          </div>

          <Badge variant="secondary">{item.category}</Badge>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>

            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
