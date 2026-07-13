import { Badge } from "@/components/ui/badge";

import { OrderStatus } from "../types/order";

interface Props {
  status: OrderStatus;
}

export default function OrderStatusBadge({
  status,
}: Props) {

  const variant = {
    Production: "bg-blue-100 text-blue-700",
    Approved: "bg-green-100 text-green-700",
    Completed: "bg-green-100 text-green-700",
    Declined: "bg-red-100 text-red-700",
    Cancelled: "bg-gray-100 text-gray-700",
    Quotation: "bg-yellow-100 text-yellow-700",
    "Pending Payment": "bg-orange-100 text-orange-700",
    "Ready for Delivery": "bg-purple-100 text-purple-700",
    "Out for Delivery": "bg-cyan-100 text-cyan-700",
  };

  return (
    <Badge className={variant[status]}>
      {status}
    </Badge>
  );
}