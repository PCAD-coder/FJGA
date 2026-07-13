"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { HomepageContent } from "../types/content"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  content: HomepageContent | null

  onSave: (content: HomepageContent) => void
}

export default function EditHomepageDialog({
  open,
  onOpenChange,
  content,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<HomepageContent | null>(null)

  useEffect(() => {
    setFormData(content)
  }, [content])

  if (!formData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Homepage Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Hero Title"
            value={formData.heroTitle}
            onChange={(e) =>
              setFormData({
                ...formData,
                heroTitle: e.target.value,
              })
            }
          />

          <Input
            placeholder="Hero Image URL"
            value={formData.heroImage}
            onChange={(e) =>
              setFormData({
                ...formData,
                heroImage: e.target.value,
              })
            }
          />

          <Textarea
            rows={6}
            placeholder="Company Description"
            value={formData.companyDescription}
            onChange={(e) =>
              setFormData({
                ...formData,
                companyDescription: e.target.value,
              })
            }
          />
        </div>

        <DialogFooter>
          <Button onClick={() => onSave(formData)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
