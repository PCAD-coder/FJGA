export interface QuotationMaterialOption {
  id: string
  materialName: string
  category: string
  specification: string
  size: string
  unit: string

  stockQuantity: number
  unitCost: number
  markupPercentage: number

  color: string | null
  series: string | null
  thickness: string | null
}

export interface QuotationLaborOption {
  id: string
  serviceName: string
  description: string | null
  unit: string
  laborCost: number
  markupPercentage: number
}

export interface SelectedQuotationMaterial {
  materialId: string
  quantity: number
}

export interface SelectedQuotationLabor {
  serviceId: string
  quantity: number
}

export interface QuotationMaterialSnapshot {
  material_id: string
  material_name: string
  quantity: number
  unit: string

  unit_cost: number
  markup_percentage: number

  base_cost: number
  markup_amount: number
  subtotal: number

  color: string | null
  series: string | null
  thickness: string | null
}

export interface QuotationLaborSnapshot {
  service_id: string
  service_name: string
  quantity: number
  unit: string

  labor_cost: number
  markup_percentage: number

  base_cost: number
  markup_amount: number
  subtotal: number
}

export interface QuotationPricingResult {
  materials: QuotationMaterialSnapshot[]
  labor: QuotationLaborSnapshot[]

  materialSubtotal: number
  laborSubtotal: number
  markupAmount: number

  unitPrice: number
  lineTotal: number
}

export interface QuotationDetailMaterialSnapshot {
  material_id: string
  material_name: string
  quantity: number
  unit: string
  unit_cost: number
  markup_percentage: number
  base_cost: number
  markup_amount: number
  subtotal: number
  color: string | null
  series: string | null
  thickness: string | null
}

export interface QuotationDetailLaborSnapshot {
  service_id: string
  service_name: string
  quantity: number
  unit: string
  labor_cost: number
  markup_percentage: number
  base_cost: number
  markup_amount: number
  subtotal: number
}

export interface QuotationDetailItem {
  id: string
  itemNumber: number

  productId: string | null
  itemName: string
  details: string | null

  width: number | null
  height: number | null
  depth: number | null
  dimensionUnit: string | null

  quantity: number

  materialSubtotal: number
  laborSubtotal: number
  markupAmount: number

  unitPrice: number
  lineTotal: number

  materials: {
  materialName: string
  quantity: number
  unit: string
}[]

  materialsSnapshot: QuotationDetailMaterialSnapshot[]
  laborSnapshot: QuotationDetailLaborSnapshot[]
}

export interface QuotationDetail {
  id: string
  quotationNumber: string

  customerId: string
  clientName: string

  sourceType: "catalog" | "custom_request"
  customRequestId: string | null
  requestNumber: string | null

  projectName: string
  customerAddressSnapshot: string | null

  status: "draft" | "sent" | "accepted" | "declined"

subtotal: number
vatRate: number
vatAmount: number
deliveryFee: number
totalAmount: number

  notes: string | null

  createdAt: string
  sentAt: string | null
  acceptedAt: string | null
  declinedAt: string | null

  items: QuotationDetailItem[]
}