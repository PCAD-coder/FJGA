"use client"

import { useEffect, useMemo, useState } from "react"

import { ReturnRequest } from "../types/return"

import {
  getAdminReturnRequests,
  approveReturnRequest,
  declineReturnRequest,
  scheduleReturnInspection,
  completeReturnInspection,
  createReturnResolution,
  startReturnResolution,
  completeReturnResolution,
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

import ResolutionDialog from "./resolution-dialog"
import type { ResolutionDialogData } from "./resolution-dialog"

import ResolutionItemsDialog from "./resolution-items-dialog"

import { Input } from "@/components/ui/input"

import { Card, CardContent } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Search } from "lucide-react"

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

  const [resolutionRequest, setResolutionRequest] =
    useState<ReturnRequest | null>(null)

  const [resolutionInspectionId, setResolutionInspectionId] = useState<
    string | null
  >(null)

  const [resolutionDialogOpen, setResolutionDialogOpen] = useState(false)

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
  async function handleInspectionComplete(data: CompleteInspectionData) {
    if (!inspectionRequest) return

    const request = inspectionRequest

    const result = await completeReturnInspection(request.id, data)

    if (result.error) {
      throw new Error(result.error)
    }

    setInspectionDialogOpen(false)
    setInspectionRequest(null)

    if (
      data.resolutionType === "repair" ||
      data.resolutionType === "replacement"
    ) {
      if (!request.inspectionId) {
        throw new Error("The completed inspection could not be identified.")
      }

      setResolutionRequest(request)
      setResolutionInspectionId(request.inspectionId)
      setResolutionDialogOpen(true)

      return
    }

    await loadReturns()
  }
  async function handleResolutionContinue(data: ResolutionDialogData) {
    if (!resolutionRequest || !resolutionInspectionId) return

    const result = await createReturnResolution(
      resolutionRequest.id,
      resolutionInspectionId,
      data
    )

    if (result.error) {
      throw new Error(result.error)
    }

    if (!result.data) {
      throw new Error(
        "The resolution was created but its ID could not be retrieved."
      )
    }

    setResolutionId(result.data)

    if (
      data.resolutionType === "repair" ||
      data.resolutionType === "replacement"
    ) {
      setResolutionType(data.resolutionType)
    }
    setResolutionReturnRequestId(resolutionRequest.id)

    setResolutionDialogOpen(false)

    setResolutionRequest(null)
    setResolutionInspectionId(null)

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
    const result = await startReturnResolution(request.id)

    if (result.error) {
      setError(result.error)
      return
    }

    await loadReturns()
  }
  async function handleCompleteResolution(request: ReturnRequest) {
    const result = await completeReturnResolution(request.id)

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

  const perPage = 4

  const totalPages = Math.ceil(filteredRequests.length / perPage)

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const handleApprove = async () => {
    if (!selectedRequest) return

    const result = await approveReturnRequest(selectedRequest.id)

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

    const result = await declineReturnRequest(selectedRequest.id, reason)

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

    const result = await scheduleReturnInspection(
      selectedRequest.id,
      date,
      time,
      assignedStaff,
      notes
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

  const handleArchive = () => {
    if (!selectedRequest) return

    /*
     * return_requests currently has no archive column.
     * Keep this as a local UI archive until we decide
     * how archived requests should be persisted.
     */
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
    setSelectedRequest(null)
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
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
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
              onCompleteInspection={() => handleCompleteInspection(request)}
              onStartResolution={() => handleStartResolution(request)}
              onCompleteResolution={() => handleCompleteResolution(request)}
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
        <ReturnsPagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={setCurrentPage}
        />
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
      <ResolutionDialog
        open={resolutionDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setResolutionRequest(null)
            setResolutionInspectionId(null)
          }

          setResolutionDialogOpen(open)
        }}
        onContinue={handleResolutionContinue}
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
