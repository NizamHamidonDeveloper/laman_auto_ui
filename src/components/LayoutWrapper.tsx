'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface LayoutWrapperProps {
  children: React.ReactNode;
  user: any;
}

export function LayoutWrapper({ children, user }: LayoutWrapperProps) {
  const pathname = usePathname();
  const showSidebar = user && (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/dealer_accounts') ||
    pathname.startsWith('/vehicles') ||
    pathname.startsWith('/vehicle_colors') ||
    pathname.startsWith('/vehicle_inventory') ||
    pathname.startsWith('/loan_applications')
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
} 