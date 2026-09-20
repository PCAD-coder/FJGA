"use client";

import { useCallback, useEffect, useState } from "react";

import ReturnHeader from "./return-header";
import ReturnRequestForm from "./return-request-form";
import ReturnPolicy from "./return-policy";
import HelpCard from "./help-card";
import RequestStatusList from "./request-status-list";

import { getReturnPageData } from "../services/return-service";

import type {
  CustomerOrder,
  ReturnRequest,
} from "../types/return";

export default function Returns() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [requests, setRequests] = useState<ReturnRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReturns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getReturnPageData();

      setOrders(data.orders);
      setRequests(data.requests);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load return information"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  if (loading) {
    return (
      <div className="space-y-8">
        <ReturnHeader />

        <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">
          <p className="text-sm text-muted-foreground">
            Loading returns...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <ReturnHeader />

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load returns
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ReturnHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReturnRequestForm
            orders={orders}
            onSubmitted={loadReturns}
          />
        </div>

        <div className="space-y-6">
          <ReturnPolicy />
          <HelpCard />
        </div>
      </div>

      <RequestStatusList requests={requests} />
    </div>
  );
}