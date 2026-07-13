import { PackageOpen } from "lucide-react";

export default function EmptyOrders() {
  return (
    <div className="rounded-xl border border-dashed p-16 text-center">

      <PackageOpen className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

      <h2 className="text-xl font-semibold">

        No Orders Found

      </h2>

      <p className="mt-2 text-muted-foreground">

        Your orders will appear here once you place one.

      </p>

    </div>
  );
}