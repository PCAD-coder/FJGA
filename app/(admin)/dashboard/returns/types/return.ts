export interface ReturnRequest {
  id: number

  orderNumber: string

  title: string

  clientName: string

  productType: string

  image: string

  issueDescription: string

  originalAmount: number

  reportedDate: string

  status:
    | "under-review"
    | "inspection-scheduled"
    | "approved"
    | "declined"
    | "resolved"

  declineReason?: string

  archived?: boolean
}