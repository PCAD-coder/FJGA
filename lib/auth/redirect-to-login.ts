import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getSafeReturnTo } from "./return-to"

export async function redirectToLogin(): Promise<never> {
  const requestHeaders = await headers()
  const next = getSafeReturnTo(requestHeaders.get("x-auth-return-to"))
  redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login")
}
