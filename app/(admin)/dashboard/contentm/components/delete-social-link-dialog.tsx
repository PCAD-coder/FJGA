"use client"

import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { ContentSocialLink } from "../types/content"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  link: ContentSocialLink | null
  deleting: boolean
  onConfirm: () => void
}

export default function DeleteSocialLinkDialog({
  open,
  onOpenChange,
  link,
  deleting,
  onConfirm,
}: Props) {
  if (!link) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!deleting) {
          onOpenChange(nextOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>

          <DialogTitle>Delete Social Link?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This will permanently delete{" "}
          <span className="font-medium text-foreground">{link.label}</span> from
          Content Management. This action cannot be undone.
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={deleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={deleting}
            onClick={onConfirm}
          >
            {deleting ? "Deleting..." : "Delete Social Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
