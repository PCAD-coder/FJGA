"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Download, Trash2, RefreshCcw } from "lucide-react"

import { DocumentTemplate } from "../types/content"

interface Props {
  document: DocumentTemplate

  onDownload: () => void

  onReplace: () => void

  onDelete: () => void
}

export default function DocumentTemplateCard({
  document,
  onDownload,
  onReplace,
  onDelete,
}: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{document.name}</h3>

            <p className="text-sm text-muted-foreground">
              Uploaded: {document.uploadedAt}
            </p>
          </div>

          <Badge>{document.type}</Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>

          <Button size="sm" variant="outline" onClick={onReplace}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Replace
          </Button>

          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
