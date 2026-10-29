"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarModuleLinkProps {
  href: string;
  title: string;
  moduleUrls: string[];
  children: ReactNode;
}

export function SidebarModuleLink({
  href,
  title,
  moduleUrls,
  children,
}: SidebarModuleLinkProps) {
  const pathname = usePathname();
  const activeUrl = moduleUrls
    .filter((url) => pathname === url || pathname.startsWith(`${url}/`))
    .sort((a, b) => b.length - a.length)[0];
  const isActive = activeUrl === href;

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={title}
      className="data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:font-semibold data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground"
    >
      <Link href={href} aria-current={isActive ? "page" : undefined}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
}
