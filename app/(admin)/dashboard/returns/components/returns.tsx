"use client"

import { getErrorMessage } from "@/lib/error-message"

import { useEffect, useMemo, useState } from "react"

import { ReturnRequest } from "../types/return"

import {
  getAdminReturnRequests,
  approveReturnRequest,
  declineReturnRequest,
  scheduleReturnInspection,
  completeReturnInspection,
  startReturnResolution,
  archiveReturnRequest,
} from "../services/return-service"

import ReturnCard from "./return-card"
import ReturnsPagination from "./returns-pagination"
import ViewReturnDialog from "./view-return-dialog"
import ApproveRepairDialog from "./approve-repair-dialog"
import ScheduleInspectionDialog from "./schedule-inspection-dialog"
import ArchiveRepairDialog from "./archive-return-dialog"
import DeclineRepairDialog from "./decline-return-dialog"

import CompleteInspectionDialog from "./complete-inspection-dialog"
import type { CompleteInspectionData } from "./complete-inspection-dialog"

import ResolutionItemsDialog from "./resolution-items-dialog"

import { Input } from "@/components/ui/input"

import { Card, CardContent } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { DashboardCard } from "@/components/dashboard_cards"
import ReturnsSkeleton from "./returns-skeleton"
import { toast } from "sonner"

import {
  Search,
  RotateCcw,
  Clock3,
  CalendarDays,
  CircleCheck,
} from "lucide-react"

async function notifyReturnAction<T extends { error?: string | null }>(
  action: () => Promise<T>,
  message: string
): Promise<T> {
  try {
    const result = await action()
    if (result.error) toast.error(result.error)
    else toast.success(message)
    return result
  } catch (error) {
    toast.error(
      getErrorMessage(error, "Unable to complete the return action.")
    )
    throw error
  }
}

export default function Returns() {
  const [requests, setRequests] = useState<ReturnRequest[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

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

  const loadReturns = async () => {
    setLoading(true)
    setError(null)

    const result = await getAdminReturnRequests()

    if (result.error) {
      setError(result.error)
      setRequests([])
    } else {
      setRequests(result.data)
    }

    setLoading(false)
  }
  const [inspectionRequest, setInspectionRequest] =
    useState<ReturnRequest | null>(null)

  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false)

  const [resolutionId, setResolutionId] = useState<string | null>(null)

  const [resolutionType, setResolutionType] = useState<
    "repair" | "replacement" | null
  >(null)

  const [resolutionItemsDialogOpen, setResolutionItemsDialogOpen] =
    useState(false)
  const [resolutionReturnRequestId, setResolutionReturnRequestId] = useState<
    string | null
  >(null)

  useEffect(() => {
    loadReturns()
  }, [])
  function handleCompleteInspection(request: ReturnRequest) {
    setInspectionRequest(request)
    setInspectionDialogOpen(true)
  }
async function handleInspectionComplete(
  data: CompleteInspectionData
) {
  if (!inspectionRequest) return

  const result = await notifyReturnAction(
    () => completeReturnInspection(inspectionRequest.id, data),
    data.resolutionType === "no_action"
      ? "Inspection completed. No further action is required."
      : "Inspection completed and resolution created successfully."
  )

  if (result.error) {
    throw new Error(result.error)
  }

  setInspectionDialogOpen(false)
  setInspectionRequest(null)

  await loadReturns()
}

function handleAddResolutionItems(request: ReturnRequest) {
  const resolution = request.resolution

  if (!resolution) {
    setError("A resolution could not be found for this return request.")
    return
  }

  if (
    resolution.resolutionType !== "repair" &&
    resolution.resolutionType !== "replacement"
  ) {
    setError(
      "This return request does not require repair or replacement items."
    )
    return
  }

  if (resolution.resolutionStatus !== "pending") {
    setError("Only a pending resolution can have items added.")
    return
  }

  setError(null)

  setResolutionId(resolution.id)
  setResolutionType(resolution.resolutionType)
  setResolutionReturnRequestId(request.id)

  setResolutionItemsDialogOpen(true)
}

  async function handleResolutionItemsComplete() {
    setResolutionItemsDialogOpen(false)
    setResolutionId(null)
    setResolutionType(null)
    setResolutionReturnRequestId(null)
    await loadReturns()
  }
  async function handleStartResolution(request: ReturnRequest) {
    const result = await notifyReturnAction(
      () => startReturnResolution(request.id),
      "Return resolution started."
    )

    if (result.error) {
      setError(result.error)
      return
    }

    await loadReturns()
  }

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (request.archived) return false

      const searchValue = search.toLowerCase()

      const matchesSearch =
        request.title.toLowerCase().includes(searchValue) ||
        request.clientName.toLowerCase().includes(searchValue) ||
        request.orderNumber.toLowerCase().includes(searchValue)

      const matchesStatus =
        statusFilter === "all" ? true : request.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, search, statusFilter])

  const perPage = 10

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / perPage))
  const page = Math.min(currentPage, totalPages)

  const paginatedRequests = filteredRequests.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const handleApprove = async () => {
    if (!selectedRequest) return

    const result = await notifyReturnAction(
      () => approveReturnRequest(selectedRequest.id),
      "Return request approved."
    )

    if (result.error) {
      setError(result.error)
      return
    }

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

    await loadReturns()
  }

  const handleDecline = async (reason: string) => {
    if (!selectedRequest) return

    const result = await notifyReturnAction(
      () => declineReturnRequest(selectedRequest.id, reason),
      "Return request declined."
    )

    if (result.error) {
      setError(result.error)
      return
    }

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

    await loadReturns()
  }

  const handleSchedule = async (
    date: string,
    time: string,
    assignedStaff: string,
    notes: string
  ) => {
    if (!selectedRequest) return

    const result = await notifyReturnAction(
      () =>
        scheduleReturnInspection(
          selectedRequest.id,
          date,
          time,
          assignedStaff,
          notes
        ),
      "Inspection schedule saved."
    )

    if (result.error) {
      setError(result.error)
      return
    }

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

    setScheduleOpen(false)

    await loadReturns()
  }

