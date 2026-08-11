"use client"

import { useState } from "react"

import { useProducts } from "../hooks/use-products"
import { ProductToolbar } from "./toolbar/product-toolbar"

import { ProductGrid } from "./cards/product-grid"
import type { ProductWithDetails } from "../types/product"
import AddProductDialog from "./dialogs/add-product-dialog"
import EditProductDialog from "./dialogs/edit-product-dialog"

import type { ProductTypeValue } from "../constants/product-options"

import { getProductPricingForDimensions } from "../services/product-pricing"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function Products() {
  const {
    products,
    loading,
    saving,
    error,
    createProduct,
    updateProduct,
    archive,
    restore,
    refresh,
  } = useProducts()

  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithDetails | null>(null)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showArchived, setShowArchived] = useState(false)

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )
  const [selectedType, setSelectedType] = useState("all")

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(search.toLowerCase()) ||
      product.product_code.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory

    const matchesType =
      selectedType === "all" || product.product_type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>

        <p className="text-muted-foreground">
          Manage furniture products and their materials.
        </p>
      </div>

      <ProductToolbar
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onAddProduct={() => setOpenAddDialog(true)}
      />

      {loading ? (
        <ProductGrid
          loading
          products={[]}
          onEdit={() => {}}
          onArchive={() => {}}
        />
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <h3 className="font-medium">No products found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          onEdit={(product) => {
            setSelectedProduct(product)
            setOpenEditDialog(true)
          }}
          onArchive={(product) => {
            setSelectedProduct(product)
            setOpenArchiveDialog(true)
          }}
        />
      )}
      <AddProductDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        saving={saving}
        onSave={async (data) => {
          await toast.promise(
            (async () => {
              const result = await createProduct(data)

              if (!result.data) {
                throw new Error(result.error ?? "Failed to create product.")
              }

              await refresh()
              setOpenAddDialog(false)
            })(),
            {
              loading: "Creating product...",
              success: "Product created successfully.",
              error: (err) => err.message || "Failed to create product.",
            }
          )
        }}
      />
      <EditProductDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        saving={saving}
        product={selectedProduct}
        onSave={async (data) => {
          if (!selectedProduct) return

          await toast.promise(
            (async () => {
              const result = await updateProduct({
                productId: selectedProduct.id,
                product: data.product,
                newImages: data.images,
                existingImages: data.existingImages,
                materials: data.materials,
                labor: data.labor,
                variants: data.variants,
              })

              if (!result.data) {
                throw new Error(result.error ?? "Failed to save changes.")
              }

              await refresh()
              setOpenEditDialog(false)
            })(),
            {
              loading: "Saving changes...",
              success: "Changes saved successfully.",
              error: (err) => err.message || "Failed to save changes.",
            }
          )
        }}
      />
    </div>
  )
}
