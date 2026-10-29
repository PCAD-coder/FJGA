import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/auth/get-user";
import { SignOutMenuItem } from "./sign-out-menu-item";
import { SidebarModuleLink } from "./sidebar-module-link";

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
} from "@/components/ui/sidebar";

import {
  ChevronUp,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface AppSidebarProps {
  items: SidebarItem[];
  menuLabel: string;
  profile: {
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    profile_image?: string | null;
  };
}

export async function AppSidebar({
  items,
  menuLabel,
  profile,
}: AppSidebarProps) {
  const { user } = await getUser();
  const metadata = user?.user_metadata;
  const avatarUrl = [
    metadata?.avatar_url,
    metadata?.picture,
    profile.profile_image,
  ].find((value): value is string => typeof value === "string" && !!value.trim());

  const userName =
    [profile.first_name?.trim(), profile.last_name?.trim()]
      .filter(Boolean)
      .join(" ") ||
    profile.full_name?.trim() ||
    "User";
  const initials = userName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image
                  src="/logo1.png"
                  alt="logo"
                  width={20}
                  height={20}
                />
                <span>FJ GLASS AND ALUMINUM</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="px-2">
        <SidebarSeparator />
      </div>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{menuLabel}</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarModuleLink
                    href={item.url}
                    title={item.title}
                    moduleUrls={items.map((module) => module.url)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarModuleLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full flex items-center">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  <span className="flex-1 text-left">
                    {userName}
                  </span>

                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="top"
                className="w-fit min-w-0"
              >
                <SignOutMenuItem />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
