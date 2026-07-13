export type DeliveryStatus =
  | "ready"
  | "scheduled"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"

export interface Delivery {
  id: number

  projectName: string

  clientName: string

  address: string

  deliveryDate: string

  deliveryTime: string

  assignedTruck: string

  assignedDriver: string

  productName: string

  deliveryFee: number

  status: DeliveryStatus
}