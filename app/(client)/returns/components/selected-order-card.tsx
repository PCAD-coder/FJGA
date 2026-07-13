import Image from "next/image";
import { BadgeCheck, ShieldCheck } from "lucide-react";

import { CustomerOrder } from "../types/return";

interface Props {
  order: CustomerOrder;
}

export default function SelectedOrderCard({
  order,
}: Props) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">

      <h3 className="font-semibold mb-4">
        Selected Order
      </h3>

      <div className="flex gap-4">

        <div className="relative h-20 w-20 overflow-hidden rounded-md border">

          <Image
            src={order.image ?? "/placeholder.png"}
            alt={order.productName}
            fill
            className="object-cover"
          />

        </div>

        <div className="flex-1 space-y-2">

          <p className="font-semibold">
            {order.productName}
          </p>

          <p className="text-sm text-muted-foreground">
            Order #: {order.orderNumber}
          </p>

          <p className="text-sm text-muted-foreground">
            Ordered: {order.orderDate}
          </p>

          <p className="text-sm text-muted-foreground">
            Delivered: {order.deliveredDate}
          </p>

          <div className="flex items-center gap-2">

            {order.eligible ? (
              <>
                <BadgeCheck className="h-4 w-4 text-green-600" />

                <span className="text-sm text-green-600">
                  Eligible for Return
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-red-600" />

                <span className="text-sm text-red-600">
                  Return Window Expired
                </span>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}