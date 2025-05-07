"use client";
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type VehicleColor = {
  id: string;
  name: string;
  hex_code: string;
  created_at: string;
  [key: string]: any;
};

export default function VehicleColorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [colors, setColors] = useState<VehicleColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const supabase = createClient();

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortDir = searchParams.get('sortDir') || 'asc';
  const search = searchParams.get('search') || '';

  const buildUrl = useCallback((paramsObj: Record<string, string | number>) => {
    const sp = new URLSearchParams({
      page: String(paramsObj.page ?? page),
      pageSize: String(paramsObj.pageSize ?? pageSize),
      sortBy: String(paramsObj.sortBy ?? sortBy),
      sortDir: String(paramsObj.sortDir ?? sortDir),
      search: String(paramsObj.search ?? search),
    });
    return `/vehicle_colors?${sp.toString()}`;
  }, [page, pageSize, sortBy, sortDir, search]);

  useEffect(() => {
    setIsLoading(true);
    let query = supabase.from('vehicle_colors').select('*', { count: 'exact' });
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    query = query.order(sortBy, { ascending: sortDir === 'asc' });
    query = query.range((page - 1) * pageSize, page * pageSize - 1);

    query.then(({ data, error, count }) => {
      setColors(data || []);
      setCount(count || 0);
      setError(error ? error.message : null);
      setIsLoading(false);
    });
  }, [page, pageSize, sortBy, sortDir, search]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-foreground">Vehicle Colors</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-1 bg-background text-foreground"
            value={search}
            onChange={(e) => {
              router.push(buildUrl({ search: e.target.value }));
            }}
          />
          <select
            className="border rounded px-3 py-1 bg-background text-foreground"
            value={pageSize}
            onChange={(e) => {
              router.push(buildUrl({ pageSize: e.target.value }));
            }}
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-destructive text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => {
                      router.push(buildUrl({ 
                        sortBy: 'name', 
                        sortDir: sortBy === 'name' && sortDir === 'asc' ? 'desc' : 'asc' 
                      }));
                    }}
                    className="cursor-pointer hover:underline flex items-center gap-1"
                  >
                    Name
                    {sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colors.map((color) => (
                <TableRow key={color.id}>
                  <TableCell>{color.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border" 
                        style={{ backgroundColor: color.hex_code }}
                      />
                      {color.hex_code}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(color.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {colors.length} of {count} colors
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(buildUrl({ page: page - 1 }))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => router.push(buildUrl({ page: page + 1 }))}
            disabled={page * pageSize >= count}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 