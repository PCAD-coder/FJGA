import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (!code) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    )
  }

  const supabase = await createClient()

  const { error } =
    await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Auth callback error:", error)

    return NextResponse.redirect(
      new URL("/login?error=auth_callback", request.url)
    )
  }

  // Only allow internal paths.
  if (
    next &&
    next.startsWith("/") &&
    !next.startsWith("//")
  ) {
    return NextResponse.redirect(
      new URL(next, request.url)
    )
  }

  return NextResponse.redirect(
    new URL("/auth/redirect", request.url)
  )
}