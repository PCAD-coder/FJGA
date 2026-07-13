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
  return (
    <div className="space-y-2">
      <label className="font-medium">
        1. Select Order
      </label>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose an order" />
        </SelectTrigger>

        <SelectContent>
          {orders.map((order) => (
            <SelectItem
              key={order.id}
              value={order.id}
            >
              {order.orderNumber} • {order.productName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}