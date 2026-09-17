"use client"

import {
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { Order } from "../types/order"

interface Props {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

const productionStages = [
  {
    key: "material_prep",
    label: "Material Prep",
  },
  {
    key: "glass_cutting",
    label: "Glass Cutting",
  },
  {
    key: "frame_fabrication",
    label: "Frame Fabrication",
  },
  {
    key: "assembly",
    label: "Assembly",
  },
  {
    key: "finishing",
    label: "Finishing",
  },
  {
    key: "quality_check",
    label: "Quality Check",
  },
  {
    key: "ready_for_delivery",
    label: "Ready for Delivery",
  },
]

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
function formatStage(stage: string) {
  const labels: Record<string, string> = {
    pending: "Pending",
    material_prep: "Material Prep",
    glass_cutting: "Glass Cutting",
    frame_fabrication: "Frame Fabrication",
    assembly: "Assembly",
    finishing: "Finishing",
    quality_check: "Quality Check",
    ready_for_delivery: "Ready for Delivery",
    approved: "Approved",
    in_production: "Production",
    delivered: "Completed",
  }

  return (
    labels[stage] ??
    stage.replaceAll("_", " ")
  )
}

export default function OrderProgressDialog({
  order,
  open,
  onOpenChange,
}: Props) {
  const currentStageIndex = productionStages.findIndex(
    (stage) =>
      stage.label.toLowerCase() ===
      order.currentStage.toLowerCase()
  )

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Track Order #{order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">
              {order.productName}
            </h3>

            <p className="text-sm text-muted-foreground">
              Current Stage:{" "}
              <span className="font-medium text-foreground">
                {order.currentStage}
              </span>
            </p>

            <p className="text-sm text-muted-foreground">
              Progress:{" "}
              <span className="font-medium text-foreground">
                {order.progressPercentage}%
              </span>
            </p>
          </div>

          <div className="space-y-4">
            {productionStages.map(
              (stage, index) => {
                const completed =
                  currentStageIndex >= 0 &&
                  index < currentStageIndex

                const current =
                  currentStageIndex === index

                const historyItem =
                  order.timeline.find(
                    (item) =>
                      item.toStage === stage.key
                  )

                return (
                  <div
                    key={stage.key}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      {completed || current ? (
                        <CheckCircle2
                          className={
                            current
                              ? "text-primary"
                              : "text-green-600"
                          }
                        />
                      ) : (
                        <Circle className="text-muted-foreground" />
                      )}

                      {index <
                        productionStages.length - 1 && (
                        <div className="mt-2 h-10 w-px bg-border" />
                      )}
                    </div>

                    <div className="pb-4">
                      <p
                        className={`font-medium ${
                          current
                            ? "text-primary"
                            : ""
                        }`}
                      >
                        {stage.label}
                      </p>

                      {current && (
                        <p className="text-sm text-primary">
                          Current Stage
                        </p>
                      )}

                      {historyItem && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          <p>
                            {formatDate(
                              historyItem.changedAt
                            )}
                          </p>

                          {historyItem.changedBy && (
                            <p>
                              Updated by{" "}
                              {historyItem.changedBy}
                            </p>
                          )}

                          {historyItem.notes && (
                            <p className="mt-1">
                              {historyItem.notes}
                            </p>
                          )}
                        </div>
                      )}

                      {!completed &&
                        !current &&
                        !historyItem && (
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            Waiting
                          </div>
                        )}
                    </div>
                  </div>
                )
              }
            )}
          </div>

          {order.timeline.length > 0 && (
            <div className="border-t pt-5">
              <h3 className="mb-4 font-semibold">
                Production History
              </h3>

              <div className="space-y-3">
                {order.timeline.map(
                  (history) => (
                    <div
                      key={history.id}
                      className="rounded-lg border p-3"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {formatStage(history.toStage)}
                          </p>

                          {history.fromStage && (
                            <p className="text-sm text-muted-foreground">
                              From:{" "}
                              {history.fromStage ? formatStage(history.fromStage): "-"}
                            </p>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {formatDate(
                            history.changedAt
                          )}
                        </p>
                      </div>

                      {history.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {history.notes}
                        </p>
                      )}

                      {history.changedBy && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Updated by{" "}
                          {history.changedBy}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}