'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
      <div className="text-2xl font-bold text-blue-700">
        <Link href="/">Laman Auto</Link>
      </div>
      <nav className="space-x-6">
        <Link href="/">Home</Link>
        <Link href="#">Listings</Link>
        <Link href="#">About Us</Link>
      </nav>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Admin Dashboard
              </Link>
            
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
} 