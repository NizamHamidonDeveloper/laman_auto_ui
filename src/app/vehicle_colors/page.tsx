"use client";
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VehicleColorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [colors, setColors] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Read params from URL
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortDir = searchParams.get('sortDir') === 'desc' ? 'desc' : 'asc';
  const colorNameFilter = searchParams.get('color_name') || '';
  const vehicleIdFilter = searchParams.get('vehicle_id') || '';

  // Build URL for navigation
  const buildUrl = useCallback((paramsObj: Record<string, string | number>) => {
    const sp = new URLSearchParams({
      page: String(paramsObj.page ?? page),
      pageSize: String(paramsObj.pageSize ?? pageSize),
      sortBy: String(paramsObj.sortBy ?? sortBy),
      sortDir: String(paramsObj.sortDir ?? sortDir),
      color_name: String(paramsObj.color_name ?? colorNameFilter),
      vehicle_id: String(paramsObj.vehicle_id ?? vehicleIdFilter),
    });
    return `/vehicle_colors?${sp.toString()}`;
  }, [page, pageSize, sortBy, sortDir, colorNameFilter, vehicleIdFilter]);

  // Fetch data from Supabase
  useEffect(() => {
    setLoading(true);
    let query = supabase.from('vehicle_colors').select('*', { count: 'exact' });
    if (colorNameFilter) {
      query = query.ilike('color_name', `%${colorNameFilter}%`);
    }
    if (vehicleIdFilter) {
      query = query.eq('vehicle_id', vehicleIdFilter);
    }
    query = query.order(sortBy, { ascending: sortDir === 'asc' });
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    query.then(({ data, error, count }) => {
      setColors(data || []);
      setCount(count || 0);
      setLoading(false);
    });
  }, [page, pageSize, sortBy, sortDir, colorNameFilter, vehicleIdFilter]);

  return (
    <div className="p-8">
      <Link href="/" className="inline-block mb-4 font-semibold bg-white px-4 py-2 rounded shadow border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-6">All Vehicle Colors</h1>
      <form className="mb-4 flex gap-4 items-center" action="/vehicle_colors" method="get" onSubmit={e => { e.preventDefault(); router.push(buildUrl({ color_name: (e.target as any).color_name.value, vehicle_id: (e.target as any).vehicle_id.value, page: 1 })); }}>
        <input
          type="text"
          name="color_name"
          placeholder="Filter by color name..."
          defaultValue={colorNameFilter}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="vehicle_id"
          placeholder="Filter by vehicle_id..."
          defaultValue={vehicleIdFilter}
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-gray-900 text-white px-3 py-1 rounded">Filter</button>
      </form>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(colors[0] || {}).map((col) => (
                <TableHead key={col}>
                  <button
                    onClick={() => {
                      router.push(buildUrl({ sortBy: col, sortDir: sortBy === col && sortDir === 'asc' ? 'desc' : 'asc' }));
                    }}
                    className="cursor-pointer hover:underline flex items-center gap-1 bg-transparent border-none p-0"
                  >
                    {col}
                    {sortBy === col ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {colors.map((color: any) => (
              <TableRow key={color.id}>
                {Object.values(color).map((val, idx) => (
                  <TableCell key={idx}>
                    {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex items-center gap-4 mt-4">
        <span>
          Page {page} of {count ? Math.ceil(count / pageSize) : 1}
        </span>
        <button
          onClick={() => router.push(buildUrl({ page: page > 1 ? page - 1 : 1 }))}
          className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 text-white'}`}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => router.push(buildUrl({ page: page + 1 }))}
          className={`px-3 py-1 rounded ${(count && page >= Math.ceil(count / pageSize)) ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 text-white'}`}
          disabled={!!count && page >= Math.ceil(count / pageSize)}
        >
          Next
        </button>
        <select
          value={pageSize}
          onChange={e => router.push(buildUrl({ pageSize: e.target.value, page: 1 }))}
          className="ml-2 border rounded px-2 py-1"
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
} 