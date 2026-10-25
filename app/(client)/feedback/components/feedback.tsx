"use client"

import ModuleLoading from "../loading"

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

  if (loading) {
    return <ModuleLoading />
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 px-1 pt-4 pb-12 sm:px-4 sm:pt-6 lg:px-6">
      <header className="border-b border-border/70 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Your experience, your voice.
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tell us about your finished pieces and revisit the feedback you have
          shared.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-0 rounded-xl border border-border/80 py-0 shadow-none ring-0">
          <CardContent className="p-5">
            <p className="text-xs leading-5 text-muted-foreground">
              Your Reviews
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
              {feedbacks.length}
            </h2>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-xl border border-border/80 py-0 shadow-none ring-0">
          <CardContent className="p-5">
            <p className="text-xs leading-5 text-muted-foreground">
              Average Rating
            </p>

            <h2 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight tabular-nums">
              {averageRating}

              <Star className="size-5 fill-amber-400 text-amber-400" />
            </h2>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-xl border border-border/80 py-0 shadow-none ring-0">
          <CardContent className="p-5">
            <p className="text-xs leading-5 text-muted-foreground">
              Published Reviews
            </p>

            <h2 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight tabular-nums">
              <MessageSquare className="size-5 text-primary" />

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

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Your Feedback
            </h2>

            <p className="text-xs leading-5 text-muted-foreground">
              Feedback you have submitted.
            </p>
          </div>

          {loading ? (
            <div className="py-10 text-center text-muted-foreground">
              Loading...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/30 px-5 py-10 text-center text-sm text-muted-foreground">
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
        <section className="min-w-0 space-y-4 rounded-xl border border-border/80 bg-card p-5">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Orders Awaiting Feedback
            </h2>

            <p className="text-xs leading-5 text-muted-foreground">
              Review your completed orders.
            </p>
          </div>

          {loading ? (
            <div className="py-10 text-center text-muted-foreground">
              Loading...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/30 px-5 py-10 text-center text-sm text-muted-foreground">
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
      </div>
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
