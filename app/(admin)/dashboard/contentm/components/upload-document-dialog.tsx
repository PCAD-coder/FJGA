"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { DocumentTemplate } from "../types/content"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  onAdd: (document: DocumentTemplate) => void
}

export default function UploadDocumentDialog({
  open,
  onOpenChange,
  onAdd,
}: Props) {
  const [name, setName] = useState("")

  const [type, setType] = useState<
    "Quotation" | "Invoice" | "Receipt" | "Contract"
  >("Quotation")

  const [fileName, setFileName] = useState("")

  const handleSave = () => {
    onAdd({
      id: Date.now(),
      name,
      type,
      fileName,
      uploadedAt: new Date().toLocaleDateString(),
    })

    onOpenChange(false)

    setName("")
    setFileName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Document Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Type (Quotation, Invoice, Receipt, Contract)"
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as
                  | "Quotation"
                  | "Invoice"
                  | "Receipt"
                  | "Contract"
              )
            }
          />

          <Input
            placeholder="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
