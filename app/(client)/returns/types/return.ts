export type ReturnStatus =
  | "Request Received"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Repair Processing"
  | "Repair Ready for Delivery"
  | "Repair Delivered"
  | "Replacement Processing"
  | "Replacement Ready for Delivery"
  | "Replacement Delivered";

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  productName: string;
  deliveredDate: string;
  orderDate: string;
  warrantyUntil: string;
  image?: string;
  eligible: boolean;
}

export interface TimelineEvent {
  status: ReturnStatus;
  date: string;
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  productName: string;
  issueType: string;
  description: string;
  submittedAt: string;
  currentStatus: ReturnStatus;
  timeline: TimelineEvent[];
}

export interface StatusTimelineStep {
  label: ReturnStatus;
  completed: boolean;
  current: boolean;
}