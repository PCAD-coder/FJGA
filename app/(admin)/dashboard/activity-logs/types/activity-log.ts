export interface ActivityLog {
  id: number

  userId: string | null

  userName: string

  role: string

  action: string

  module: string

  description: string | null

  timestamp: string

  severity:
    | "info"
    | "warning"
    | "critical"
}