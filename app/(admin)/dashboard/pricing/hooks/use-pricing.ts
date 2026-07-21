"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getLaborPricing,
  getMaterialPricing,
} from "../services/pricing-service";

import {
  LaborPricing,
  MaterialPricing,
  PricingStats,
} from "../types/pricing";

export function usePricing() {
  const [materials, setMaterials] = useState<MaterialPricing[]>([]);
  const [laborServices, setLaborServices] = useState<LaborPricing[]>([]);

  const [loading, setLoading] = useState(true);

  const loadPricing = useCallback(async () => {
    try {
      setLoading(true);

      const [materialData, laborData] =
        await Promise.all([
          getMaterialPricing(),
          getLaborPricing(),
        ]);

      setMaterials(materialData);
      setLaborServices(laborData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPricing();
  }, [loadPricing]);

  const stats: PricingStats = {
    totalMaterials: materials.length,

    totalServices: laborServices.length,

    averageMaterialMarkup:
      materials.length === 0
        ? 0
        : materials.reduce(
            (sum, material) =>
              sum + (material.markup_percentage ?? 0),
            0
          ) / materials.length,

    averageLaborMarkup:
      laborServices.length === 0
        ? 0
        : laborServices.reduce(
            (sum, service) =>
              sum + (service.markup_percentage ?? 0),
            0
          ) / laborServices.length,
  };

  return {
    materials,
    laborServices,

    stats,

    loading,

    refresh: loadPricing,
  };
}