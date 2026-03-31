import { DashboardCard } from "@/components/dashboard_cards"
import { Package, AlertTriangle, ClipboardList, DollarSign } from "lucide-react"

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
    

      {/* 🔹 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard 
  title="Total Items" 
  value="847" 
  description="All materials" 
  icon={Package} 
  color="text-blue-500"
/>

<DashboardCard 
  title="Restock Alerts" 
  value="12" 
  description="Low stock items" 
  icon={AlertTriangle} 
  color="text-red-500"
/>

<DashboardCard 
  title="Orders" 
  value="24" 
  description="Pending orders" 
  icon={ClipboardList} 
  color="text-green-500"
/>

<DashboardCard 
  title="Revenue" 
  value="₱25,000" 
  description="This month" 
  icon={DollarSign} 
  color="text-yellow-500"
/>

      </div>

      {/* 🔹 INVENTORY SECTION */}
      <div className="space-y-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Inventory Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage your materials
            </p>
          </div>

          <div className="flex gap-2">
            <Button>+ Add New</Button>
            <Button variant="outline">Update</Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <Input placeholder="Search materials..." />
          <Button variant="outline">Filter</Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead><strong>Material</strong></TableHead>
                <TableHead><strong>Category</strong></TableHead>
                <TableHead><strong>Size</strong></TableHead>
                <TableHead><strong>Stock</strong></TableHead>
                <TableHead><strong>Price</strong></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>Bronze Glass</TableCell>
                <TableCell>Glass</TableCell>
                <TableCell>48x96</TableCell>
                <TableCell className="flex items-center gap-2">
                  <span>78</span>
                  <span className="px-2 py-1 rounded-md bg-red-100 text-red-600 text-xs font-medium">
                    Low Stock
                  </span>
                </TableCell>
                <TableCell>₱125</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Aluminum Profile</TableCell>
                <TableCell>Aluminum</TableCell>
                <TableCell>6m</TableCell>
                <TableCell className="flex items-center gap-2">
                  <span>12</span>
                  <span className="px-2 py-1 rounded-md bg-red-100 text-red-600 text-xs font-medium">
                    Low Stock
                  </span>
                </TableCell>
                <TableCell>₱42</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  )
}