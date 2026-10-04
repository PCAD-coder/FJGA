"use client"

import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { Feedback } from "../../types/feedback"

interface FeedbackCardProps {
  feedback: Feedback
}

export default function FeedbackCard({
  feedback,
}: FeedbackCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">
              {feedback.projectName}
            </h3>

            <p className="text-sm text-muted-foreground">
              Order: {feedback.orderNumber}
            </p>
          </div>

          <Badge
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

        <div className="mt-4 flex items-center gap-1">
          {Array.from({ length: 5 }).map(
            (_, index) => {
              const starNumber = index + 1

              return (
                <Star
                  key={starNumber}
                  className={`h-5 w-5 ${
                    starNumber <= feedback.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              )
            }
          )}
        </div>

        <p className="mt-4 text-sm">
          {feedback.comment}
        </p>

        <p className="mt-4 text-xs text-muted-foreground">
          Submitted{" "}
          {new Date(
            feedback.submittedDate
          ).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {feedback.adminReply && (
          <div className="mt-4 rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">
              FJ Glass and Aluminum
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {feedback.adminReply}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}