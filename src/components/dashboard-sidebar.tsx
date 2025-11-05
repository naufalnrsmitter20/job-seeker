"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, Briefcase, Building2, ChevronDown, LayoutDashboard, LayoutPanelLeft, LogOut, User, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { UserAvatarProfile } from "./user-avatar-profile";
import { signOut, useSession } from "next-auth/react";

const adminItems = [
  { title: "Ringkasan", href: "/admin", icon: LayoutDashboard },
  { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { title: "Applications", href: "/admin/applications", icon: LayoutPanelLeft },
  { title: "Companies", href: "/admin/companies", icon: Building2 },
  { title: "Users", href: "/admin/users", icon: Users },
];
const hrdItems = [
  { title: "Ringkasan", href: "/hrd", icon: LayoutDashboard },
  { title: "Jobs", href: "/hrd/jobs", icon: Briefcase },
  { title: "Applications", href: "/hrd/applications", icon: LayoutPanelLeft },
  { title: "Company Profile", href: "/hrd/company-profile", icon: Building2 },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader>
          <div className="px-3 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">JS</div>
              <div className="leading-tight">
                <div className="font-semibold text-blue-900">Job Seeker</div>
                <div className="text-xs text-blue-600">Dashboard</div>
              </div>
            </Link>
          </div>
          <Separator />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {session?.user?.role === "ADMIN" &&
                  adminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                {session?.user?.role === "HRD" &&
                  hrdItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    {user && <UserAvatarProfile className="h-8 w-8 rounded-lg" showInfo user={user} />}
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="px-1 py-1.5">{user && <UserAvatarProfile className="h-8 w-8 rounded-lg" showInfo user={user} />}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-red-500 hover:text-white">
                    <LogOut className="mr-2 h-4 w-4 group-hover:text-white" />
                    <button
                      type="button"
                      className="w-full text-start"
                      onClick={() =>
                        signOut({
                          callbackUrl: "/login",
                          redirect: true,
                        })
                      }
                    >
                      Log Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="text-sm text-gray-500">JobSeeker Indonesia • {session?.user?.role === "ADMIN" ? "Admin" : "HRD"}</div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
