"use client"

import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { Feedback } from "../../types/feedback"

interface FeedbackCardProps {
  feedback: Feedback
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold wrap-break-word">
              {feedback.projectName}
            </h3>

            <p className="text-xs leading-5 text-muted-foreground">
              Order: {feedback.orderNumber}
            </p>
          </div>

          <Badge
            className="rounded-full px-2.5 py-1 text-[10px] capitalize"
            variant={
              feedback.status === "published"
                ? "default"
                : feedback.status === "archived"
                  ? "secondary"
                  : "outline"
            }
          >
            {feedback.status}
          </Badge>
        </div>

        <div className="mt-4 flex items-center gap-1 rounded-lg bg-muted/40 px-3 py-2.5">
          {Array.from({ length: 5 }).map((_, index) => {
            const starNumber = index + 1

            return (
              <Star
                key={starNumber}
                className={`size-4 ${
                  starNumber <= feedback.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/35"
                }`}
              />
            )
          })}
        </div>

        <p className="mt-4 text-sm leading-7 wrap-break-word">
          {feedback.comment}
        </p>

        <p className="mt-4 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
          Submitted{" "}
          {new Date(feedback.submittedDate).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {feedback.adminReply && (
          <div className="mt-4 rounded-lg border border-primary/10 bg-primary/5 p-4">
            <p className="text-sm font-medium">FJ Glass and Aluminum</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {feedback.adminReply}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
