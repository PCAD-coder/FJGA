"use client"

import { useState } from "react"

import { MessageSquare, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import FeedbackCard from "./cards/feedback-card"
import FeedbackOrderCard from "./cards/feedback-order-card"

import { useFeedback } from "../hooks/use-feedback"

import FeedbackDialog from "./dialogs/feedback-dialog"

export default function Feedback() {
  const { feedbacks, orders, loading, error, reload } = useFeedback()
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string
    orderNumber: string
    projectName: string
  } | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)

  const averageRating =
    feedbacks.length === 0
      ? "0.0"
      : (
          feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
          feedbacks.length
        ).toFixed(1)

  const publishedCount = feedbacks.filter(
    (feedback) => feedback.status === "published"
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>

        <p className="text-muted-foreground">
          Share your experience and view your submitted feedback.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Your Reviews</p>

            <h2 className="text-3xl font-bold">{feedbacks.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Average Rating</p>

            <h2 className="flex items-center justify-center gap-1 text-3xl font-bold">
              {averageRating}

              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Published Reviews</p>

            <h2 className="flex items-center justify-center gap-2 text-3xl font-bold">
              <MessageSquare className="h-6 w-6" />

              {publishedCount}
            </h2>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load feedback: {error}
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Orders Awaiting Feedback</h2>

          <p className="text-sm text-muted-foreground">
            Review your completed orders.
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            You have no orders awaiting feedback.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <FeedbackOrderCard
                key={order.id}
                order={order}
                onLeaveFeedback={() => {
                  setSelectedOrder({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    projectName: order.projectName,
                  })

                  setDialogOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Your Feedback</h2>

          <p className="text-sm text-muted-foreground">
            Feedback you have submitted.
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading...
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            You have not submitted any feedback yet.
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </section>
      {selectedOrder && (
        <FeedbackDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          orderId={selectedOrder.id}
          orderNumber={selectedOrder.orderNumber}
          projectName={selectedOrder.projectName}
          onSubmitted={() => {
            reload()
            setSelectedOrder(null)
          }}
        />
      )}
    </div>
  )
}
