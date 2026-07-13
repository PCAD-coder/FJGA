"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  "All",
  "Active",
  "Completed",
  "Approved",
  "Declined",
  "Cancelled",
];

export default function OrderFilterTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-3">

      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all",
            activeTab === tab
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {tab}

          <Badge variant="secondary">
            0
          </Badge>
        </button>
      ))}

    </div>
  );
}