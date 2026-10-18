"use client"

import {
  Facebook,
  Instagram,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Smartphone,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type {
  ContentSocialLink,
  SocialPlatform,
} from "../types/content"

interface Props {
  links: ContentSocialLink[]
  loading: boolean
  error: string | null
  onAdd: () => void
  onEdit: (link: ContentSocialLink) => void
  onDelete: (link: ContentSocialLink) => void
  onToggleVisibility: (link: ContentSocialLink) => void
}

function PlatformIcon({
  platform,
}: {
  platform: SocialPlatform
}) {
  switch (platform) {
    case "facebook":
      return <Facebook className="size-5" />

    case "messenger":
      return <MessageCircle className="size-5" />

    case "instagram":
      return <Instagram className="size-5" />

    case "tiktok":
      return <Smartphone className="size-5" />

    case "email":
      return <Mail className="size-5" />

    case "phone":
      return <Phone className="size-5" />

    default:
      return <LinkIcon className="size-5" />
  }
}

export default function SocialMediaList({
  links,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onToggleVisibility,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-lg border p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Loading social media links...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 p-10 text-center">
        <p className="text-sm text-destructive">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Social Media
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage social media and contact links displayed
            on the FJ Glass and Aluminum website.
          </p>
        </div>

        <Button onClick={onAdd}>
          <Plus className="mr-2 size-4" />
          Add Social Link
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <LinkIcon className="mb-3 size-9 text-muted-foreground" />

          <p className="font-medium">
            No social links yet
          </p>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Add FJ Glass and Aluminum&apos;s social media
            or contact links to display them on the website.
          </p>

          <Button
            className="mt-5"
            onClick={onAdd}
          >
            <Plus className="mr-2 size-4" />
            Add First Social Link
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <PlatformIcon
                      platform={link.platform}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium">
                      {link.label}
                    </p>

                    <p className="text-sm capitalize text-muted-foreground">
                      {link.platform}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    link.isVisible
                      ? "default"
                      : "secondary"
                  }
                >
                  {link.isVisible
                    ? "Visible"
                    : "Hidden"}
                </Badge>
              </div>

              <div className="mt-4">
                <p className="truncate text-sm text-muted-foreground">
                  {link.url}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Display order #{link.displayOrder}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onToggleVisibility(link)
                  }
                >
                  {link.isVisible
                    ? "Hide"
                    : "Show"}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(link)}
                >
                  Edit
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(link)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}