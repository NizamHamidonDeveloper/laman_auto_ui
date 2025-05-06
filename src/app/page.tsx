"use client";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const fetchStats = async () => {
  const [
    { count: usersCount },
    { count: dealersCount },
    { count: vehiclesCount },
    { count: applicationsCount }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('dealer_accounts').select('*', { count: 'exact', head: true }),
    supabase.from('vehicles').select('*', { count: 'exact', head: true }),
    supabase.from('loan_applications').select('*', { count: 'exact', head: true })
  ]);

  return {
    users: usersCount || 0,
    dealers: dealersCount || 0,
    vehicles: vehiclesCount || 0,
    applications: applicationsCount || 0
  };
};

export default function Home() {
  const router = useRouter();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchStats,
    staleTime: 60 * 1000, // 1 minute
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <button
            onClick={() => {
              supabase.auth.signOut();
              router.push('/login');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.users}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Dealer Accounts</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.dealers}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Vehicles</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.vehicles}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Loan Applications</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.applications}</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
