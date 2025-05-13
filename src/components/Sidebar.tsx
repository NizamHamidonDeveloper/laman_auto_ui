"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Car,
  Users,
  Building2,
  FileText,
  Palette,
  Image as ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const sidebarItems = [
  {
    title: "Vehicles",
    items: [
      {
        title: "Vehicles",
        href: "/vehicles",
        icon: Car,
      },
      {
        title: "Vehicle Colors",
        href: "/vehicle-colors",
        icon: Palette,
      },
      {
        title: "Vehicle Inventory",
        href: "/vehicle-inventory",
        icon: Car,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/users",
        icon: Users,
      },
      {
        title: "Dealers",
        href: "/dealers",
        icon: Building2,
      },
      {
        title: "Loan Applications",
        href: "/loan-applications",
        icon: FileText,
      },
    ],
  },
  {
    title: "Landing Page",
    items: [
      {
        title: "Customize Images",
        href: "/landing-customization",
        icon: ImageIcon,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Auto UI</h1>
      </div>

      <nav className="flex-1 px-4 space-y-6">
        {sidebarItems.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2">
              {group.title}
            </h2>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
          <Link
            key={item.href}
            href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
          >
                    <Icon className="h-4 w-4" />
                    {item.title}
          </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
} 