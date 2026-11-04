import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/auth/get-user"
import { getProfile } from "@/lib/auth/get-profile"
import { getDashboardForRole } from "@/lib/auth/return-to"

export default async function UnauthorizedPage() {
  const { user } = await getUser()
  if (!user) redirect("/login")

  const { profile } = await getProfile(user.id)
  const dashboard = getDashboardForRole(profile?.role)

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Button asChild>
          <Link href={dashboard ?? "/"}>
            {dashboard ? "Return to Dashboard" : "Return Home"}
          </Link>
        </Button>
      </div>
    </div>
  )
}
