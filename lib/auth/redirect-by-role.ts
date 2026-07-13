import { redirect } from "next/navigation";

export function redirectByRole(role: string) {
  switch (role) {
    case "admin":
      redirect("/dashboard");

    case "client":
      redirect("/client-dashboard");

    default:
      redirect("/auth/unauthorized");
  }
}