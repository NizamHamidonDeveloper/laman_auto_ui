"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  
  const menuItems = [
    { href: "/", label: "Dashboard" },
    { href: "/users", label: "Users Management" },
    { href: "/dealer_accounts", label: "Dealer Accounts" },
    { href: "/vehicles", label: "Vehicles" },
    { href: "/vehicle_colors", label: "Vehicle Colors" },
    { href: "/vehicle_inventory", label: "Inventory" },
    { href: "/loan_applications", label: "Loan Applications" },
  ];

  return (
    <div className="w-[20%] bg-white h-screen border-r border-gray-200 p-4">
      <div className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`p-3 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
} 