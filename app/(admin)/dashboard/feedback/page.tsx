"use client"

import { useMemo, useState } from "react"

import { Feedback } from "./types/feedback"

import FeedbackCard from "./components/feedback-card"
import FeedbackPagination from "./components/feedback-pagination"

import ViewFeedbackDialog from "./components/view-feedback-dialog"
import ApproveFeedbackDialog from "./components/approve-feedback-dialog"
import ReplyFeedbackDialog from "./components/reply-feedback-dialog"
import ArchiveFeedbackDialog from "./components/archive-feedback-dialog"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Search, Star } from "lucide-react"

const initialFeedbacks: Feedback[] = [
  {
    id: 1,
    clientName: "Maria Santos",
    orderNumber: "ORD-2385",
    projectName: "Custom Glass Partition",
    rating: 5,
    comment:
      "Excellent work! The glass partition looks amazing in our office. The installation team was very professional and finished the job on time.",
    submittedDate: "Apr 14, 2026",
    status: "pending",
  },
  {
    id: 2,
    clientName: "Juan dela Cruz",
    orderNumber: "ORD-2391",
    projectName: "Sliding Window - 4 Panel",
    rating: 4,
    comment:
      "Very satisfied with the quality of the windows. Installation took a bit longer than expected but the end result is worth it.",
    submittedDate: "Apr 13, 2026",
    status: "pending",
  },
  {
    id: 3,
    clientName: "Ana Reyes",
    orderNumber: "ORD-2400",
    projectName: "Storefront Glass Door",
    rating: 5,
    comment: "Outstanding craftsmanship and customer service.",
    submittedDate: "Apr 11, 2026",
    status: "published",
    featured: true,
  },
  {
    id: 4,
    clientName: "Michael Tan",
    orderNumber: "ORD-2410",
    projectName: "Glass Railing System",
    rating: 3,
    comment: "Product quality is good but delivery was delayed.",
    submittedDate: "Apr 09, 2026",
    status: "archived",
  },
  {
    id: 5,
    clientName: "Grace Lim",
    orderNumber: "ORD-2415",
    projectName: "Office Glass Divider",
    rating: 5,
    comment: "Amazing experience from quotation to installation.",
    submittedDate: "Apr 08, 2026",
    status: "pending",
  },
]

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks)

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

  const averageRating = (
    feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
    feedbacks.length
  ).toFixed(1)

  const pendingReviews = feedbacks.filter(
    (feedback) => feedback.status === "pending"
  ).length

  const fiveStarReviews = feedbacks.filter(
    (feedback) => feedback.rating === 5
  ).length

  const handleApprove = () => {
    if (!selectedFeedback) return

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
  }

  const handleArchive = () => {
    if (!selectedFeedback) return

    setFeedbacks((prev) =>
      prev.map((feedback) =>
        feedback.id === selectedFeedback.id
          ? {
              ...feedback,
              status: "archived",
            }
          : feedback
      )
    )

    setArchiveOpen(false)
  }

  const handleFeature = (id: number) => {
    setFeedbacks((prev) =>
      prev.map((feedback) =>
        feedback.id === id
          ? {
              ...feedback,
              featured: !feedback.featured,
            }
          : feedback
      )
    )
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
        {paginatedFeedbacks.map((feedback) => (
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
        ))}
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
        onSend={(message) => {
          console.log(message)

          /**
           * FUTURE:
           * Send email
           * Send notification
           */
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
