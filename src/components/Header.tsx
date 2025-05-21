'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user role from the users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!error && userData) {
          setUserRole(userData.role);
        }
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (!error && userData) {
          setUserRole(userData.role);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          Laman Auto
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {userRole === 'admin' ? (
                  <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                    Dashboard
                  </Button>
                ) : userRole === 'user' ? (
                  <Button variant="ghost" onClick={() => router.push('/profile')}>
                    Profile
                  </Button>
                ) : null}
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => router.push('/login')}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 