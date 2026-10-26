"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  year: number
  quarter: number | null
  month: number | null
  onYearChange: (year: number) => void
  onQuarterChange: (quarter: number | null) => void
  onMonthChange: (month: number | null) => void
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function getYearOptions() {
  const currentYear = new Date().getFullYear()

  return Array.from({ length: 5 }, (_, index) => currentYear - index)
}

const yearOptions = getYearOptions()

export default function AnalyticsFilter({
  year,
  quarter,
  month,
  onYearChange,
  onQuarterChange,
  onMonthChange,
}: Props) {
  const availableMonths =
    quarter === null
      ? MONTHS.map((label, index) => ({
          value: index + 1,
          label,
        }))
      : MONTHS.map((label, index) => ({
          value: index + 1,
          label,
        })).filter(({ value }) => {
          const startMonth = (quarter - 1) * 3 + 1
          const endMonth = startMonth + 2

          return value >= startMonth && value <= endMonth
        })

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={String(year)}
        onValueChange={(value) => onYearChange(Number(value))}
      >
        <SelectTrigger
          aria-label="Analytics year"
          className="h-9 w-[110px] rounded-lg bg-card shadow-none"
        >
          <SelectValue placeholder="Year" />
        </SelectTrigger>

        <SelectContent>
          {yearOptions.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={quarter === null ? "all" : String(quarter)}
        onValueChange={(value) =>
          onQuarterChange(value === "all" ? null : Number(value))
        }
      >
        <SelectTrigger
          aria-label="Analytics quarter"
          className="h-9 w-[130px] rounded-lg bg-card shadow-none"
        >
          <SelectValue placeholder="Quarter" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Quarters</SelectItem>
          <SelectItem value="1">Q1</SelectItem>
          <SelectItem value="2">Q2</SelectItem>
          <SelectItem value="3">Q3</SelectItem>
          <SelectItem value="4">Q4</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={month === null ? "all" : String(month)}
        onValueChange={(value) =>
          onMonthChange(value === "all" ? null : Number(value))
        }
      >
        <SelectTrigger
          aria-label="Analytics month"
          className="h-9 w-[150px] rounded-lg bg-card shadow-none"
        >
          <SelectValue placeholder="Month" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>

          {availableMonths.map((option) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}