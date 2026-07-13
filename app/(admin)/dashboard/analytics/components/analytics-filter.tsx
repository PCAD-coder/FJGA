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

  onChange: (
    value: string
  ) => void
}

export default function AnalyticsFilter({
  value,
  onChange,
}: Props) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px]">

        <SelectValue placeholder="Select Period" />

      </SelectTrigger>

      <SelectContent>

        <SelectItem value="monthly">
          Monthly
        </SelectItem>

        <SelectItem value="quarterly">
          Quarterly
        </SelectItem>

        <SelectItem value="yearly">
          Yearly
        </SelectItem>

      </SelectContent>

    </Select>
  )
}