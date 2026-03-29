// src/app/(admin)/admin/_components/adminAppSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavMain } from "@/lib/admin/nav";
import { siteName } from "@/lib/site-config";
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
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function AdminAppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-none px-2 py-1 font-heading text-sm font-bold tracking-tight text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {siteName.toUpperCase()}
          <span className="text-[10px] font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavMain.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="px-2 py-3 text-xs text-sidebar-foreground/60">
        <Link href="/" className="hover:text-sidebar-foreground hover:underline">
          Về trang chủ
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
