"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getProductionProjects,
  getReturnProductionProjects,
  updateProductionStage,
  updateReturnProductionStage,
} from "../services/production"

import type { ProductionProject } from "../types/production"

export function useProduction() {
  const [projects, setProjects] = useState<ProductionProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

const [orderProjects, returnProjects] = await Promise.all([
  getProductionProjects(),
  getReturnProductionProjects(),
])

setProjects([
  ...orderProjects,
  ...returnProjects,
])
    } catch (err: any) {
      console.error("Load Production Error:", err)
      setError(err.message ?? "Failed to load production projects")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

const changeStage = async (
  projectId: string,
  stage: string,
  notes?: string,
  replacement?: {
    orderItemId: string
    materialId: string
    quantity: number
    reason?: string
  }
) => {
  try {
    const project = projects.find(
      (item) => item.id === projectId
    )

    if (!project) {
      throw new Error("Production project not found")
    }

    if (project.projectType === "return") {
      await updateReturnProductionStage(
        projectId,
        stage,
        notes
      )
    } else {
      await updateProductionStage(
        projectId,
        stage,
        notes,
        replacement
      )
    }

    await loadProjects()
  } catch (err: unknown) {
    console.error("Update Production Stage Error:", err)

    const message =
      err instanceof Error
        ? err.message
        : "Failed to update production stage"

    setError(message)

    throw err
  }
}

  return {
    projects,
    loading,
    error,
    refresh: loadProjects,
    changeStage,
  }
}
