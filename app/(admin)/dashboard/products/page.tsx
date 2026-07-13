"use client"

import { useMemo, useState } from "react"

import { Product } from "./types/product"

import ProductCard from "./components/product-card"
import ViewProductDialog from "./components/view-product-dialog"
import AddProductDialog from "./components/add-product-dialog"
import EditProductDialog from "./components/edit-product-dialog"
import ArchiveProductDialog from "./components/archive-product-dialog"
import ProductsPagination from "./components/products-pagination"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { Search } from "lucide-react"

const products: Product[] = [
  {
    id: 1,
    name: "Sliding Window",
    category: "Windows",
    dimensions: "6ft x 4ft",
    price: 12500,
    image: "/products/window.jpg",
    description:
      "Modern aluminum sliding window with tempered glass.",
    status: "active",
  },
  {
    id: 2,
    name: "Glass Swing Door",
    category: "Doors",
    dimensions: "7ft x 3ft",
    price: 18900,
    image: "/products/door.jpg",
    description:
      "Tempered glass swing door with aluminum frame.",
    status: "active",
  },
  {
    id: 3,
    name: "Balcony Railings",
    category: "Railings",
    dimensions: "10ft",
    price: 22500,
    image: "/products/railing.jpg",
    description:
      "Powder-coated aluminum railing system.",
    status: "active",
  },
  {
    id: 4,
    name: "Office Partition",
    category: "Partitions",
    dimensions: "8ft x 8ft",
    price: 32000,
    image: "/products/partition.jpg",
    description:
      "Tempered glass office partition.",
    status: "archived",
  },
]

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] =
    useState("all")

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const [dialogOpen, setDialogOpen] =
    useState(false)

  const [editOpen, setEditOpen] =
    useState(false)

  const [archiveOpen, setArchiveOpen] =
    useState(false)

  const [currentPage, setCurrentPage] =
    useState(1)

  const productsPerPage = 8

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === "all"
          ? true
          : product.category ===
            categoryFilter

      return (
        matchesSearch &&
        matchesCategory
      )
    })
  }, [search, categoryFilter])

  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  )

  const startIndex =
    (currentPage - 1) *
    productsPerPage

  const paginatedProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    )

  const totalProducts =
    products.length

  const activeProducts =
    products.filter(
      (p) => p.status === "active"
    ).length

  const archivedProducts =
    products.filter(
      (p) => p.status === "archived"
    ).length

  const categoryCount = products.reduce(
    (acc, product) => {
      acc[product.category] =
        (acc[product.category] || 0) + 1

      return acc
    },
    {} as Record<string, number>
  )

  const topCategory =
    Object.entries(categoryCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "N/A"

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Product Catalog
        </h1>

        <p className="text-muted-foreground">
          Manage your product offerings
          and catalog.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Total Products
            </p>

            <h2 className="text-3xl font-bold">
              {totalProducts}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Active Products
            </p>

            <h2 className="text-3xl font-bold">
              {activeProducts}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Archived Products
            </p>

            <h2 className="text-3xl font-bold">
              {archivedProducts}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Top Category
            </p>

            <h2 className="text-3xl font-bold">
              {topCategory}
            </h2>
          </CardContent>
        </Card>

      </div>

      {/* FILTERS */}

      <div className="flex flex-col gap-4">

        <ToggleGroup
          type="single"
          value={categoryFilter}
          onValueChange={(value) => {
            if (value) {
              setCategoryFilter(value)
              setCurrentPage(1)
            }
          }}
          className="justify-start"
        >

          <ToggleGroupItem value="all">
            All
          </ToggleGroupItem>

          <ToggleGroupItem value="Windows">
            Windows
          </ToggleGroupItem>

          <ToggleGroupItem value="Doors">
            Doors
          </ToggleGroupItem>

          <ToggleGroupItem value="Railings">
            Railings
          </ToggleGroupItem>

          <ToggleGroupItem value="Partitions">
            Partitions
          </ToggleGroupItem>

        </ToggleGroup>

        {/* SEARCH + ACTIONS */}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search products..."
              className="pl-9 w-full md:w-[350px]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
            />

          </div>

          <AddProductDialog />

        </div>

      </div>

      {/* PRODUCT GRID */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {paginatedProducts.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}

              onView={() => {
                setSelectedProduct(product)
                setDialogOpen(true)
              }}

              onEdit={() => {
                setSelectedProduct(product)
                setEditOpen(true)
              }}

              onArchive={() => {
                setSelectedProduct(product)
                setArchiveOpen(true)
              }}
            />
          )
        )}

      </div>

      {/* PAGINATION */}

      {filteredProducts.length > 0 && (
        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* EMPTY STATE */}

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">

            <h3 className="text-lg font-semibold">
              No Products Found
            </h3>

            <p className="text-muted-foreground">
              Try adjusting your search
              or filters.
            </p>

          </CardContent>
        </Card>
      )}

      {/* VIEW PRODUCT */}

      <ViewProductDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* EDIT PRODUCT */}

      <EditProductDialog
        product={selectedProduct}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* ARCHIVE PRODUCT */}

      <ArchiveProductDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        productName={
          selectedProduct?.name ?? ""
        }
      />

    </div>
  )
}