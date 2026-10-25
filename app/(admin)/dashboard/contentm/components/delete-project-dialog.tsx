"use client"

import { toast } from "sonner"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { deleteContentImage, deleteContentProject } from "../services/content"

import type { ContentProject } from "../types/content"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ContentProject | null
  onDeleted: (projectId: string) => void
}

export default function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  onDeleted,
}: Props) {
  const [error, setError] = useState<string | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!project) {
      return
    }

    try {
      setIsDeleting(true)
      setError(null)

      /*
       * Delete the database record first.
       * Only after that succeeds do we clean up its image.
       */
      await deleteContentProject(project.id)

      toast.success("Project deleted successfully.")
      onDeleted(project.id)
      onOpenChange(false)

      try {
        await deleteContentImage(project.imageUrl)
      } catch (cleanupError) {
        /*
         * The project itself is already deleted at this point,
         * so a Storage cleanup failure should not pretend that
         * the whole deletion failed.
         */
        console.error(
          "Project deleted, but its image could not be removed:",
          cleanupError
        )
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save content."
      )
      console.error("Failed to delete content project:", error)

      setError(
        error instanceof Error ? error.message : "Failed to delete project."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (!project) {
    return null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          setError(null)
          onOpenChange(nextOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>

          <DialogTitle>Delete Project?</DialogTitle>

          <DialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{project.title}</span>{" "}
            and remove its project image. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
