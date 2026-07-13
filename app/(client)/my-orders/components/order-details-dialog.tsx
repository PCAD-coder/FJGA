"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import OrderProductsTable from "./order-products-table";
import OrderPaymentSummary from "./order-payment-summary";
import OrderTimeline from "./order-timeline";

import { Order } from "../types/order";

interface Props {
  order: Order;
}

export default function OrderDetailsDialog({
  order,
}: Props) {
  return (
    <Dialog>

      <DialogTrigger asChild>

        <Button>

          View Details

        </Button>

      </DialogTrigger>

      <DialogContent className="max-w-5xl">

        <DialogHeader>

          <DialogTitle>

            {order.orderNumber}

          </DialogTitle>

        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="space-y-6">

            <OrderProductsTable
              products={[
                {
                  name: order.productName,
                  quantity: order.quantity,
                  price: order.total,
                },
              ]}
            />

            <OrderPaymentSummary
              total={order.total}
              paid={order.total}
            />

          </div>

          <OrderTimeline
            currentStage={order.currentStage}
          />

        </div>

      </DialogContent>

    </Dialog>
  );
}