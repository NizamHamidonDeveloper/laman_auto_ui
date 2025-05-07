"use client";
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Vehicle = {
  id: string;
  model_name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  transmission: string;
  fuel_type: string;
  engine_capacity: string;
  body_type: string | null;
  seating_capacity: number;
  color_options: string[] | null;
  stock_quantity: number | null;
  monthly_installment_estimate: number | null;
  badges: string[] | null;
  specs: any | null;
  main_image_url: string | null;
  gallery_urls: string[] | null;
  model_year: number;
  brand_id: string;
};

export default function VehiclesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const supabase = createClient();

  const fetchVehicles = useCallback(async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }, [supabase]);

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const filteredVehicles = vehicles?.filter(vehicle => 
    vehicle.model_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuel_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.transmission?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredVehicles?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedVehicles = filteredVehicles?.slice(startIndex, endIndex);

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-destructive text-center p-4 bg-destructive/10 rounded-lg">
      <p className="font-medium">Error loading vehicles</p>
      <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Failed to fetch vehicles'}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-foreground">Vehicles</h1>
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
          placeholder="Search vehicles..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded px-3 py-1 bg-background text-foreground"
        />
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Transmission</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Engine</TableHead>
              <TableHead>Seating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVehicles?.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.model_name}</TableCell>
                <TableCell>{vehicle.model_year}</TableCell>
                <TableCell>{vehicle.transmission}</TableCell>
                <TableCell>{vehicle.fuel_type}</TableCell>
                <TableCell>{vehicle.engine_capacity}</TableCell>
                <TableCell>{vehicle.seating_capacity}</TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    vehicle.is_active ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {vehicle.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>{new Date(vehicle.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalItems > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {totalItems} items
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
