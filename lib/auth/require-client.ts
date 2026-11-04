import { redirect } from "next/navigation"
import { redirectToLogin } from "./redirect-to-login"
import { getUser } from "./get-user"
import { getProfile } from "./get-profile"

export async function requireClient() {
  // Check if the user is authenticated
  const { user } = await getUser()

  if (!user) {
    return await redirectToLogin()
  }

  // Get the user's profile
  const { profile, error } = await getProfile(user.id)

  if (error || !profile) {
    redirect("/auth/unauthorized")
  }

  // Check role
  if (profile.role !== "client") {
    redirect("/auth/unauthorized")
  }

  return profile
}
