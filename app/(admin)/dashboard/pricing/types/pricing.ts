export interface MaterialPricing {
  id: number

  category: string

  material: string

  unit: string

  baseCost: number

  markupPercentage: number
}

export interface LaborService {
  id: number

  serviceType: string

  unit: string

  rate: number
}