import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DEFAULT_MAX_POSTPONED_STATE_SIZE } from "next/dist/server/config-shared"
import { cookies } from "next/headers"
import Navbar from "@/components/Navbar"
export default async function Layout({ children }: { children: React.ReactNode }) {

const cookieStore = await cookies()
const defaultOpen = cookieStore.get("sidebar_state")?.value ==="true"

  return (
    
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-4 flex items-center gap-2">
            <SidebarTrigger />
            <Navbar />
          </div>

          <div className="flex-1 px-4">
            {children}
          </div>
        </main>

      </div>
    </SidebarProvider>
  )
}