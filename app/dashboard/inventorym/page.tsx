'use client'

import { DashboardCard } from "@/components/dashboard_cards"
import { Package, AlertTriangle, DollarSign } from "lucide-react"

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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function InventoryPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr] gap-6">

      {/* 🔹 FILTER PANEL */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* CATEGORY */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Category</p>
            <RadioGroup defaultValue="all">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Materials</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="glass" id="glass" />
                <Label htmlFor="glass">Glass Only</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="aluminum" id="aluminum" />
                <Label htmlFor="aluminum">Aluminum Only</Label>
              </div>
            </RadioGroup>
          </div>

          {/* GLASS TYPE */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Glass Type</p>

            {["Clear", "Tempered", "Frosted", "Bronze"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Checkbox id={item} />
                <Label htmlFor={item}>{item}</Label>
              </div>
            ))}
          </div>

          {/* ALUMINUM SERIES */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Aluminum Series</p>

            {["798 Series", "38 Series", "Analoc"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Checkbox id={item} />
                <Label htmlFor={item}>{item}</Label>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* 🔹 RIGHT SIDE */}
      <div className="space-y-6">

        {/* 🔹 HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Master Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Comprehensive material stock management
          </p>
        </div>

        {/* 🔹 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard
            title="Total Material Value"
            value="$23,808.75"
            description=""
            icon={DollarSign}
            color="text-green-500"
          />

          <DashboardCard
            title="Low Stock Alerts"
            value="3"
            description="Items < 5"
            icon={AlertTriangle}
            color="text-red-500"
          />

          <DashboardCard
            title="Pending Restock"
            value="3"
            description=""
            icon={Package}
            color="text-yellow-500"
          />
        </div>

        {/* 🔹 SEARCH + ACTIONS */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <Input placeholder="Search materials..." />

          <div className="flex gap-2">
            <Button variant="outline">Bulk Update</Button>
            <Button variant="outline">Export</Button>
            <Button>+ Add Material</Button>
          </div>
        </div>

        {/* 🔹 TABLE */}
        <div className="rounded-xl border bg-card">
          <div className="overflow-x-auto w-full">
            <Table className="w-full">

              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                <TableRow>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>1/4" Clear Glass</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs">
                      Glass
                    </span>
                  </TableCell>
                  <TableCell>1/4 Thickness</TableCell>
                  <TableCell>4ft x 8ft</TableCell>
                  <TableCell>
                    45
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                      Healthy
                    </span>
                  </TableCell>
                  <TableCell>$125.50</TableCell>
                  <TableCell>✏️ 🗑️</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>1/4" Bronze Glass</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs">
                      Glass
                    </span>
                  </TableCell>
                  <TableCell>Bronze Tint</TableCell>
                  <TableCell>4ft x 8ft</TableCell>
                  <TableCell>
                    3
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-red-100 text-red-600">
                      Critical
                    </span>
                  </TableCell>
                  <TableCell>$145.75</TableCell>
                  <TableCell>✏️ 🗑️</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>Analoc Profile</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs">
                      Aluminum
                    </span>
                  </TableCell>
                  <TableCell>Analoc Finish</TableCell>
                  <TableCell>20ft bars</TableCell>
                  <TableCell>
                    28
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                      Healthy
                    </span>
                  </TableCell>
                  <TableCell>$35.00</TableCell>
                  <TableCell>✏️ 🗑️</TableCell>
                </TableRow>

              </TableBody>

            </Table>
          </div>
        </div>

      </div>
    </div>
  )
}