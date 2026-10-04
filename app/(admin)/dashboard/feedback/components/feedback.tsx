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

import { Search, Star } from "lucide-react"

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

  const perPage = 4

  const totalPages = Math.ceil(filteredFeedbacks.length / perPage)

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
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
    }
  }

  const handleArchive = async () => {
    if (!selectedFeedback) return

    try {
      await archiveFeedback(selectedFeedback.id)

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
    }
  }

  const handleFeature = async (id: string) => {
    const feedback = feedbacks.find((item) => item.id === id)

    if (!feedback) return

    try {
      const newFeaturedState = !feedback.featured

      await updateFeedbackFeatured(id, newFeaturedState)

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
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Feedback</h1>

        <p className="text-muted-foreground">
          Moderate testimonials and reviews.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Reviews</p>

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
            <p className="text-sm text-muted-foreground">Pending Review</p>

            <h2 className="text-3xl font-bold text-orange-600">
              {pendingReviews}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">5-Star Reviews</p>

            <h2 className="text-3xl font-bold text-green-600">
              {fiveStarReviews}
            </h2>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <ToggleGroup
          type="single"
          value={statusFilter}
          onValueChange={(value) => {
            if (value) setStatusFilter(value)
          }}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>

          <ToggleGroupItem value="pending">Pending</ToggleGroupItem>

          <ToggleGroupItem value="published">Published</ToggleGroupItem>

          <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
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

      <FeedbackPagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
      />

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
