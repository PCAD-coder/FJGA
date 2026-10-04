"use client"

import { useState } from "react"

import { Star } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { submitFeedback } from "../../services/feedback-service"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  orderId: string
  orderNumber: string
  projectName: string

  onSubmitted: () => void
}

export default function FeedbackDialog({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  projectName,
  onSubmitted,
}: FeedbackDialogProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function handleSubmit() {
    try {
      setError(null)

      if (rating === 0) {
        setError("Please select a rating.")
        return
      }

      if (!comment.trim()) {
        setError("Please enter your feedback.")
        return
      }

      setLoading(true)

      await submitFeedback({
        orderId,
        rating,
        comment,
      })

      setRating(0)
      setComment("")

      onSubmitted()
      onOpenChange(false)
    } catch (err) {
      console.error(
        "Failed to submit feedback:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit feedback."
      )
    } finally {
      setLoading(false)
    }
  }

  function handleOpenChange(value: boolean) {
    if (!loading) {
      onOpenChange(value)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Leave Feedback
          </DialogTitle>

          <DialogDescription>
            {projectName} · {orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium">
              How would you rate your experience?
            </p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setRating(value)
                  }
                  disabled={loading}
                  className="rounded-md p-1 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={`${value} star${
                    value > 1 ? "s" : ""
                  }`}
                >
                  <Star
                    className={`h-7 w-7 ${
                      value <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Your feedback
            </p>

            <Textarea
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              placeholder="Tell us about your experience..."
              rows={5}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              handleOpenChange(false)
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              rating === 0 ||
              !comment.trim()
            }
          >
            {loading
              ? "Submitting..."
              : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}