async function handleArchive() {
  if (!selectedRequest) return

  const result = await notifyReturnAction(
    () => archiveReturnRequest(selectedRequest.id),
    "Return request archived successfully."
  )

  if (result.error) {
    return
  }

  setArchiveOpen(false)
  setSelectedRequest(null)

  await loadReturns()
}

  const totalReturns = requests.filter((request) => !request.archived).length

  const underReview = requests.filter(
    (request) => request.status === "under-review" && !request.archived
  ).length

  const inspectionScheduled = requests.filter(
    (request) => request.status === "inspection-scheduled" && !request.archived
  ).length

  const approvedReturns = requests.filter(
    (request) => request.status === "approved" && !request.archived
  ).length

  if (loading) {
    return <ReturnsSkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      {/* HEADER */}

      <div className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Returns Management
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Review, inspect, and manage client return requests.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        <DashboardCard
          title="Total Returns"
          value={String(totalReturns)}
          description="All visible return requests"
          icon={RotateCcw}
          color="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="Under Review"
          value={String(underReview)}
          description="Requests awaiting assessment"
          icon={Clock3}
          color="text-amber-600 dark:text-amber-400"
        />
        <DashboardCard
          title="Inspection Scheduled"
          value={String(inspectionScheduled)}
          description="Requests scheduled for inspection"
          icon={CalendarDays}
          color="text-primary"
        />
        <DashboardCard
          title="Approved Repairs"
          value={String(approvedReturns)}
          description="Approved return requests"
          icon={CircleCheck}
          color="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* FILTERS */}

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

          <ToggleGroupItem value="under-review">Under Review</ToggleGroupItem>

          <ToggleGroupItem value="inspection-scheduled">
            Inspection Scheduled
          </ToggleGroupItem>

          <ToggleGroupItem value="approved">Approved</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            aria-label="Search return requests"
            className="h-9 rounded-lg bg-background/50 pl-9 shadow-none"
            placeholder="Search returns..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Loading return requests...
            </p>
          </CardContent>
        </Card>
      )}

      {/* ERROR */}

      {!loading && error && (
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="text-sm text-destructive">{error}</p>

            <button
              type="button"
              onClick={loadReturns}
              className="text-sm font-medium underline"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      )}

      {/* RETURN CARDS */}

      {!loading && !error && paginatedRequests.length > 0 && (
        <div className="space-y-4">
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
  onCompleteInspection={() => handleCompleteInspection(request)}
  onAddResolutionItems={() => handleAddResolutionItems(request)}
  onStartResolution={() => handleStartResolution(request)}
/>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}

      {!loading && !error && paginatedRequests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">No return requests found.</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing the search or status filter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* PAGINATION */}

      {!loading && !error && filteredRequests.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, filteredRequests.length)} of{" "}
            {filteredRequests.length} requests
          </p>
          <ReturnsPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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
      <CompleteInspectionDialog
        open={inspectionDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setInspectionRequest(null)
          }

          setInspectionDialogOpen(open)
        }}
        onComplete={handleInspectionComplete}
      />
      <ResolutionItemsDialog
        open={resolutionItemsDialogOpen}
        returnRequestId={resolutionReturnRequestId}
        resolutionId={resolutionId}
        resolutionType={resolutionType}
        onOpenChange={(open) => {
          if (!open) {
            setResolutionItemsDialogOpen(false)
            setResolutionId(null)
            setResolutionType(null)
            setResolutionReturnRequestId(null)
          } else {
            setResolutionItemsDialogOpen(true)
          }
        }}
        onComplete={handleResolutionItemsComplete}
      />
    </div>
  )
}
