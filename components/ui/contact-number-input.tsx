"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

export function ContactNumberInput({
  require09Prefix = false,
  value,
  onChange,
  onBlur,
  required,
  "aria-describedby": describedBy,
  ...props
}: React.ComponentProps<typeof Input> & { require09Prefix?: boolean }) {
  const warningId = React.useId()
  const [touched, setTouched] = React.useState(false)
  const number = String(value ?? "")
  const contactPattern = require09Prefix ? "09[0-9]{9}" : "[0-9]{11}"
  const invalid =
    (number.length > 0 || (touched && required)) &&
    !new RegExp(`^${contactPattern}$`).test(number)

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
        pattern={contactPattern}
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
          if (require09Prefix && !/^(?:0(?:9[0-9]{0,9})?)?$/.test(event.target.value)) {
            event.target.value = number
            return
          }
          onChange?.(event)
        }}
        onBlur={(event) => {
          setTouched(true)
          onBlur?.(event)
        }}
      />
      {invalid && (
        <p id={warningId} role="status" className="text-xs text-destructive">
          {require09Prefix
            ? "Contact number must start with 09 and contain exactly 11 digits."
            : "Contact number must contain exactly 11 digits."}
        </p>
      )}
    </>
  )
}
