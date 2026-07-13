"use client"

import { DocumentTemplate } from "../types/content"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  Download,
  Trash2,
} from "lucide-react"

interface Props {
  documents: DocumentTemplate[]
}

export default function DocumentList({
  documents,
}: Props) {
  return (
    <div className="space-y-4">

      {documents.map((document) => (
        <Card key={document.id}>

          <CardContent className="flex items-center justify-between p-4">

            <div>

              <h3 className="font-medium">
                {document.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {document.type}
              </p>

              <p className="text-xs text-muted-foreground">
                Uploaded: {document.uploadedAt}
              </p>

            </div>

            <div className="flex gap-2">

              <Button
                size="sm"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>

              <Button
                size="sm"
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>

            </div>

          </CardContent>

        </Card>
      ))}

    </div>
  )
}