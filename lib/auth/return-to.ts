// Accept local paths only. Reject URL forms that browsers could interpret as external.
export function getSafeReturnTo(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\x00-\x20\x7f]/.test(value)
  ) {
    return null
  }
  const url = new URL(value, "https://local.invalid")
  if (url.origin !== "https://local.invalid") return null
  // Returning to an authentication page can restart the login/redirect flow.
  if (/^\/(?:login|auth)(?:\/|$)/.test(url.pathname))
    return null
  return `${url.pathname}${url.search}${url.hash}`
}

export function getDashboardForRole(role: string | null | undefined) {
  if (role === "admin") return "/dashboard"
  if (role === "client") return "/client-dashboard"
  return null
}
