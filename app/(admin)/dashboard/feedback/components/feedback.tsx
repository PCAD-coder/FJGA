"use client"

import { useEffect, useMemo, useState } from "react"

import type { Feedback } from "../types/feedback"
import { getFeedbacks } from "../services/feedback-service"

import FeedbackCard from "./feedback-card"
import FeedbackPagination from "./feedback-pagination"

import ViewFeedbackDialog from "./view-feedback-dialog"
import ApproveFeedbackDialog from "./approve-feedback-dialog"
import ReplyFeedbackDialog from "./reply-feedback-dialog"
import ArchiveFeedbackDialog from "./archive-feedback-dialog"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { DashboardCard } from "@/components/dashboard_cards"
import FeedbackSkeleton from "./feedback-skeleton"
import { toast } from "sonner"

import { Search, Star, MessageSquare, Clock3, Award } from "lucide-react"

import {
  approveFeedback,
  archiveFeedback,
  replyToFeedback,
  updateFeedbackFeatured,
} from "../services/feedback-service"

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")

  const [statusFilter, setStatusFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  )

  const [viewOpen, setViewOpen] = useState(false)

  const [approveOpen, setApproveOpen] = useState(false)

  const [replyOpen, setReplyOpen] = useState(false)

  const [archiveOpen, setArchiveOpen] = useState(false)

  useEffect(() => {
    async function loadFeedbacks() {
      try {
        setLoading(true)
        setError(null)

        const data = await getFeedbacks()

        setFeedbacks(data)
      } catch (err) {
        console.error("Failed to load feedback:", err)

        setError(
          err instanceof Error ? err.message : "Failed to load feedback."
        )
      } finally {
        setLoading(false)
      }
    }

    loadFeedbacks()
  }, [])

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const matchesSearch =
        feedback.clientName.toLowerCase().includes(search.toLowerCase()) ||
        feedback.projectName.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ? true : feedback.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [feedbacks, search, statusFilter])

  const perPage = 10

  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / perPage))
  const page = Math.min(currentPage, totalPages)

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const averageRating =
    feedbacks.length === 0
      ? "0.0"
      : (
          feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
          feedbacks.length
        ).toFixed(1)

  const pendingReviews = feedbacks.filter(
    (feedback) => feedback.status === "pending"
  ).length

  const fiveStarReviews = feedbacks.filter(
    (feedback) => feedback.rating === 5
  ).length

  const handleApprove = async () => {
    if (!selectedFeedback) return

    try {
      await approveFeedback(selectedFeedback.id)
      toast.success("Feedback approved and published.")

      setFeedbacks((prev) =>
        prev.map((feedback) =>
          feedback.id === selectedFeedback.id
            ? {
                ...feedback,
                status: "published",
              }
            : feedback
        )
      )

      setApproveOpen(false)
    } catch (error) {
      console.error("Failed to approve feedback:", error)
      toast.error(
        error instanceof Error ? error.message : "Unable to update feedback."
      )
    }
  }

  const handleArchive = async () => {
    if (!selectedFeedback) return

    try {
      await archiveFeedback(selectedFeedback.id)
      toast.success("Feedback archived.")

      setFeedbacks((prev) =>
        prev.map((feedback) =>
          feedback.id === selectedFeedback.id
            ? {
                ...feedback,
                status: "archived",
                featured: false,
              }
            : feedback
        )
      )

      setArchiveOpen(false)
    } catch (error) {
      console.error("Failed to archive feedback:", error)
      toast.error(
        error instanceof Error ? error.message : "Unable to update feedback."
      )
    }
  }

  const handleFeature = async (id: string) => {
    const feedback = feedbacks.find((item) => item.id === id)

    if (!feedback) return

    try {
      const newFeaturedState = !feedback.featured

      await updateFeedbackFeatured(id, newFeaturedState)
      toast.success("Featured feedback updated.")

      setFeedbacks((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                featured: newFeaturedState,
              }
            : item
        )
      )
    } catch (error) {
      console.error("Failed to update featured status:", error)
      toast.error(
        error instanceof Error ? error.message : "Unable to update feedback."
      )
    }
  }

  if (loading) {
    return <FeedbackSkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Client Feedback
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Moderate testimonials and reviews.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        <DashboardCard
          title="Total Reviews"
          value={String(feedbacks.length)}
          description="All customer feedback"
          icon={MessageSquare}
          color="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="Average Rating"
          value={averageRating}
          description="Average across all reviews"
          icon={Star}
          color="text-amber-600 dark:text-amber-400"
        />
        <DashboardCard
          title="Pending Review"
          value={String(pendingReviews)}
          description="Reviews awaiting moderation"
          icon={Clock3}
          color="text-primary"
        />
        <DashboardCard
          title="5-Star Reviews"
          value={String(fiveStarReviews)}
          description="Reviews with the highest rating"
          icon={Award}
          color="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4">
        <ToggleGroup
          className="h-auto max-w-full flex-wrap justify-start gap-1"
          type="single"
          value={statusFilter}
          onValueChange={(value) => {
            if (value) {
              setStatusFilter(value)
              setCurrentPage(1)
            }
          }}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>

          <ToggleGroupItem value="pending">Pending</ToggleGroupItem>

          <ToggleGroupItem value="published">Published</ToggleGroupItem>

          <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            aria-label="Search feedback"
            className="h-9 rounded-lg bg-background/50 pl-9 shadow-none"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading feedback...
          </div>
        ) : error ? (
          <div className="py-10 text-center text-destructive">
            Failed to load feedback: {error}
          </div>
        ) : paginatedFeedbacks.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No feedback found.
          </div>
        ) : (
          paginatedFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onView={() => {
                setSelectedFeedback(feedback)
                setViewOpen(true)
              }}
              onApprove={() => {
                setSelectedFeedback(feedback)
                setApproveOpen(true)
              }}
              onReply={() => {
                setSelectedFeedback(feedback)
                setReplyOpen(true)
              }}
              onArchive={() => {
                setSelectedFeedback(feedback)
                setArchiveOpen(true)
              }}
              onFeature={() => handleFeature(feedback.id)}
            />
          ))
        )}
      </div>

      {!error && filteredFeedbacks.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, filteredFeedbacks.length)} of{" "}
            {filteredFeedbacks.length} reviews
          </p>
          <FeedbackPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <ViewFeedbackDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        feedback={selectedFeedback}
      />

      <ApproveFeedbackDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onConfirm={handleApprove}
        clientName={selectedFeedback?.clientName}
      />

      <ReplyFeedbackDialog
        open={replyOpen}
        onOpenChange={setReplyOpen}
        onSend={async (message) => {
          if (!selectedFeedback) return

          try {
            await replyToFeedback(selectedFeedback.id, message)
            toast.success("Reply sent successfully.")

            setFeedbacks((prev) =>
              prev.map((feedback) =>
                feedback.id === selectedFeedback.id
                  ? {
                      ...feedback,
                      adminReply: message.trim(),
                      repliedAt: new Date().toISOString(),
                    }
                  : feedback
              )
            )

            setReplyOpen(false)
          } catch (error) {
            console.error("Failed to reply to feedback:", error)
            toast.error(
              error instanceof Error
                ? error.message
                : "Unable to update feedback."
            )
          }
        }}
        clientName={selectedFeedback?.clientName}
      />

      <ArchiveFeedbackDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        onConfirm={handleArchive}
        clientName={selectedFeedback?.clientName}
      />
    </div>
  )
}
