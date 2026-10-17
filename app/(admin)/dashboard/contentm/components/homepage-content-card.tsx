"use client"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Pencil } from "lucide-react"

import { HomepageContent } from "../types/content"

interface Props {
  content: HomepageContent

  onEdit: () => void
}

export default function HomepageContentCard({ content, onEdit }: Props) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Homepage Content</h2>

            <p className="text-sm text-muted-foreground">
              Manage hero section and company description
            </p>
          </div>

          <Button variant="outline" onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Content
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <div>
            <div className="relative h-[220px] overflow-hidden rounded-lg border">
              {content.heroImageUrl ? (
  <Image
    src={content.heroImageUrl}
    alt={content.heroTitle}
    width={1200}
    height={600}
    className="h-64 w-full rounded-lg object-cover"
  />
) : (
  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed bg-muted/30">
    <span className="text-sm text-muted-foreground">
      No hero image uploaded
    </span>
  </div>
)}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">Hero Title</p>

              <p className="text-lg font-semibold">{content.heroTitle}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Company Description
              </p>

              <div className="rounded-md bg-muted p-3 text-sm">
                {content.heroDescription}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
