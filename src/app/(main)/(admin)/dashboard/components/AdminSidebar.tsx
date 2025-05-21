'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Car,
  Building2,
  Tag,
  Package,
  Percent,
  Gift,
  Palette,
  FileText,
  Settings,
  Layout,
} from 'lucide-react';

const routes = [
  {
    label: 'User Management',
    icon: Users,
    href: '/dashboard/user-management',
    color: 'text-sky-500',
  },
  {
    label: 'Vehicle Management',
    icon: Car,
    href: '/dashboard/vehicle-management',
    color: 'text-violet-500',
  },
  {
    label: 'Dealer Management',
    icon: Building2,
    href: '/dashboard/dealer-management',
    color: 'text-pink-700',
  },
  {
    label: 'Brand Management',
    icon: Tag,
    href: '/dashboard/brand-management',
    color: 'text-orange-700',
  },
  {
    label: 'Vehicle Inventory',
    icon: Package,
    href: '/dashboard/vehicle-inventory',
    color: 'text-emerald-500',
  },
  {
    label: 'Vehicle Commission',
    icon: Percent,
    href: '/dashboard/vehicle-commission',
    color: 'text-blue-700',
  },
  {
    label: 'Vehicle Offer',
    icon: Gift,
    href: '/dashboard/vehicle-offer',
    color: 'text-red-700',
  },
  {
    label: 'Vehicle Color',
    icon: Palette,
    href: '/dashboard/vehicle-color',
    color: 'text-yellow-700',
  },
  {
    label: 'Loan Applications',
    icon: FileText,
    href: '/dashboard/loan-applications',
    color: 'text-green-700',
  },
];

const settingsRoutes = [
  {
    label: 'Layout Settings',
    icon: Layout,
    href: '/dashboard/settings/layout',
    color: 'text-purple-500',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#111827] text-white p-4">
      <div className="space-y-4">
        <Link href="/dashboard" className="flex items-center mb-8">
          <h1 className="text-2xl font-bold">
            Laman Auto
          </h1>
        </Link>
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400',
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center px-3 mb-2">
            <Settings className="h-5 w-5 mr-3 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-400">Settings</h2>
          </div>
          <nav className="space-y-1">
            {settingsRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                  pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400',
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
} 