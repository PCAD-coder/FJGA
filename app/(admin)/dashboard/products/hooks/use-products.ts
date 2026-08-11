"use client"

import { useCallback, useEffect, useState } from "react"

import {
  archiveProduct,
  getProductsWithDetails,
  restoreProduct,
} from "../services/product-service"

import {
  buildProduct,
  rebuildProduct,
  type BuildProductInput,
  type RebuildProductInput,
} from "../services/product-constructor"

import type { ProductWithDetails } from "../types/product"

import { getProductPricing } from "../services/product-pricing"

export function useProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await getProductsWithDetails()

    if (result.error) {
      setProducts([])
      setError(result.error)
    } else {
      const productsWithPricing = await Promise.all(
        (result.data ?? []).map(async (product) => {
          const pricing = await getProductPricing(product.id)

          return {
            ...product,
            pricing: pricing.data ?? {
              width: product.width ?? null,
              height: product.height ?? null,
              depth: product.depth ?? null,

              materialCost: 0,
              laborCost: 0,
              productionCost: 0,
              sellingPrice: 0,
              totalMarkup: 0,

              materialsSnapshot: [],
              laborSnapshot: [],
            },
          }
        })
      )

      setProducts(productsWithPricing)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  async function createProduct(input: BuildProductInput) {
    setSaving(true)
    setError(null)

    const result = await buildProduct(input)

    if (result.error) {
      setError(result.error)
    } else {
      await loadProducts()
    }

    setSaving(false)

    return result
  }

  async function updateProduct(input: RebuildProductInput) {
    setSaving(true)
    setError(null)

    const result = await rebuildProduct(input)

    if (result.error) {
      setError(result.error)
    } else {
      await loadProducts()
    }

    setSaving(false)

    return result
  }

  async function archive(id: string) {
    setSaving(true)
    setError(null)

    const result = await archiveProduct(id)

    if (result.error) {
      setError(result.error)
    } else {
      await loadProducts()
    }

    setSaving(false)

    return result
  }

  async function restore(id: string) {
    setSaving(true)
    setError(null)

    const result = await restoreProduct(id)

    if (result.error) {
      setError(result.error)
    } else {
      await loadProducts()
    }

    setSaving(false)

    return result
  }

  async function refresh() {
    await loadProducts()
  }

  return {
    products,

    loading,

    saving,

    error,

    refresh,

    createProduct,

    updateProduct,

    archive,

    restore,
  }
}
