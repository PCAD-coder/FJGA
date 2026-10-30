"use client"

import { getErrorMessage } from "@/lib/error-message"

import { toast } from "sonner"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ContactNumberInput } from "@/components/ui/contact-number-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { updateContentSocialLink } from "../services/content"

import type { ContentSocialLink, SocialPlatform } from "../types/content"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  link: ContentSocialLink | null
  onUpdated: (link: ContentSocialLink) => void
}

const platforms: {
  value: SocialPlatform
  label: string
}[] = [
  { value: "facebook", label: "Facebook" },
  { value: "messenger", label: "Messenger" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "other", label: "Other" },
]

export default function EditSocialLinkDialog({
  open,
  onOpenChange,
  link,
  onUpdated,
}: Props) {
  const [platform, setPlatform] = useState<SocialPlatform>("facebook")

  const [label, setLabel] = useState("")
  const UrlInput = platform === "phone" ? ContactNumberInput : Input
  const [url, setUrl] = useState("")
  const [displayOrder, setDisplayOrder] = useState("0")

  const [error, setError] = useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!link) return

    setPlatform(link.platform)
    setLabel(link.label)

    if (link.platform === "email" && link.url.startsWith("mailto:")) {
      setUrl(link.url.slice("mailto:".length))
    } else if (link.platform === "phone" && link.url.startsWith("tel:")) {
      setUrl(link.url.slice("tel:".length))
    } else {
      setUrl(link.url)
    }

    setDisplayOrder(String(link.displayOrder))
    setError(null)
  }, [link, open])

  function validateUrl() {
    const value = url.trim()

    if (!value) {
      throw new Error("Social media or contact link is required.")
    }

    if (platform === "email") {
      if (!value.startsWith("mailto:") && !value.includes("@")) {
        throw new Error("Enter a valid email address.")
      }

      return
    }

    if (platform === "phone") {
      if (!/^[0-9]{11}$/.test(value)) {
        throw new Error("Contact number must contain exactly 11 digits.")
      }

      return
    }

    try {
      const parsedUrl = new URL(value)

      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new Error()
      }
    } catch {
      throw new Error(
        "Enter a complete link beginning with http:// or https://."
      )
    }
  }

  function normalizeUrl() {
    const value = url.trim()

    if (platform === "email" && !value.startsWith("mailto:")) {
      return `mailto:${value}`
    }

    if (platform === "phone" && !value.startsWith("tel:")) {
      return `tel:${value.replace(/[\s()-]/g, "")}`
    }

    return value
  }

  async function handleSave() {
    if (!link) return

    if (!label.trim()) {
      setError("Label is required.")
      return
    }

    const parsedDisplayOrder = Number(displayOrder)

    if (!Number.isInteger(parsedDisplayOrder) || parsedDisplayOrder < 0) {
      setError("Display order must be a whole number of 0 or greater.")
      return
    }

    try {
      validateUrl()

      setIsSaving(true)
      setError(null)

      const updatedLink = await updateContentSocialLink(link.id, {
        platform,
        label,
        url: normalizeUrl(),
        displayOrder: parsedDisplayOrder,
      })

      toast.success("Social link updated successfully.")
      onUpdated(updatedLink)
      onOpenChange(false)
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to save content.")
      )
      console.error("Failed to update social link:", error)

      setError(
        getErrorMessage(error, "Failed to update social link.")
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!link) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSaving) {
          onOpenChange(nextOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Social Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Platform</Label>

            <Select
              value={platform}
              disabled={isSaving}
              onValueChange={(value) => setPlatform(value as SocialPlatform)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {platforms.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-social-label">Label</Label>

            <Input
              id="edit-social-label"
              value={label}
              disabled={isSaving}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-social-url">Link / Contact</Label>

            <UrlInput
              id="edit-social-url"
              value={url}
              disabled={isSaving}
              onChange={(event) => setUrl(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-social-order">Display Order</Label>

            <Input
              id="edit-social-order"
              type="number"
              min="0"
              step="1"
              value={displayOrder}
              disabled={isSaving}
              onChange={(event) => setDisplayOrder(event.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
