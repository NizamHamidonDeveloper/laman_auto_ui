"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Users, Car, Palette, ClipboardList, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Users Management", url: "/users", icon: Users },
  { title: "Dealer Accounts", url: "/dealer_accounts", icon: Users },
  { title: "Vehicles", url: "/vehicles", icon: Car },
  { title: "Vehicle Colors", url: "/vehicle_colors", icon: Palette },
  { title: "Inventory", url: "/vehicle_inventory", icon: ClipboardList },
  { title: "Loan Applications", url: "/loan_applications", icon: FileText },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar className="w-[250px] shrink-0">
      <SidebarContent>
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-lg font-semibold">Laman Auto</h2>
          <ThemeToggle />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
} 