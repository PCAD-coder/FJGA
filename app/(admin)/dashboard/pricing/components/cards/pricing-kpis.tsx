"use client"

import { DashboardCard } from "@/components/dashboard_cards"
import { Package, Wrench, Percent, ChartNoAxesCombined } from "lucide-react"

interface PricingKPIsProps {
  totalMaterials: number
  totalServices: number
  averageMaterialMarkup: number
  averageLaborMarkup: number
}

export default function PricingKPIs({
  totalMaterials,
  totalServices,
  averageMaterialMarkup,
  averageLaborMarkup,
}: PricingKPIsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
      <DashboardCard
        title="Materials"
        value={String(totalMaterials)}
        description="Materials with pricing"
        icon={Package}
        color="text-blue-600 dark:text-blue-400"
      />
      <DashboardCard
        title="Labor Services"
        value={String(totalServices)}
        description="Available labor services"
        icon={Wrench}
        color="text-emerald-600 dark:text-emerald-400"
      />
      <DashboardCard
        title="Avg Material Markup"
        value={`${averageMaterialMarkup.toFixed(1)}%`}
        description="Average across material prices"
        icon={Percent}
        color="text-amber-600 dark:text-amber-400"
      />
      <DashboardCard
        title="Avg Labor Markup"
        value={`${averageLaborMarkup.toFixed(1)}%`}
        description="Average across labor services"
        icon={ChartNoAxesCombined}
        color="text-primary"
      />
    </div>
  )
}
