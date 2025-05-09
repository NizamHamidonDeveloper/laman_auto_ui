"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const menuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/users", label: "Users Management" },
    { href: "/dealer_accounts", label: "Dealer Accounts" },
    { href: "/vehicles", label: "Vehicles" },
    { href: "/vehicle_colors", label: "Vehicle Colors" },
    { href: "/vehicle_inventory", label: "Inventory" },
    { href: "/loan_applications", label: "Loan Applications" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Laman Auto</h1>
        <ThemeToggle />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`p-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
} 