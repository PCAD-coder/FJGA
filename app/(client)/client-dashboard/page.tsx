import { requireClient } from "@/lib/auth/require-client";
import ClientDashboard from "./ClientDashboard";

export default async function ClientDashboardPage() {
  const profile = await requireClient();

  return <ClientDashboard profile={profile} />;
}