import { createClient } from "@/lib/supabase/client";

import {
  LaborPricing,
  MaterialPricing,
} from "../types/pricing";

const supabase = createClient();

/* -------------------------------- */
/* Material Pricing */
/* -------------------------------- */

export async function getMaterialPricing(): Promise<
  MaterialPricing[]
> {
  const { data, error } = await supabase
    .from("inventory_materials")
    .select("*")
    .eq("is_active", true)
    .order("material_name");

  if (error) throw error;

  return (data ?? []).map((material) => ({
    ...material,

    selling_price:
      (material.unit_cost ?? 0) *
      (1 + (material.markup_percentage ?? 0) / 100),
  }));
}

export async function updateMaterialPricing(
  id: string,
  values: {
    unit_cost?: number | null;
    markup_percentage?: number | null;
  }
) {
  const { error } = await supabase
    .from("inventory_materials")
    .update(values)
    .eq("id", id);

  if (error) throw error;
}

/* -------------------------------- */
/* Labor Pricing */
/* -------------------------------- */

export async function createLaborService(values: {
  service_name: string;
  description?: string | null;
  unit: string;
  labor_cost: number;
  markup_percentage: number;
}) {
  const { error } = await supabase
    .from("labor_services")
    .insert(values);
    

  if (error) throw error;
}

export async function getLaborPricing(): Promise<
  LaborPricing[]
> {
  const { data, error } = await supabase
    .from("labor_services")
    .select("*")
    .eq("is_active", true)
    .order("service_name");

  if (error) throw error;

  return (data ?? []).map((service) => ({
    ...service,

    selling_price:
      (service.labor_cost ?? 0) *
      (1 + (service.markup_percentage ?? 0) / 100),
  }));
}

export async function updateLaborPricing(
  id: string,
  values: {
    labor_cost?: number;
    markup_percentage?: number;
  }
) {
  const { error } = await supabase
    .from("labor_services")
    .update(values)
    .eq("id", id);

  if (error) throw error;
}

export async function archiveLaborService(id: string) {
  const { error } = await supabase
    .from("labor_services")
    .update({
      is_active: false,
    })
    .eq("id", id);

  if (error) throw error;
}