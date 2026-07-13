"use client"

import { Feedback } from "../types/feedback"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  CheckCircle2,
  MessageSquare,
  Archive,
  Eye,
  Star,
} from "lucide-react"

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
    pending:
      "bg-orange-100 text-orange-700",

    published:
      "bg-green-100 text-green-700",

    archived:
      "bg-gray-100 text-gray-700",
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {feedback.clientName}
              </h3>

              {feedback.featured && (
                <Badge>
                  Featured
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {feedback.projectName}
              {" • "}
              Order:
              {" "}
              {feedback.orderNumber}
            </p>
          </div>

          <div className="text-right">
            <Badge
              className={
                statusStyles[
                  feedback.status
                ]
              }
            >
              {feedback.status}
            </Badge>

            <p className="mt-2 text-xs text-muted-foreground">
              {feedback.submittedDate}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-1">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index <
                feedback.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>

        <blockquote className="mb-5 italic text-muted-foreground">
          "{feedback.comment}"
        </blockquote>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={onView}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>

          {feedback.status ===
            "pending" && (
            <>
              <Button
                onClick={
                  onApprove
                }
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve & Publish
              </Button>

              <Button
                variant="outline"
                onClick={onReply}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Reply
              </Button>
            </>
          )}

          {feedback.status ===
            "published" && (
            <Button
              variant="outline"
              onClick={
                onFeature
              }
            >
              <Star className="mr-2 h-4 w-4" />
              {feedback.featured
                ? "Featured"
                : "Feature"}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onArchive}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}