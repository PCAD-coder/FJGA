"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getProductionProjects,
  updateProductionStage,
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

      const data = await getProductionProjects()
      setProjects(data)
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
    notes?: string
  ) => {
    try {
      await updateProductionStage(projectId, stage, notes)
      await loadProjects()
    } catch (err: unknown) {
      console.error("Update Production Stage Error:", err)

      const message = err instanceof Error
      ?err.message
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
