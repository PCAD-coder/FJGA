import { getSafeReturnTo } from "@/lib/auth/return-to"
import { getUser } from "@/lib/auth/get-user"
import { getProfile } from "@/lib/auth/get-profile"
import { redirectByRole } from "@/lib/auth/redirect-by-role"
import { redirect } from "next/navigation"

export default async function AuthRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const next = getSafeReturnTo((await searchParams).next)
  // Get authenticated user
  const { user } = await getUser()

  if (!user) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login")
  }

  // Get profile
  const { profile } = await getProfile(user.id)

  if (!profile) {
    redirect("/auth/unauthorized")
  }

  // Protected route layouts still enforce the account's role on the destination.
  if (next && (profile.role === "admin" || profile.role === "client")) {
    redirect(next)
  }
  redirectByRole(profile.role)

  return null
}
