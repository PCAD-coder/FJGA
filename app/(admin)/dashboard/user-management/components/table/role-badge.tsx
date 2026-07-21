import { Badge } from "@/components/ui/badge"

import { UserRole } from "../../types/user-management"

interface Props {
  role: UserRole
}
const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  client: "Client",
}

export default function RoleBadge({ role }: Props) {
  return (
    <Badge
      variant={role === "admin" ? "default" : "secondary"}
    >
      {roleLabels[role]}
    </Badge>
  )
}