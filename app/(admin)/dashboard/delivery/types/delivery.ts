export type DeliveryStatus =
  | "scheduled"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"

export interface Delivery {
  id: string
  orderId: string

  orderNumber: string

  projectName: string
  clientName: string

  address: string

  deliveryDate: string | null
  deliveryTime: string | null

  assignedTruck: string | null
  assignedDriver: string | null

  productName: string

  deliveryFee: number

  totalAmount: number
amountPaid: number
remainingBalance: number

  status: DeliveryStatus

  deliveredAt: string | null
  deliveryNotes: string | null
}
export interface DeliveryOrderItem {
  id: string
  productName: string
  quantity: number
}

export interface DeliveryCustomer {
  id: string
  firstName: string | null
  lastName: string | null
}

export interface DeliveryAddress {
  houseBuildingNumber: string
  street: string
  buildingSubdivision: string | null
  unitFloor: string | null
  regionName: string
  provinceName: string | null
  cityName: string
  barangayName: string
  postalCode: string | null
  landmark: string | null
}

export interface DeliveryDetails {
  id: string
  orderId: string
  orderNumber: string

  status: DeliveryStatus

  scheduledDate: string | null
  scheduledTime: string | null

  assignedDriver: string | null
  assignedTruck: string | null

  deliveredAt: string | null
  deliveryNotes: string | null

  deliveryFee: number

  customer: DeliveryCustomer | null
  address: DeliveryAddress | null
  items: DeliveryOrderItem[]
}
