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
    <Card className="gap-0 rounded-lg border border-border/60 bg-muted/25 py-0 shadow-none ring-0">
      <CardContent className="p-4">
        <div className="flex flex-col items-start gap-4">
          <div>
            <h3 className="text-sm leading-6 font-semibold wrap-break-word">
              {order.projectName}
            </h3>

            <p className="text-xs leading-5 text-muted-foreground">
              Order: {order.orderNumber}
            </p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Delivered{" "}
              {new Date(order.deliveredDate).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <Button
            onClick={onLeaveFeedback}
            className="h-9 w-full rounded-md text-xs shadow-none"
          >
            Leave Feedback
          </Button>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
          Share your experience with FJ Glass and Aluminum.
        </p>
      </CardContent>
    </Card>
  )
}
