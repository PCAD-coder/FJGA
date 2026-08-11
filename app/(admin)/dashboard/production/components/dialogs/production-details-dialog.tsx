"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { ProductionProject } from "../../types/production"
import { getProductionHistory } from "../../services/production"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProductionHistoryEntry {
  id: string
  from_stage: string | null
  to_stage: string
  notes: string | null
  changed_at: string
  profiles:
    | { first_name: string; last_name: string }
    | { first_name: string; last_name: string }[]
    | null
}

interface Props {
  project: ProductionProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductionDetailsDialog({
  project,
  open,
  onOpenChange,
}: Props) {
  const [history, setHistory] = useState<ProductionHistoryEntry[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    async function loadHistory() {
      if (!project) return

      setLoadingHistory(true)

      try {
        const data = await getProductionHistory(project.id)
        setHistory(data)
      } finally {
        setLoadingHistory(false)
      }
    }

    loadHistory()
  }, [project])

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton = {false} className="h-[85vh] !w-[1000px] !max-w-[95vw] overflow-hidden p-0">
        <div className="grid h-[85vh] md:grid-cols-[360px_1fr]">
          {/* LEFT PANEL (fixed) */}
          <div className="overflow-hidden border-r bg-muted/20 p-6">
            <div className="flex h-full flex-col">
              <div className="relative h-[280px] overflow-hidden rounded-xl border bg-background">
                <Image
                  src={project.imageUrl ?? "/placeholder.jpg"}
                  alt={project.projectName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-6 flex-1 space-y-5">
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Order number
                  </p>
                  <p className="font-semibold">{project.orderNumber}</p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Client
                  </p>
                  <p className="font-semibold">{project.clientName}</p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Dimensions
                  </p>
                  <p className="font-semibold">
                    {project.dimensions ?? "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Estimated completion
                  </p>
                  <p className="font-semibold">{project.estimatedCompletion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (scrollable) */}
          <div className="h-full overflow-y-auto">
            {/* Sticky header */}
          <div className="sticky top-0 z-10 border-b bg-background p-6">
  <div className="flex items-start justify-between gap-4">
    <DialogHeader className="space-y-3 text-left">
      <DialogTitle className="text-2xl">
        {project.projectName}
      </DialogTitle>

      <div className="flex items-center gap-3">
        <Badge>{project.stage}</Badge>
        <span className="text-sm text-muted-foreground">
          {project.progress}% complete
        </span>
      </div>
    </DialogHeader>

    <Button
      variant="ghost"
      size="icon"
      onClick={() => onOpenChange(false)}
      className="shrink-0"
    >
      <X className="h-5 w-5" />
    </Button>
  </div>
</div>

            {/* Scrollable content */}
            <div className="space-y-6 p-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Production progress</span>
                  <span>{project.progress}%</span>
                </div>

                <Progress value={project.progress} />
              </div>

              {/* Timeline */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold">Production timeline</h3>

                <p className="mb-4 text-sm text-muted-foreground">
                  A history of every stage update for this order.
                </p>

                {loadingHistory ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="mt-1 h-3 w-3 rounded-full" />

                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-56" />
                          <Skeleton className="h-12 w-full rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No production history yet.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {history.map((entry) => (
                      <div
                        key={entry.id}
                        className="relative border-l border-border pl-5"
                      >
                        <div className="absolute top-1 left-[-5px] h-2.5 w-2.5 rounded-full bg-primary" />

                        <div className="flex items-center justify-between gap-4">
                          <h4 className="font-semibold">
                            {entry.to_stage
                              .replaceAll("_", " ")
                              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                          </h4>

                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.changed_at).toLocaleString()}
                          </span>
                        </div>

                        {entry.from_stage && (
                          <p className="text-sm text-muted-foreground">
                            Moved from{" "}
                            {entry.from_stage
                              .replaceAll("_", " ")
                              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                          </p>
                        )}

                        {entry.profiles && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Updated by{" "}
                            {Array.isArray(entry.profiles)
                              ? `${entry.profiles[0]?.first_name ?? ""} ${entry.profiles[0]?.last_name ?? ""}`
                              : `${entry.profiles.first_name} ${entry.profiles.last_name}`}
                          </p>
                        )}

                        {entry.notes && (
                          <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-sm">
                            {entry.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
