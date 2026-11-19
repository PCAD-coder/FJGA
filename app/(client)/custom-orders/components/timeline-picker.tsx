import { Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";

"use client"

function getToday() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export default function TimelinePicker() {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">

        Preferred Completion Date

      </label>

      <div className="relative">

        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          type="date"
          min={getToday()}
          className="pl-10"
        />

      </div>

    </div>
  );
}
