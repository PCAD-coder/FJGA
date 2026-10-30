"use client"

import type { ComponentProps } from "react"
import { Input } from "@/components/ui/input"

export function WholeNumberInput({ onChange, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      pattern="[0-9]+"
      onChange={(event) => {
        if (/^\d*$/.test(event.target.value)) onChange?.(event)
      }}
    />
  )
}
