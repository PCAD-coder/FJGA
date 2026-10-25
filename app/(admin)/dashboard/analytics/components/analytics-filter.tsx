"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  value: string

  onChange: (value: string) => void
}

export default function AnalyticsFilter({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label="Analytics period"
        className="h-9 w-[160px] rounded-lg bg-card shadow-none"
      >
        <SelectValue placeholder="Select Period" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="monthly">Monthly</SelectItem>

        <SelectItem value="quarterly">Quarterly</SelectItem>

        <SelectItem value="yearly">Yearly</SelectItem>
      </SelectContent>
    </Select>
  )
}
