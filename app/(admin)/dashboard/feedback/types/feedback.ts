export interface Feedback {
  id: number

  clientName: string

  orderNumber: string

  projectName: string

  rating: number

  comment: string

  submittedDate: string

  status:
    | "pending"
    | "published"
    | "archived"

  featured?: boolean
}