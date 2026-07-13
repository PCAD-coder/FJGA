import { requireAdmin } from "@/lib/auth/require-admin";
import DashboardClient from "./DashboardAdmin";

export default async function DashboardPage() {
  const profile = await requireAdmin();

  return <DashboardClient profile={profile} />;
}