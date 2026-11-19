"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CustomerOrder } from "../types/return";

interface Props {
  orders: CustomerOrder[];
  value: string;
  onChange: (value: string) => void;
}

export default function OrderSelector({
  orders,
  value,
  onChange,
}: Props) {
  const eligibleOrders = orders.filter((order) => order.eligible)

  return (
    <div className="space-y-2">
      <label className="font-medium">
        1. Select Order
      </label>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={eligibleOrders.length === 0}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              eligibleOrders.length === 0
                ? "No eligible orders"
                : "Choose an order"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {eligibleOrders.map((order) => (
            <SelectItem
              key={order.id}
              value={order.id}
            >
              {order.orderNumber} • {order.productName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {eligibleOrders.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You have no eligible orders to return. Orders can be returned within
          7 days of delivery.
        </p>
      )}
    </div>
  );
}
