"use client"

import {
  FileText,
  Package,
  Wrench,
  Truck,
} from "lucide-react"

import { ProductionStage } from "../types/order-monitoring"

interface Props {
  stage: ProductionStage
}

export default function ProductionStageProgress({
  stage,
}: Props) {
  const iconStyle = (
    active: boolean
  ) =>
    active
      ? "bg-green-600 text-white"
      : "bg-muted text-muted-foreground"

  return (
    <div className="flex items-center gap-1">

      <div
        className={`rounded-full p-2 ${iconStyle(
          stage.quotationApproved
        )}`}
      >
        <FileText className="h-4 w-4" />
      </div>

      <div className="h-[2px] w-8 bg-border" />

      <div
        className={`rounded-full p-2 ${iconStyle(
          stage.materialPrep
        )}`}
      >
        <Package className="h-4 w-4" />
      </div>

      <div className="h-[2px] w-8 bg-border" />

      <div
        className={`rounded-full p-2 ${iconStyle(
          stage.fabrication
        )}`}
      >
        <Wrench className="h-4 w-4" />
      </div>

      <div className="h-[2px] w-8 bg-border" />

      <div
        className={`rounded-full p-2 ${iconStyle(
          stage.ready
        )}`}
      >
        <Truck className="h-4 w-4" />
      </div>

    </div>
  )
}