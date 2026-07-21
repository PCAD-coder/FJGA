"use client"

import { useState } from "react"

import { Archive } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import type { InventoryMaterial } from "../../types/inventory"

interface ArchiveMaterialDialogProps {
  material: InventoryMaterial

  onArchive: (
    id: string
  ) => Promise<void>
}

export function ArchiveMaterialDialog({
  material,
  onArchive,
}: ArchiveMaterialDialogProps) {
  const [open, setOpen] =
    useState(false)

  async function handleArchive() {
    try {
      await onArchive(material.id)

      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
        >
          <Archive className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Archive Material
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to archive
            <span className="font-semibold">
              {" "}
              {material.material_name}
            </span>
            ?

            <br />

            <br />

            Archived materials will no longer
            appear in the inventory list, but
            they can still be recovered later.
          </DialogDescription>

        </DialogHeader>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleArchive}
          >
            Archive
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}