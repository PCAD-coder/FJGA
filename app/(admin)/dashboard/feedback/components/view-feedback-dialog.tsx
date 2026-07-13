"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

import { Star } from "lucide-react"

import { Feedback } from "../types/feedback"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  feedback: Feedback | null
}

export default function ViewFeedbackDialog({
  open,
  onOpenChange,
  feedback,
}: Props) {
  if (!feedback) return null

  const statusStyles = {
    pending: "bg-orange-100 text-orange-700",

    published: "bg-green-100 text-green-700",

    archived: "bg-gray-100 text-gray-700",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Client</p>

            <p className="font-medium">{feedback.clientName}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Project</p>

              <p className="font-medium">{feedback.projectName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>

              <p className="font-medium">{feedback.orderNumber}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Submitted Date</p>

              <p className="font-medium">{feedback.submittedDate}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>

              <Badge className={statusStyles[feedback.status]}>
                {feedback.status}
              </Badge>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Rating</p>

            <div className="flex gap-1">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < feedback.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Feedback</p>

            <div className="rounded-md bg-muted p-4">{feedback.comment}</div>
          </div>

          {feedback.featured && <Badge>Featured Testimonial</Badge>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
