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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import VehicleModal from '@/components/VehicleModal';
import ConfirmModal from '@/components/ConfirmModal';
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

export default function VehiclesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const supabase = createClient();
  const queryClient = useQueryClient();

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

  const handleEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle?.id) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', selectedVehicle.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsConfirmModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
    }
  };

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
          <Button onClick={() => {
            setModalMode('add');
            setSelectedVehicle(null);
            setIsModalOpen(true);
          }}>Add New Vehicle</Button>
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
              <TableHead className="text-foreground">Actions</TableHead>
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => handleEdit(vehicle)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleDelete(vehicle)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
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
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
        mode={modalMode}
        vehicleId={selectedVehicle?.id}
        onSave={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
          queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        }}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedVehicle(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This action cannot be undone."
      />
    </div>
  );
}
