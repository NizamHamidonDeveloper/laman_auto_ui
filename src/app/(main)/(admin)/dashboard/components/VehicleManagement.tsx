'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Vehicle {
  id: string;
  model_name: string;
  is_active: boolean | null;
  transmission: string | null;
  fuel_type: string | null;
  engine_capacity: number | null;
  color_options: string[] | null;
  badges: string[] | null;
  base_price: number | null;
}

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    model_name: '',
    transmission: '',
    fuel_type: '',
    engine_capacity: '',
    color_options: '',
    base_price: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('Vehicle')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles:', error);
      return;
    }

    setVehicles(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('Vehicle').insert([
      {
        ...formData,
        engine_capacity: formData.engine_capacity ? parseInt(formData.engine_capacity) : null,
        base_price: formData.base_price ? parseFloat(formData.base_price) : null,
        color_options: formData.color_options ? formData.color_options.split(',').map(c => c.trim()) : null,
      },
    ]);

    if (error) {
      console.error('Error adding vehicle:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      model_name: '',
      transmission: '',
      fuel_type: '',
      engine_capacity: '',
      color_options: '',
      base_price: '',
    });
    fetchVehicles();
  };

  const handleEditVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const { error } = await supabase
      .from('Vehicle')
      .update({
        ...formData,
        engine_capacity: formData.engine_capacity ? parseInt(formData.engine_capacity) : null,
        base_price: formData.base_price ? parseFloat(formData.base_price) : null,
        color_options: formData.color_options ? formData.color_options.split(',').map(c => c.trim()) : null,
      })
      .eq('id', selectedVehicle.id);

    if (error) {
      console.error('Error updating vehicle:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedVehicle(null);
    fetchVehicles();
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    const { error } = await supabase.from('Vehicle').delete().eq('id', id);

    if (error) {
      console.error('Error deleting vehicle:', error);
      return;
    }

    fetchVehicles();
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      model_name: vehicle.model_name ?? '',
      transmission: vehicle.transmission ?? '',
      fuel_type: vehicle.fuel_type ?? '',
      engine_capacity: vehicle.engine_capacity?.toString() ?? '',
      color_options: vehicle.color_options?.join(',') ?? '',
      base_price: vehicle.base_price?.toString() ?? '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vehicle Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Vehicle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <Label htmlFor="model_name">Model Name</Label>
                <Input
                  id="model_name"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Input
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Input
                  id="fuel_type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="engine_capacity">Engine Capacity</Label>
                <Input
                  id="engine_capacity"
                  name="engine_capacity"
                  type="number"
                  value={formData.engine_capacity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="color_options">Color Options (comma-separated)</Label>
                <Input
                  id="color_options"
                  name="color_options"
                  value={formData.color_options}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="base_price">Base Price</Label>
                <Input
                  id="base_price"
                  name="base_price"
                  type="number"
                  value={formData.base_price}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit">Add Vehicle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b border-gray-200 text-left">Model Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Transmission</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Fuel Type</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Engine Capacity</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Base Price</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">{vehicle.model_name ?? '-'}</td>
                <td className="py-2 px-4 border-b border-gray-200">{vehicle.transmission ?? '-'}</td>
                <td className="py-2 px-4 border-b border-gray-200">{vehicle.fuel_type ?? '-'}</td>
                <td className="py-2 px-4 border-b border-gray-200">{vehicle.engine_capacity?.toLocaleString() ?? '0'}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ${vehicle.base_price?.toLocaleString() ?? '0'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(vehicle)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditVehicle} className="space-y-4">
            <div>
              <Label htmlFor="edit-model_name">Model Name</Label>
              <Input
                id="edit-model_name"
                name="model_name"
                value={formData.model_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-transmission">Transmission</Label>
              <Input
                id="edit-transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-fuel_type">Fuel Type</Label>
              <Input
                id="edit-fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-engine_capacity">Engine Capacity</Label>
              <Input
                id="edit-engine_capacity"
                name="engine_capacity"
                type="number"
                value={formData.engine_capacity}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-color_options">Color Options (comma-separated)</Label>
              <Input
                id="edit-color_options"
                name="color_options"
                value={formData.color_options}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-base_price">Base Price</Label>
              <Input
                id="edit-base_price"
                name="base_price"
                type="number"
                value={formData.base_price}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 