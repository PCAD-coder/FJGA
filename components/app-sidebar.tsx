import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import { Home, Inbox, Calendar, Search, User2, ChevronUp, ShoppingBasket, ShoppingBasketIcon, Box, ClipboardList, Truck, RefreshCw, RefreshCcw, ShoppingCart, FolderPen, Tag, ChartNoAxesCombined, BanknoteX, CloudBackup, ClipboardClock, UserPen, ShelvingUnit, ListTodo, Send, User, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
const items =[
    {
        title: "Dashboard",
        url:"/dashboard",
        icon: Home,
    },{
        title: "Client Management",
        url:"/dashboard/client-management",
        icon: UserPen,
    },{
        title: "Products",
        url:"/dashboard/products",
        icon: ShelvingUnit,
    },{
        title: "Inventory",
        url:"/dashboard/inventorym",
        icon: Box,
    },{
        title: "Custom Orders",
        url:"/dashboard/custom-orders",
        icon: ClipboardList,
    },{
        title: "Pricing",
        url:"/dashboard/pricing",
        icon: Tag,
    },{
        title: "Production",
        url:"/dashboard/production",
        icon: ListTodo,
    },{
        title: "Returns",
        url:"/dashboard/returns",
        icon: BanknoteX,
    },{
        title: "Content",
        url:"/dashboard/contentm",
        icon: FolderPen,
    },{
        title: "Feedback",
        url:"/dashboard/feedback",
        icon: Send,
    },{
        title: "Analytics",
        url:"/dashboard/analytics",
        icon: ChartNoAxesCombined,
    },{
        title: "Activity Logs",
        url:"/dashboard/activity-logs",
        icon: ClipboardClock,
    },{
        title: "Backup and Restore",
        url:"/dashboard/backup-and-restore",
        icon: CloudBackup,
    },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
            <Link href = "/">
            <Image src= "/logo1.png" alt = "logo" width={20} height={20}/>
            <span>FJ GLASS AND ALUMINUM</span>
            </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      </SidebarHeader>
        <div className="px-2">
            <SidebarSeparator />
        </div>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>ADMIN MENU</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>{items.map(items=>(
                <SidebarMenuItem key = {items.title}>
                    <SidebarMenuButton asChild>
                        <Link href={items.url} className="flex items-center gap-2">
                        <items.icon className="w-4 h-4" />
                        <span>{items.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="w-full">
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="w-full flex items-center">
                            <Avatar className ="w-6 h-6">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="flex-1 text-left">USER NAME</span>
                            <ChevronUp className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="top" className="w-fit min-w-0">
                        <DropdownMenuItem className = "flex items-center gap-2">
                            <User className = "w-4 h-4"/>
                            Account 
                            </DropdownMenuItem>
                        <DropdownMenuItem className = "flex items-center gap-2">
                            <Settings className = "w-4 h-4"/>
                            Settings
                            </DropdownMenuItem>
                        <DropdownMenuItem variant= "destructive" className = "flex items-center gap-2">
                            <LogOut className= "w-4 h-4"/>
                            Sign Out
                            </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}