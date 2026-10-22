import {
  AlertTriangle,
  Clock3,
  Package,
  Truck,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Package className="h-8 w-8 text-blue-500" />

            <div>
              <p className="text-sm text-muted-foreground">
                Total Materials
              </p>

              <h2 className="text-2xl font-bold">
                {totalMaterials}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />

            <div>
              <p className="text-sm text-muted-foreground">
                Low Stock Alerts
              </p>

              <h2 className="text-2xl font-bold">
                {lowStockItems}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Truck className="h-8 w-8 text-red-500" />

            <div>
              <p className="text-sm text-muted-foreground">
                Out of Stock Items
              </p>

              <h2 className="text-2xl font-bold">
                {outOfStockItems}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Clock3 className="h-8 w-8 text-orange-500" />

            <div>
              <p className="text-sm text-muted-foreground">
                Expiring Soon
              </p>

              <h2 className="text-2xl font-bold">
                {expiringSoonItems}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}