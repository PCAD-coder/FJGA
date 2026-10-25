"use client"

import { toast } from "sonner"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { createContentSocialLink } from "../services/content"

import type { ContentSocialLink, SocialPlatform } from "../types/content"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (link: ContentSocialLink) => void
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

export default function AddSocialLinkDialog({
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const [platform, setPlatform] = useState<SocialPlatform>("facebook")

  const [label, setLabel] = useState("")
  const [url, setUrl] = useState("")
  const [displayOrder, setDisplayOrder] = useState("0")

  const [error, setError] = useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)

  function resetForm() {
    setPlatform("facebook")
    setLabel("")
    setUrl("")
    setDisplayOrder("0")
    setError(null)
  }

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
      if (!value.startsWith("tel:") && !/^[+0-9()\-\s]+$/.test(value)) {
        throw new Error("Enter a valid phone number.")
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
      const normalizedPhone = value.replace(/[\s()-]/g, "")

      return `tel:${normalizedPhone}`
    }

    return value
  }

  async function handleSave() {
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

      const createdLink = await createContentSocialLink({
        platform,
        label,
        url: normalizeUrl(),
        isVisible: true,
        displayOrder: parsedDisplayOrder,
      })

      toast.success("Social link added successfully.")
      onCreated(createdLink)
      resetForm()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save content."
      )
      console.error("Failed to create social link:", error)

      setError(
        error instanceof Error ? error.message : "Failed to create social link."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSaving) {
          return
        }

        if (!nextOpen) {
          resetForm()
        }

        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Social Link</DialogTitle>
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
            <Label htmlFor="social-label">Label</Label>

            <Input
              id="social-label"
              placeholder="e.g. FJ Glass and Aluminum"
              value={label}
              disabled={isSaving}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="social-url">Link / Contact</Label>

            <Input
              id="social-url"
              placeholder={
                platform === "email"
                  ? "example@email.com"
                  : platform === "phone"
                    ? "+63 912 345 6789"
                    : "https://..."
              }
              value={url}
              disabled={isSaving}
              onChange={(event) => setUrl(event.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              {platform === "email"
                ? "Enter an email address."
                : platform === "phone"
                  ? "Enter the contact number."
                  : "Enter the complete website link including https://."}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="social-display-order">Display Order</Label>

            <Input
              id="social-display-order"
              type="number"
              min="0"
              step="1"
              value={displayOrder}
              disabled={isSaving}
              onChange={(event) => setDisplayOrder(event.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Lower numbers appear first.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => {
              resetForm()
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>

          <Button type="button" disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Adding..." : "Add Social Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
