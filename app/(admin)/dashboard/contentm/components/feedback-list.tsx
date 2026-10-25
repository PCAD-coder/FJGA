"use client"

import { ContentPanelSkeleton } from "./content-skeleton"

import { Eye, EyeOff, MessageSquareQuote, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { ContentFeedback } from "../types/content"

interface Props {
  feedback: ContentFeedback[]
  loading: boolean
  error: string | null
  updatingId: string | null
  onToggleFeatured: (feedback: ContentFeedback) => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function getStatusVariant(
  status: ContentFeedback["status"]
): "default" | "secondary" | "outline" {
  switch (status) {
    case "published":
      return "default"
    case "pending":
      return "secondary"
    case "archived":
      return "outline"
  }
}

export default function FeedbackList({
  feedback,
  loading,
  error,
  updatingId,
  onToggleFeatured,
}: Props) {
  if (loading) {
    return <ContentPanelSkeleton variant="cards" />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 p-10 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (feedback.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
        <MessageSquareQuote className="mb-3 size-9 text-muted-foreground" />

        <p className="font-medium">No customer feedback yet</p>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Customer feedback will appear here once it has been submitted through
          the system.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => {
        const canFeature = item.status === "published"
        const isUpdating = updatingId === item.id

        return (
          <div
            key={item.id}
            className="min-w-0 rounded-xl border border-border/80 bg-card p-4"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={
                          index < item.rating
                            ? "size-4 fill-current"
                            : "size-4 text-muted-foreground/40"
                        }
                      />
                    ))}
                  </div>

                  <Badge
                    variant={getStatusVariant(item.status)}
                    className="rounded-full text-[11px] capitalize"
                  >
                    {item.status}
                  </Badge>

                  {item.featured && <Badge variant="secondary">Featured</Badge>}
                </div>

                <blockquote className="text-sm leading-6">
                  “{item.comment}”
                </blockquote>

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span>{item.customerName}</span>
                  <span>{item.orderNumber}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                {item.adminReply && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="mb-1 text-xs font-medium">Admin Reply</p>

                    <p className="text-sm text-muted-foreground">
                      {item.adminReply}
                    </p>
                  </div>
                )}
              </div>

              <div className="shrink-0">
                <Button
                  type="button"
                  variant={item.featured ? "outline" : "default"}
                  disabled={!canFeature || isUpdating}
                  onClick={() => onToggleFeatured(item)}
                >
                  {item.featured ? (
                    <>
                      <EyeOff className="mr-2 size-4" />
                      {isUpdating ? "Updating..." : "Remove from Website"}
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 size-4" />
                      {isUpdating ? "Updating..." : "Feature on Website"}
                    </>
                  )}
                </Button>

                {!canFeature && (
                  <p className="mt-2 max-w-48 text-xs text-muted-foreground">
                    Only published feedback can be featured on the website.
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
