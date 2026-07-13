"use client";

import { useMemo, useState } from "react";

import {
  ClipboardList,
  Package,
  CheckCircle2,
  PhilippinePeso,
} from "lucide-react";

import OrderSummaryCard from "./components/order-summary-card";
import OrderFilterTabs from "./components/order-filter-tabs";
import OrderToolbar from "./components/order-toolbar";
import OrderCard from "./components/order-card";
import EmptyOrders from "./components/empty-orders";

import { orders } from "./data/my-orders-data";

export default function MyOrdersPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.productName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.orderNumber
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesTab =
        tab === "All" ||
        (tab === "Active" &&
          !["Completed", "Cancelled", "Declined"].includes(order.status)) ||
        order.status === tab;

      return matchesSearch && matchesTab;
    });
  }, [tab, search]);

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        <p className="text-muted-foreground">
          Manage and monitor all of your furniture orders.
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <OrderSummaryCard
          title="Total Orders"
          value={orders.length}
          icon={ClipboardList}
          color="bg-blue-100"
        />

        <OrderSummaryCard
          title="Active"
          value={
            orders.filter(
              (o) =>
                !["Completed", "Cancelled", "Declined"].includes(o.status)
            ).length
          }
          icon={Package}
          color="bg-yellow-100"
        />

        <OrderSummaryCard
          title="Completed"
          value={
            orders.filter(
              (o) => o.status === "Completed"
            ).length
          }
          icon={CheckCircle2}
          color="bg-green-100"
        />

        <OrderSummaryCard
          title="Total Spent"
          value={`₱${orders
            .reduce((sum, o) => sum + o.total, 0)
            .toLocaleString()}`}
          icon={PhilippinePeso}
          color="bg-purple-100"
        />

      </div>

      <OrderFilterTabs
        activeTab={tab}
        onChange={setTab}
      />

      <OrderToolbar
        search={search}
        onSearch={setSearch}
      />

      <div className="space-y-5">

        {filteredOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))
        )}

      </div>

    </div>
  );
}