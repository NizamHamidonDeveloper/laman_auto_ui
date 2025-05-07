"use client";
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type InventoryItem = {
  id: string;
  vehicle_id: string;
  dealers_id: string;
  status: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export default function VehicleInventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Read params from URL
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortDir = searchParams.get('sortDir') === 'desc' ? 'desc' : 'asc';
  const vehicleIdFilter = searchParams.get('vehicle_id') || '';
  const dealersIdFilter = searchParams.get('dealers_id') || '';

  // Build URL for navigation
  const buildUrl = useCallback((paramsObj: Record<string, string | number>) => {
    const sp = new URLSearchParams({
      page: String(paramsObj.page ?? page),
      pageSize: String(paramsObj.pageSize ?? pageSize),
      sortBy: String(paramsObj.sortBy ?? sortBy),
      sortDir: String(paramsObj.sortDir ?? sortDir),
      vehicle_id: String(paramsObj.vehicle_id ?? vehicleIdFilter),
      dealers_id: String(paramsObj.dealers_id ?? dealersIdFilter),
    });
    return `/vehicle_inventory?${sp.toString()}`;
  }, [page, pageSize, sortBy, sortDir, vehicleIdFilter, dealersIdFilter]);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('vehicle_inventory')
          .select('*', { count: 'exact' });

        if (vehicleIdFilter) {
          query = query.eq('vehicle_id', vehicleIdFilter);
        }
        if (dealersIdFilter) {
          query = query.eq('dealers_id', dealersIdFilter);
        }

        query = query.order(sortBy, { ascending: sortDir === 'asc' });
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
          throw error;
        }

        setInventory(data || []);
        setCount(count || 0);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [page, pageSize, sortBy, sortDir, vehicleIdFilter, dealersIdFilter]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'vehicle_id', label: 'Vehicle ID' },
    { key: 'dealers_id', label: 'Dealer ID' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-foreground">Vehicle Inventory</h1>
        <Link 
          href="/dashboard" 
          className="text-primary hover:text-primary/80 transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Filter by vehicle ID..."
          value={vehicleIdFilter}
          onChange={(e) => router.push(buildUrl({ vehicle_id: e.target.value, page: 1 }))}
          className="border rounded px-3 py-1 bg-background text-foreground"
        />
        <input
          type="text"
          placeholder="Filter by dealer ID..."
          value={dealersIdFilter}
          onChange={(e) => router.push(buildUrl({ dealers_id: e.target.value, page: 1 }))}
          className="border rounded px-3 py-1 bg-background text-foreground"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-destructive text-center p-4 bg-destructive/10 rounded-lg">
          <p className="font-medium">Error loading inventory</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>
                    <button
                      onClick={() => {
                        router.push(buildUrl({ 
                          sortBy: col.key, 
                          sortDir: sortBy === col.key && sortDir === 'asc' ? 'desc' : 'asc' 
                        }));
                      }}
                      className="cursor-pointer hover:underline flex items-center gap-1 bg-transparent border-none p-0"
                    >
                      {col.label}
                      {sortBy === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.vehicle_id}</TableCell>
                  <TableCell>{item.dealers_id}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      item.status === 'available' ? 'text-green-600' : 
                      item.status === 'pending' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>${item.price?.toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {count > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, count)} of {count} items
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(buildUrl({ page: page > 1 ? page - 1 : 1 }))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => router.push(buildUrl({ page: page + 1 }))}
                  disabled={count && page >= Math.ceil(count / pageSize)}
                  className="px-3 py-1 rounded bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <select
                  value={pageSize}
                  onChange={(e) => router.push(buildUrl({ pageSize: e.target.value, page: 1 }))}
                  className="border rounded px-2 py-1 bg-background text-foreground"
                >
                  {[10, 20, 50, 100].map(size => (
                    <option key={size} value={size}>{size} per page</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 