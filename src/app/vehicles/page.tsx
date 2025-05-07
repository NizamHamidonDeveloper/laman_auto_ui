"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import VehicleModal from '@/components/VehicleModal';

export default function VehiclesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const filteredVehicles = vehicles?.filter(vehicle => 
    vehicle.model_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuel_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.transmission?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredVehicles?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedVehicles = filteredVehicles?.slice(startIndex, endIndex);

  if (isLoading) return <div className="text-foreground">Loading...</div>;
  if (error) return <div className="text-destructive">Error loading vehicles</div>;

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Vehicles Management</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsModalOpen(true)}>Add New Vehicle</Button>
          <Button variant="outline" onClick={() => router.push('/')} className="border-border hover:bg-muted">
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Search vehicles..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm bg-background text-foreground border-border"
        />
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="bg-background text-foreground border-border rounded-md px-3 py-2"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Model</TableHead>
              <TableHead className="text-foreground">Year</TableHead>
              <TableHead className="text-foreground">Transmission</TableHead>
              <TableHead className="text-foreground">Fuel Type</TableHead>
              <TableHead className="text-foreground">Engine</TableHead>
              <TableHead className="text-foreground">Seating</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVehicles?.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="text-foreground">{vehicle.model_name}</TableCell>
                <TableCell className="text-foreground">{vehicle.model_year}</TableCell>
                <TableCell className="text-foreground">{vehicle.transmission}</TableCell>
                <TableCell className="text-foreground">{vehicle.fuel_type}</TableCell>
                <TableCell className="text-foreground">{vehicle.engine_capacity}</TableCell>
                <TableCell className="text-foreground">{vehicle.seating_capacity}</TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    vehicle.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {vehicle.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-foreground">{new Date(vehicle.created_at).toLocaleDateString()}</TableCell>
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

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
