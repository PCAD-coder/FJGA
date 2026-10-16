"use client"
import { useEffect, useMemo, useState } from "react"
import { CustomOrderWizard } from "./request-form/custom-order-wizard"
import ClientQuotationDialog from "./quotation/client-quotation-dialog"

import {
  getClientQuotationById,
  getQuotationForCustomRequest,
} from "../services/custom-order-quotation.service"

import type { ClientQuotationDetail } from "../types/custom-order-request"

import {
  ArrowRight,
  Clock3,
  FileText,
  PackageCheck,
  Plus,
  Search,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getCustomOrderRequestById,
  getCustomOrderRequests,
} from "../services/custom-order-request.service"
import type {
  CustomOrderRequestDetail,
  CustomOrderRequestListItem,
} from "../types/custom-order-request"
import { CustomOrderDetailsDialog } from "./request-details/custom-order-details-dialog"

const statusConfig: Record<
  CustomOrderRequestListItem["status"],
  {
    label: string
    className: string
  }
> = {
  pending: {
    label: "Pending Review",
    className: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
  },

  quoted: {
    label: "Quote Ready",
    className: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
  },

  approved: {
    label: "Accepted",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  },

  denied: {
    label: "Denied",
    className: "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
  },
}
function CustomOrderCard({
  request,
  onViewDetails,
  onQuotationAccepted,
}: {
  request: CustomOrderRequestListItem
  onViewDetails: (requestId: string) => void
  onQuotationAccepted: () => void | Promise<void>
}) {
  const status = statusConfig[request.status]

  const [quotationDialogOpen, setQuotationDialogOpen] = useState(false)

  const [selectedQuotation, setSelectedQuotation] =
    useState<ClientQuotationDetail | null>(null)

  const [quotationLoading, setQuotationLoading] = useState(false)

  const [quotationError, setQuotationError] = useState<string | null>(null)

  async function handleViewQuotation(requestId: string) {
    setSelectedQuotation(null)
    setQuotationError(null)
    setQuotationLoading(true)
    setQuotationDialogOpen(true)

    try {
      const summary = await getQuotationForCustomRequest(requestId)

      if (!summary) {
        throw new Error("No quotation is available for this request.")
      }

      const detail = await getClientQuotationById(summary.id)

      setSelectedQuotation(detail)
    } catch (error) {
      console.error("Failed to load quotation:", error)

      setQuotationError(
        error instanceof Error ? error.message : "Failed to load quotation."
      )
    } finally {
      setQuotationLoading(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden transition-shadow hover:shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            {/* Reference Image */}
            <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg border bg-muted sm:h-28 sm:w-40">
              {request.reference_image_url ? (
                <img
                  src={request.reference_image_url}
                  alt={`${request.project_name} reference`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Request Information */}
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">
                  {request.request_number ?? "Custom Request"}
                </p>

                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  {request.project_name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {formatCategory(request.product_category)}
                  <span className="mx-2">•</span>
                  Quantity: {request.quantity}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />

                  <span>Submitted {formatDate(request.created_at)}</span>
                </div>

                <span>{formatDimensions(request)}</span>
              </div>
            </div>

            {/* Right Action */}
            <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
              {request.status === "quoted" ||
request.status === "approved" ? (
  <Button
    type="button"
    onClick={() =>
      void handleViewQuotation(request.id)
    }
  >
    {request.status === "approved"
      ? "View Accepted Quotation"
      : "View Quotation"}

    <ArrowRight className="ml-2 h-4 w-4" />
  </Button>
) : (
  <Button
    type="button"
    variant="ghost"
    onClick={() =>
      onViewDetails(request.id)
    }
  >
    View Details
    <ArrowRight className="ml-2 h-4 w-4" />
  </Button>
)}
            </div>
          </div>
        </CardContent>
      </Card>

      <ClientQuotationDialog
        open={quotationDialogOpen}
        onOpenChange={(open) => {
          setQuotationDialogOpen(open)

          if (!open) {
            setSelectedQuotation(null)
            setQuotationError(null)
          }
        }}
        quotation={selectedQuotation}
        loading={quotationLoading}
        error={quotationError}
        onQuotationChanged={onQuotationAccepted}
      />
    </>
  )
}

function RequestList({
  requests,
  onViewDetails,
  onQuotationAccepted,
}: {
  requests: CustomOrderRequestListItem[]
  onViewDetails: (requestId: string) => void
  onQuotationAccepted: () => void | Promise<void>
}) {
  if (requests.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-semibold">No custom requests found</h3>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Custom project requests matching this status will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <CustomOrderCard
          key={request.id}
          request={request}
          onViewDetails={onViewDetails}
          onQuotationAccepted={onQuotationAccepted}
        />
      ))}
    </div>
  )
}

export default function CustomOrder() {
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)
  const [requests, setRequests] = useState<CustomOrderRequestListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [selectedRequest, setSelectedRequest] =
    useState<CustomOrderRequestDetail | null>(null)

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

  async function handleViewDetails(requestId: string) {
    try {
      setSelectedRequest(null)
      setIsDetailsLoading(true)
      setIsDetailsOpen(true)

      const request = await getCustomOrderRequestById(requestId)

      setSelectedRequest(request)
    } catch (error) {
      console.error("Failed to load custom order details:", error)

      setIsDetailsOpen(false)
    } finally {
      setIsDetailsLoading(false)
    }
  }

  const totalRequests = requests.length

  const pendingReviewCount = requests.filter(
    (request) => request.status === "pending"
  ).length

  const quoteReadyCount = requests.filter(
    (request) => request.status === "quoted"
  ).length

  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesTab = activeTab === "all" || request.status === activeTab

      const matchesSearch =
        normalizedSearch === "" ||
        request.project_name.toLowerCase().includes(normalizedSearch) ||
        request.request_number?.toLowerCase().includes(normalizedSearch) ||
        request.product_category?.toLowerCase().includes(normalizedSearch)

      return matchesTab && matchesSearch
    })
  }, [requests, activeTab, searchTerm])

  async function loadRequests() {
    try {
      setIsLoading(true)
      setLoadError(null)

      const data = await getCustomOrderRequests()

      setRequests(data)
    } catch (error) {
      console.error("Failed to load custom order requests:", error)

      setLoadError(
        error instanceof Error
          ? error.message
          : "Failed to load custom order requests."
      )
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    void loadRequests()
  }, [])

  if (isCreatingRequest) {
    return (
      <CustomOrderWizard
        onCancel={() => setIsCreatingRequest(false)}
        onSuccess={async () => {
          setIsCreatingRequest(false)
          await loadRequests()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Orders</h1>

          <p className="mt-1 text-muted-foreground">
            Create and track your made-to-order projects with FJGA.
          </p>
        </div>

        <Button size="lg" onClick={() => setIsCreatingRequest(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Custom Request
        </Button>
      </div>

      {/* Small Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold">{totalRequests}</p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold">{pendingReviewCount}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <PackageCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold">{quoteReadyCount}</p>

              <p className="text-sm text-muted-foreground">Quote Ready</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="all">All Requests</TabsTrigger>

            <TabsTrigger value="pending">Pending Review</TabsTrigger>

            <TabsTrigger value="quoted">Quote Ready</TabsTrigger>

            <TabsTrigger value="approved">Accepted</TabsTrigger>

            <TabsTrigger value="denied">Denied</TabsTrigger>
          </TabsList>

          <div className="relative w-full lg:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search custom requests..."
              className="pl-9"
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <Card>
              <CardContent className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Loading custom requests...
                </p>
              </CardContent>
            </Card>
          ) : loadError ? (
            <Card className="border-destructive/50">
              <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
                <div>
                  <h3 className="font-semibold">
                    Unable to load custom requests
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {loadError}
                  </p>
                </div>

                <Button variant="outline" onClick={() => void loadRequests()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <RequestList
              requests={filteredRequests}
              onViewDetails={(requestId) => {
                void handleViewDetails(requestId)
              }}
              onQuotationAccepted={async () => {
                await loadRequests()
              }}
            />
          )}
        </TabsContent>
      </Tabs>

      <CustomOrderDetailsDialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open)

          if (!open) {
            setSelectedRequest(null)
          }
        }}
        request={selectedRequest}
        isLoading={isDetailsLoading}
      />
    </div>
  )
}
function formatCategory(category: string | null) {
  if (!category) return "Custom Product"

  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}
function formatDimensions(request: CustomOrderRequestListItem) {
  const { width, height, depth, dimension_unit } = request

  if (width == null || height == null) {
    return "Dimensions not specified"
  }

  const unit = dimension_unit ?? ""

  if (depth != null) {
    return `${width} × ${height} × ${depth} ${unit}`
  }

  return `${width} × ${height} ${unit}`
}
