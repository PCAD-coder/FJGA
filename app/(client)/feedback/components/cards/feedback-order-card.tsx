"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { FeedbackOrder } from "../../types/feedback"

interface FeedbackOrderCardProps {
  order: FeedbackOrder
  onLeaveFeedback: () => void
}

export default function FeedbackOrderCard({
  order,
  onLeaveFeedback,
}: FeedbackOrderCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">
              {order.projectName}
            </h3>

            <p className="text-sm text-muted-foreground">
              Order: {order.orderNumber}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Delivered{" "}
              {new Date(
                order.deliveredDate
              ).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <Button onClick={onLeaveFeedback}>
            Leave Feedback
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Share your experience with FJ Glass and
          Aluminum.
        </p>
      </CardContent>
    </Card>
  )
}