// Allow empty drafts while preventing invalid typed or pasted values.
export function isValidNumericInput(
  value: string,
  maximum: number,
  decimals = 0
) {
  const pattern =
    decimals === 0 ? /^\d*$/ : new RegExp(`^\\d*(?:\\.\\d{0,${decimals}})?$`)
  return pattern.test(value) && (value === "" || Number(value) <= maximum)
}
