export interface ActivityLog {
  id: number

  userName: string

  role: string

  action: string

  module: string

  description: string

  timestamp: string

  severity:
    | "info"
    | "warning"
    | "critical"
}