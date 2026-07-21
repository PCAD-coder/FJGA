export interface MaterialPricing {
  id: string

  material_name: string

  category: string

  specification: string

  size: string

  unit: string

  stock_quantity: number

  minimum_stock: number

  unit_cost: number

  remarks: string | null

  created_at: string

  updated_at: string

  is_active: boolean

  markup_percentage: number | null

  selling_price: number
}

export interface LaborPricing {
  id: string;
  service_name: string;
  description: string | null;
  unit: string;

  labor_cost: number;
  markup_percentage: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;

  selling_price: number;
}

export interface PricingStats{
  totalMaterials: number

  totalServices: number

  averageMaterialMarkup: number

  averageLaborMarkup: number


}