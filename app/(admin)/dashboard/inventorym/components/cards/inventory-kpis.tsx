import { AlertTriangle, Clock3, Package, Truck } from "lucide-react"

import { DashboardCard } from "@/components/dashboard_cards"

interface InventoryKPIsProps {
  totalMaterials: number
  lowStockItems: number
  outOfStockItems: number
  expiringSoonItems: number
}

export function InventoryKPIs({
  totalMaterials,
  lowStockItems,
  outOfStockItems,
  expiringSoonItems,
}: InventoryKPIsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
      <DashboardCard
        title="Total Materials"
        value={String(totalMaterials)}
        description="Active inventory materials"
        icon={Package}
        color="text-blue-600 dark:text-blue-400"
      />
      <DashboardCard
        title="Low Stock Alerts"
        value={String(lowStockItems)}
        description="Materials below the stock threshold"
        icon={AlertTriangle}
        color="text-amber-600 dark:text-amber-400"
      />
      <DashboardCard
        title="Out of Stock Items"
        value={String(outOfStockItems)}
        description="Materials requiring replenishment"
        icon={Truck}
        color="text-red-600 dark:text-red-400"
      />
      <DashboardCard
        title="Expiring Soon"
        value={String(expiringSoonItems)}
        description="Materials with expiring batches"
        icon={Clock3}
        color="text-primary"
      />
    </div>
  )
}
