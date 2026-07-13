export type OrderStatus =
  | "Pending Payment"
  | "Quotation"
  | "Production"
  | "Ready for Delivery"
  | "Out for Delivery"
  | "Completed"
  | "Approved"
  | "Declined"
  | "Cancelled";

export interface OrderProgress {
  quotation: boolean;
  production: boolean;
  delivery: boolean;
  completed: boolean;
}

export interface Order {
  id: string;

  orderNumber: string;

  productName: string;

  image: string;

  madeToOrder: boolean;

  quantity: number;

  width: number;

  height: number;

  aluminumSeries: string;

  glassType: string;

  orderedAt: string;

  estimatedDelivery: string;

  total: number;

  currentStage: string;

  progressPercentage: number;

  status: OrderStatus;

  progress: OrderProgress;
}