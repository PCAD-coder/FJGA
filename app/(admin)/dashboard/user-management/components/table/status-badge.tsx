import { Badge } from "@/components/ui/badge"

import { UserStatus } from "../../types/user-management"

interface Props {
  status: UserStatus
}

export default function StatusBadge({ status }: Props) {
  return (
    <Badge
      className="rounded-full px-2.5 py-1 text-xs font-medium"
      variant={status === "Active" ? "default" : "outline"}
    >
      {status}
    </Badge>
  )
}
