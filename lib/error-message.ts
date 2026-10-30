/** Preserve useful messages from both JavaScript and database errors. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") return error.trim() || fallback
  if (!error || typeof error !== "object") return fallback

  const { message, details } = error as { message?: unknown; details?: unknown }
  const parts = [message, details]
    .filter((part): part is string => typeof part === "string" && !!part.trim())
    .map((part) => part.trim())

  return [...new Set(parts)].join(" ") || fallback
}
