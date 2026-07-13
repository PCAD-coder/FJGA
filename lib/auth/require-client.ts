import { redirect } from "next/navigation";
import { getUser } from "./get-user";
import { getProfile } from "./get-profile";

export async function requireClient() {
  // Check if the user is authenticated
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Get the user's profile
  const { profile, error } = await getProfile(user.id);

  if (error || !profile) {
    redirect("/auth/unauthorized");
  }

  // Check role
  if (profile.role !== "client") {
    redirect("/auth/unauthorized");
  }

  return profile;
}