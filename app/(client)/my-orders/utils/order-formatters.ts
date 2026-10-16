export function formatOrderDimensions(
  width: number | null,
  height: number | null,
  depth: number | null,
  unit: string
): string | null {
  const dimensions = [width, height, depth].filter(
    (value): value is number => value !== null
  )

  if (dimensions.length === 0) {
    return null
  }

  return `${dimensions.join(" × ")} ${unit}`
}