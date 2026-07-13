import { getUser } from "@/lib/auth/get-user";
import { getProfile } from "@/lib/auth/get-profile";
import { redirectByRole } from "@/lib/auth/redirect-by-role";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  // Get authenticated user
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile
  const { profile } = await getProfile(user.id);

  if (!profile) {
    redirect("/auth/unauthorized");
  }

  // Redirect based on role
  redirectByRole(profile.role);

  return null;
}