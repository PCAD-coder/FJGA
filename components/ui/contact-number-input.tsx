"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

export function ContactNumberInput({
  value,
  onChange,
  onBlur,
  required,
  "aria-describedby": describedBy,
  ...props
}: React.ComponentProps<typeof Input>) {
  const warningId = React.useId()
  const [touched, setTouched] = React.useState(false)
  const number = String(value ?? "")
  const invalid =
    (number.length > 0 || (touched && required)) &&
    !/^[0-9]{11}$/.test(number)

  return (
    <>
      <Input
        {...props}
        value={value}
        required={required}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={11}
        minLength={11}
        pattern="[0-9]{11}"
        aria-invalid={invalid || undefined}
        aria-describedby={
          [describedBy, invalid ? warningId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        onChange={(event) => {
          event.target.value = event.target.value
            .replace(/[^0-9]/g, "")
            .slice(0, 11)
          onChange?.(event)
        }}
        onBlur={(event) => {
          setTouched(true)
          onBlur?.(event)
        }}
      />
      {invalid && (
        <p id={warningId} role="status" className="text-xs text-destructive">
          Contact number must contain exactly 11 digits.
        </p>
      )}
    </>
  )
}
