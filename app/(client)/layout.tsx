import { requireClient } from "@/lib/auth/require-client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { DEFAULT_MAX_POSTPONED_STATE_SIZE } from "next/dist/server/config-shared"
import { cookies } from "next/headers"
import Navbar from "@/components/Navbar"
import { clientMenu } from "@/components/menus/client-menu"
export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireClient()
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full">
        <AppSidebar items={clientMenu} menuLabel="CLIENT MENU" />
        <main className="w-full flex-1">
          <div className="flex items-center gap-2 p-4">
            <SidebarTrigger />
            <Navbar />
          </div>

          <div className="w-full flex-1 px-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
