"use client"

import { useMemo, useState } from "react"

import {
  Package,
  AlertTriangle,
  Truck,
  Search,
  Download,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Material {
  id: number
  name: string
  category: string
  specs: string
  size: string
  stock: number
  unitPrice: number
}

const materials: Material[] = [
  {
    id: 1,
    name: '1/4" Clear Glass',
    category: "Glass",
    specs: "Clear",
    size: "48 x 96",
    stock: 45,
    unitPrice: 1250,
  },
  {
    id: 2,
    name: '1/2" Tempered Glass',
    category: "Glass",
    specs: "Tempered",
    size: "48 x 96",
    stock: 8,
    unitPrice: 2450,
  },
  {
    id: 3,
    name: "798 Series Aluminum",
    category: "Aluminum",
    specs: "Powder Coated",
    size: "6 meters",
    stock: 25,
    unitPrice: 850,
  },
  {
    id: 4,
    name: "38 Series Aluminum",
    category: "Aluminum",
    specs: "Anodized",
    size: "6 meters",
    stock: 5,
    unitPrice: 920,
  },
  {
    id: 5,
    name: "Bronze Glass",
    category: "Glass",
    specs: "Tinted",
    size: "48 x 96",
    stock: 15,
    unitPrice: 1850,
  },
]

export default function InventoryPage() {
  const [search, setSearch] = useState("")

const [categoryFilter, setCategoryFilter] =
  useState("all")

  const filteredMaterials = useMemo(() => {
  return materials.filter((material) => {
    const matchesSearch =
      material.name
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === "all"
        ? true
        : categoryFilter === "low-stock"
        ? material.stock <= 10
        : material.category === categoryFilter

    return (
      matchesSearch &&
      matchesCategory
    )
  })
}, [search, categoryFilter])
  const totalInventoryValue =
    materials.reduce(
      (sum, material) =>
        sum +
        material.stock *
          material.unitPrice,
      0
    )

  const lowStockItems =
    materials.filter(
      (item) =>
        item.stock <= 10 &&
        item.stock > 0
    ).length

  const pendingRestock =
    materials.filter(
      (item) => item.stock <= 5
    ).length

  const getStatus = (
    stock: number
  ) => {
    if (stock <= 5)
      return {
        label: "Critical",
        variant:
          "destructive" as const,
      }

    if (stock <= 10)
      return {
        label: "Low Stock",
        variant:
          "secondary" as const,
      }

    return {
      label: "Healthy",
      variant:
        "default" as const,
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Inventory Management
        </h1>

        <p className="text-muted-foreground">
          Monitor materials,
          stock levels, and pricing.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-3">

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-blue-500" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Total Inventory Value
                </p>

                <h2 className="text-2xl font-bold">
                  ₱
                  {totalInventoryValue.toLocaleString()}
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
                  Pending Restock
                </p>

                <h2 className="text-2xl font-bold">
                  {pendingRestock}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* TOOLBAR */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-wrap gap-2">

          <div className="flex flex-col gap-4">

  {/* FILTER BUTTONS */}

  <ToggleGroup
    type="single"
    value={categoryFilter}
    onValueChange={(value) => {
      if (value) {
        setCategoryFilter(value)
      }
    }}
    className="justify-start"
  >

    <ToggleGroupItem value="all">
      All
    </ToggleGroupItem>

    <ToggleGroupItem value="Glass">
  Glass (
  {
    materials.filter(
      (m) =>
        m.category === "Glass"
    ).length
  }
  )
</ToggleGroupItem>

    <ToggleGroupItem value="Aluminum">
  Aluminum (
  {
    materials.filter(
      (m) =>
        m.category === "Aluminum"
    ).length
  }
  )
</ToggleGroupItem>

    <ToggleGroupItem value="low-stock">
  Low Stock (
  {
    materials.filter(
      (m) => m.stock <= 10
    ).length
  }
  )
</ToggleGroupItem>

  </ToggleGroup>

  {/* SEARCH + ACTIONS */}

  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

    <div className="relative">

      <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

      <Input
        placeholder="Search materials..."
        className="pl-9 w-full md:w-[350px]"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

    </div>

    <div className="flex gap-2">

      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>

      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Material
      </Button>

    </div>

  </div>

</div>

          

        </div>

      </div>

      {/* TABLE */}

      <Card>

        <CardContent className="pt-6">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Material
                </TableHead>

                <TableHead>
                  Category
                </TableHead>

                <TableHead>
                  Specs
                </TableHead>

                <TableHead>
                  Size
                </TableHead>

                <TableHead>
                  Stock
                </TableHead>

                <TableHead>
                  Unit Price
                </TableHead>

                <TableHead>
                  Total Value
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {filteredMaterials.map(
                (material) => {
                  const status =
                    getStatus(
                      material.stock
                    )

                  return (
                    <TableRow
                      key={
                        material.id
                      }
                    >
                      <TableCell className="font-medium">
                        {
                          material.name
                        }
                      </TableCell>

                      <TableCell>
                        {
                          material.category
                        }
                      </TableCell>

                      <TableCell>
                        {
                          material.specs
                        }
                      </TableCell>

                      <TableCell>
                        {
                          material.size
                        }
                      </TableCell>

                      <TableCell>
                        {
                          material.stock
                        }
                      </TableCell>

                      <TableCell>
                        ₱
                        {material.unitPrice.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        ₱
                        {(
                          material.stock *
                          material.unitPrice
                        ).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            status.variant
                          }
                        >
                          {
                            status.label
                          }
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">

                          <Button
                            size="icon"
                            variant="outline"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                        </div>
                      </TableCell>

                    </TableRow>
                  )
                }
              )}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>
  )
}