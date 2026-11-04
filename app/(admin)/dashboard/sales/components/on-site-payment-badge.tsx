import { Badge } from "@/components/ui/badge"
import type { OnSitePaymentStatus } from "../types/on-site-sales"

export function OnSitePaymentBadge({
  status,
}: {
  status: OnSitePaymentStatus | null
}) {
  if (status === "paid") return <Badge variant="default">Paid</Badge>
  if (status === "unpaid") return <Badge variant="destructive">Unpaid</Badge>
  return <Badge variant="outline">Not available</Badge>
}
