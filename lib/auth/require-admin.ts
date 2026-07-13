import { redirect } from "next/navigation";
import { getUser } from "./get-user";
import { getProfile } from "./get-profile";

export async function requireAdmin() {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { profile, error } = await getProfile(user.id);

  if (error || !profile) {
    redirect("/auth/unauthorized");
  }

  if (profile.role !== "admin") {
    redirect("/auth/unauthorized");
  }

  return profile;
}