"use client"

import { useEffect, useState } from "react"

import {
  getSeries,
  MaterialSeries,
} from "../services/series.service"

export function useSeries() {
  const [series, setSeries] =
    useState<MaterialSeries[]>([])

  async function loadSeries() {
    const data = await getSeries()

    setSeries(data)
  }

  useEffect(() => {
    loadSeries()
  }, [])

  return {
    series,
    refresh: loadSeries,
  }
}