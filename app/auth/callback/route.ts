import { getSafeReturnTo } from "@/lib/auth/return-to"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const code = requestUrl.searchParams.get("code")
  const next = getSafeReturnTo(requestUrl.searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(
      new URL(
        next ? `/login?next=${encodeURIComponent(next)}` : "/login",
        request.url
      )
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Auth callback error:", error)

    return NextResponse.redirect(
      new URL(
        `/login?error=auth_callback${next ? `&next=${encodeURIComponent(next)}` : ""}`,
        request.url
      )
    )
  }

  // Password recovery has its own destination; all other logins use the role flow.
  const destination =
    next === "/reset-password"
      ? next
      : next
        ? `/auth/redirect?next=${encodeURIComponent(next)}`
        : "/auth/redirect"

  return NextResponse.redirect(new URL(destination, request.url))
}
