"use client"

import { Feedback } from "../types/feedback"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { CheckCircle2, MessageSquare, Archive, Eye, Star } from "lucide-react"

interface Props {
  feedback: Feedback

  onView: () => void

  onApprove: () => void

  onReply: () => void

  onArchive: () => void

  onFeature: () => void
}

export default function FeedbackCard({
  feedback,
  onView,
  onApprove,
  onReply,
  onArchive,
  onFeature,
}: Props) {
  const statusStyles = {
    pending: "bg-orange-100 text-orange-700",

    published: "bg-green-100 text-green-700",

    archived: "bg-gray-100 text-gray-700",
  }

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight wrap-break-word">
                {feedback.clientName}
              </h3>

              {feedback.featured && <Badge>Featured</Badge>}
            </div>

            <p className="text-sm text-muted-foreground">
              {feedback.projectName}
              {" • "}
              Order: {feedback.orderNumber}
            </p>
          </div>

          <div className="text-right">
            <Badge
              className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${statusStyles[feedback.status]}`}
            >
              {feedback.status}
            </Badge>

            <p className="mt-2 text-xs text-muted-foreground">
              {feedback.submittedDate}
            </p>
          </div>
        </div>

        <div className="mb-4 flex w-fit items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/20">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index < feedback.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>

        <blockquote className="mb-5 rounded-lg border-l-2 border-primary/30 bg-muted/30 px-4 py-3 text-sm leading-7 wrap-break-word text-muted-foreground">
          "{feedback.comment}"
        </blockquote>

        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3 [&>button]:h-9 [&>button]:rounded-lg [&>button]:text-xs">
          <Button variant="outline" onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>

          {feedback.status === "pending" && (
            <Button onClick={onApprove}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve & Publish
            </Button>
          )}

          {(feedback.status === "pending" ||
            feedback.status === "published") && (
            <Button variant="outline" onClick={onReply}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Reply
            </Button>
          )}

          {feedback.status === "published" && (
            <Button variant="outline" onClick={onFeature}>
              <Star className="mr-2 h-4 w-4" />
              {feedback.featured ? "Featured" : "Feature"}
            </Button>
          )}

          <Button variant="outline" onClick={onArchive}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
