import { Badge } from "@/components/ui/badge"

import { UserStatus } from "../../types/user-management"

interface Props {
  status: UserStatus
}

export default function StatusBadge({ status }: Props) {
  return (
    <Badge
      variant={status === "Active" ? "default" : "outline"}
    >
      {status}
    </Badge>
  )
}