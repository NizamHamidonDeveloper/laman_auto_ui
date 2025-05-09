"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import PageSizeSelector from '@/components/PageSizeSelector';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vehicleIdFilter, setVehicleIdFilter] = useState('');
  const [dealersIdFilter, setDealersIdFilter] = useState('');
  const supabase = createClient();

  const fetchInventory = async () => {
    let query = supabase
      .from('vehicle_inventory')
      .select('*', { count: 'exact' });

    if (vehicleIdFilter) {
      query = query.eq('vehicle_id', vehicleIdFilter);
    }
    if (dealersIdFilter) {
      query = query.eq('dealers_id', dealersIdFilter);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['inventory', vehicleIdFilter, dealersIdFilter],
    queryFn: fetchInventory
  });

  const inventory = data?.data || [];
  const totalItems = data?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedInventory = inventory.slice(startIndex, endIndex);

  if (isLoading) return <div className="text-foreground">Loading...</div>;
  if (error) return <div className="text-destructive">Error loading inventory: {error.message}</div>;

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Vehicle Inventory</h1>
        <Button variant="outline" onClick={() => router.push('/')} className="border-border hover:bg-muted">
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Filter by vehicle ID..."
          value={vehicleIdFilter}
          onChange={(e) => setVehicleIdFilter(e.target.value)}
          className="max-w-sm bg-background text-foreground border-border"
        />
        <Input
          type="text"
          placeholder="Filter by dealer ID..."
          value={dealersIdFilter}
          onChange={(e) => setDealersIdFilter(e.target.value)}
          className="max-w-sm bg-background text-foreground border-border"
        />
        <PageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">ID</TableHead>
              <TableHead className="text-foreground">Vehicle ID</TableHead>
              <TableHead className="text-foreground">Dealer ID</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Price</TableHead>
              <TableHead className="text-foreground">Created At</TableHead>
              <TableHead className="text-foreground">Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-foreground">{item.id}</TableCell>
                <TableCell className="text-foreground">{item.vehicle_id}</TableCell>
                <TableCell className="text-foreground">{item.dealers_id}</TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    item.status === 'available' ? 'text-green-600 dark:text-green-400' : 
                    item.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-foreground">${item.price?.toLocaleString()}</TableCell>
                <TableCell className="text-foreground">{new Date(item.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-foreground">{new Date(item.updated_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-foreground">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} items
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-border hover:bg-muted"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="border-border hover:bg-muted"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 