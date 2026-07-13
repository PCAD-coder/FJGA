import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createClient();

  // Exchange the code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth Error:", error);

    return NextResponse.redirect(
      new URL("/login?error=oauth", request.url)
    );
  }

  // Let /auth/redirect decide where to send the user
  return NextResponse.redirect(
    new URL("/auth/redirect", request.url)
  );
}