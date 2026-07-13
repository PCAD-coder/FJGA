"use client"

import { useMemo, useState } from "react"

import { ReturnRequest } from "./types/return"

import ReturnCard from "./components/return-card"

import ReturnsPagination from "./components/returns-pagination"

import ViewReturnDialog from "./components/view-return-dialog"

import ApproveRepairDialog from "./components/approve-repair-dialog"

import ScheduleInspectionDialog from "./components/schedule-inspection-dialog"

import ArchiveRepairDialog from "./components/archive-return-dialog"

import { Input } from "@/components/ui/input"

import { Card, CardContent } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Search } from "lucide-react"
import DeclineRepairDialog from "./components/decline-return-dialog"

const initialReturns: ReturnRequest[] = [
  {
    id: 1,
    orderNumber: "ORD-1001",
    title: "Cracked Tempered Glass Panel",
    clientName: "Maria Santos",
    productType: "Glass Partition",
    image: "/products/partition.jpg",
    issueDescription: "Glass panel cracked after installation.",
    originalAmount: 18500,
    reportedDate: "May 10, 2026",
    status: "under-review",
  },

  {
    id: 2,
    orderNumber: "ORD-1002",
    title: "Sliding Window Track Issue",
    clientName: "Juan Cruz",
    productType: "Sliding Window",
    image: "/products/window.jpg",
    issueDescription: "Window does not slide smoothly.",
    originalAmount: 12500,
    reportedDate: "May 08, 2026",
    status: "inspection-scheduled",
  },

  {
    id: 3,
    orderNumber: "ORD-1003",
    title: "Misaligned Glass Door",
    clientName: "Ana Reyes",
    productType: "Storefront Door",
    image: "/products/door.jpg",
    issueDescription: "Door alignment shifted after several weeks.",
    originalAmount: 24000,
    reportedDate: "May 05, 2026",
    status: "approved",
  },
]

export default function ReturnsPage() {
  const [requests, setRequests] = useState(initialReturns)

  const [search, setSearch] = useState("")

  const [statusFilter, setStatusFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(
    null
  )

  const [viewOpen, setViewOpen] = useState(false)

  const [approveOpen, setApproveOpen] = useState(false)

  const [declineOpen, setDeclineOpen] = useState(false)

  const [scheduleOpen, setScheduleOpen] = useState(false)

  const [archiveOpen, setArchiveOpen] = useState(false)

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (request.archived) return false

      const matchesSearch =
        request.title.toLowerCase().includes(search.toLowerCase()) ||
        request.clientName.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ? true : request.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, search, statusFilter])

  const perPage = 4

  const totalPages = Math.ceil(filteredRequests.length / perPage)

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const handleApprove = () => {
    if (!selectedRequest) return

    setRequests((prev) =>
      prev.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: "approved",
            }
          : request
      )
    )

    setApproveOpen(false)
  }
  const handleDecline = (
  reason: string
) => {
  if (!selectedRequest) return

  setRequests((prev) =>
    prev.map((request) =>
      request.id === selectedRequest.id
        ? {
            ...request,
            status: "declined",
            declineReason: reason,
          }
        : request
    )
  )

  setDeclineOpen(false)
}

  const handleSchedule = (date: string, notes: string) => {
    if (!selectedRequest) return

    setRequests((prev) =>
      prev.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: "inspection-scheduled",
            }
          : request
      )
    )

    console.log("Inspection Date:", date)

    console.log("Notes:", notes)

    setScheduleOpen(false)
  }

  const handleArchive = () => {
    if (!selectedRequest) return

    setRequests((prev) =>
      prev.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              archived: true,
            }
          : request
      )
    )
    setArchiveOpen(false)
  }

  const totalReturns = requests.filter((r) => !r.archived).length

  const underReview = requests.filter(
    (r) => r.status === "under-review" && !r.archived
  ).length

  const inspectionScheduled = requests.filter(
    (r) => r.status === "inspection-scheduled" && !r.archived
  ).length

  const approvedReturns = requests.filter(
    (r) => r.status === "approved" && !r.archived
  ).length
  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">Returns Management</h1>

        <p className="text-muted-foreground">
          Review, inspect, and manage client return requests.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Returns</p>

            <h2 className="text-3xl font-bold">{totalReturns}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Under Review</p>

            <h2 className="text-3xl font-bold text-orange-600">
              {underReview}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Inspection Scheduled
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {inspectionScheduled}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Approved Repairs</p>

            <h2 className="text-3xl font-bold text-green-600">
              {approvedReturns}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}

      <div className="space-y-4">
        <ToggleGroup
          type="single"
          value={statusFilter}
          onValueChange={(value) => {
            if (value) setStatusFilter(value)
          }}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>

          <ToggleGroupItem value="under-review">Under Review</ToggleGroupItem>

          <ToggleGroupItem value="inspection-scheduled">
            Inspection Scheduled
          </ToggleGroupItem>

          <ToggleGroupItem value="approved">Approved</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search returns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* RETURN CARDS */}

      <div className="space-y-6">
        {paginatedRequests.map((request) => (
          <ReturnCard
            key={request.id}
            request={request}
            onView={() => {
              setSelectedRequest(request)
              setViewOpen(true)
            }}
            onApprove={() => {
              setSelectedRequest(request)
              setApproveOpen(true)
            }}
            onDecline={() => {
              setSelectedRequest(request)
              setDeclineOpen(true)
            }}
            onSchedule={() => {
              setSelectedRequest(request)
              setScheduleOpen(true)
            }}
            onArchive={() => {
              setSelectedRequest(request)
              setArchiveOpen(true)
            }}
          />
        ))}
      </div>

      {/* PAGINATION */}

      <ReturnsPagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
      />

      {/* DIALOGS */}

      <ViewReturnDialog
        request={selectedRequest}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <ApproveRepairDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onConfirm={handleApprove}
        requestTitle={selectedRequest?.title}
      />

      <DeclineRepairDialog
        open={declineOpen}
        onOpenChange={setDeclineOpen}
        title={selectedRequest?.title}
        onConfirm={handleDecline}
      />

      <ScheduleInspectionDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        onConfirm={handleSchedule}
        requestTitle={selectedRequest?.title}
      />
      <ArchiveRepairDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={selectedRequest?.title}
        onConfirm={handleArchive}
      />
    </div>
  )
}
