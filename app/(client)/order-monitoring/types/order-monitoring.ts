export interface OrderSummary {
  pendingApproval: number

  inPreparation: number

  inFabrication: number

  ready: number
}

export interface ProductionStage {
  quotationApproved: boolean

  materialPrep: boolean

  fabrication: boolean

  ready: boolean
}

export interface MonitoredOrder {
  id: number

  orderNumber: string

  date: string

  productName: string

  deliveryAddress: string

  status:
    | "Quotation Approved"
    | "Material Prep"
    | "In Fabrication"
    | "Ready for Delivery"

  productionStage: ProductionStage

  canConfirm: boolean
}