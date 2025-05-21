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

interface VehicleColor {
  id: string;
  vehicle_id: string;
  color_name: string | null;
  color_code: string | null;
  is_metallic: boolean | null;
  is_pearl: boolean | null;
  is_special_edition: boolean | null;
  additional_cost: number | null;
  is_available: boolean | null;
  stock_quantity: number | null;
  color_image_url: string | null;
  description: string | null;
}

interface Vehicle {
  id: string;
  model_name: string | null;
  brand_id: string | null;
}

export default function VehicleColorManagement() {
  const [colors, setColors] = useState<VehicleColor[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<VehicleColor | null>(null);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    color_name: '',
    color_code: '',
    is_metallic: false,
    is_pearl: false,
    is_special_edition: false,
    additional_cost: '',
    is_available: true,
    stock_quantity: '',
    color_image_url: '',
    description: '',
  });

  useEffect(() => {
    fetchColors();
    fetchVehicles();
  }, []);

  const fetchColors = async () => {
    const { data, error } = await supabase
      .from('VehicleColor')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching colors:', error);
      return;
    }

    setColors(data || []);
  };

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('Vehicle')
      .select('id, model_name, brand_id');

    if (error) {
      console.error('Error fetching vehicles:', error);
      return;
    }

    setVehicles(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('VehicleColor').insert([{
      ...formData,
      additional_cost: formData.additional_cost ? parseFloat(formData.additional_cost) : null,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
    }]);

    if (error) {
      console.error('Error adding color:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      vehicle_id: '',
      color_name: '',
      color_code: '',
      is_metallic: false,
      is_pearl: false,
      is_special_edition: false,
      additional_cost: '',
      is_available: true,
      stock_quantity: '',
      color_image_url: '',
      description: '',
    });
    fetchColors();
  };

  const handleEditColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColor) return;

    const { error } = await supabase
      .from('VehicleColor')
      .update({
        ...formData,
        additional_cost: formData.additional_cost ? parseFloat(formData.additional_cost) : null,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
      })
      .eq('id', selectedColor.id);

    if (error) {
      console.error('Error updating color:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedColor(null);
    fetchColors();
  };

  const handleDeleteColor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this color?')) return;

    const { error } = await supabase.from('VehicleColor').delete().eq('id', id);

    if (error) {
      console.error('Error deleting color:', error);
      return;
    }

    fetchColors();
  };

  const openEditDialog = (color: VehicleColor) => {
    setSelectedColor(color);
    setFormData({
      vehicle_id: color.vehicle_id,
      color_name: color.color_name ?? '',
      color_code: color.color_code ?? '',
      is_metallic: color.is_metallic ?? false,
      is_pearl: color.is_pearl ?? false,
      is_special_edition: color.is_special_edition ?? false,
      additional_cost: color.additional_cost?.toString() ?? '',
      is_available: color.is_available ?? true,
      stock_quantity: color.stock_quantity?.toString() ?? '',
      color_image_url: color.color_image_url ?? '',
      description: color.description ?? '',
    });
    setIsEditDialogOpen(true);
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.model_name : 'Unknown Vehicle';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vehicle Color Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Color</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Color</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddColor} className="space-y-4">
              <div>
                <Label htmlFor="vehicle_id">Vehicle</Label>
                <select
                  id="vehicle_id"
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.model_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="color_name">Color Name</Label>
                <Input
                  id="color_name"
                  name="color_name"
                  value={formData.color_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="color_code">Color Code</Label>
                <Input
                  id="color_code"
                  name="color_code"
                  value={formData.color_code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="color_image_url">Color Image URL</Label>
                <Input
                  id="color_image_url"
                  name="color_image_url"
                  value={formData.color_image_url}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="additional_cost">Additional Cost</Label>
                <Input
                  id="additional_cost"
                  name="additional_cost"
                  type="number"
                  value={formData.additional_cost}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_metallic"
                    name="is_metallic"
                    checked={formData.is_metallic}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="is_metallic">Metallic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_pearl"
                    name="is_pearl"
                    checked={formData.is_pearl}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="is_pearl">Pearl</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_special_edition"
                    name="is_special_edition"
                    checked={formData.is_special_edition}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="is_special_edition">Special Edition</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="is_available">Available</Label>
                </div>
              </div>
              <Button type="submit">Add Color</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b border-gray-200 text-left">Vehicle</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Color Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Color Code</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Type</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Additional Cost</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Stock</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {getVehicleName(color.vehicle_id)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {color.color_name ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    {color.color_code && (
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: color.color_code }}
                      />
                    )}
                    <span>{color.color_code ?? '-'}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {[
                    color.is_metallic && 'Metallic',
                    color.is_pearl && 'Pearl',
                    color.is_special_edition && 'Special Edition',
                  ]
                    .filter(Boolean)
                    .join(', ') || 'Standard'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {color.additional_cost
                    ? `$${color.additional_cost.toLocaleString()}`
                    : '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {color.stock_quantity?.toString() ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {color.is_available ? 'Available' : 'Unavailable'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(color)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteColor(color.id)}
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
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Color</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditColor} className="space-y-4">
            <div>
              <Label htmlFor="edit-vehicle_id">Vehicle</Label>
              <select
                id="edit-vehicle_id"
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.model_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-color_name">Color Name</Label>
              <Input
                id="edit-color_name"
                name="color_name"
                value={formData.color_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-color_code">Color Code</Label>
              <Input
                id="edit-color_code"
                name="color_code"
                value={formData.color_code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-color_image_url">Color Image URL</Label>
              <Input
                id="edit-color_image_url"
                name="color_image_url"
                value={formData.color_image_url}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-additional_cost">Additional Cost</Label>
              <Input
                id="edit-additional_cost"
                name="additional_cost"
                type="number"
                value={formData.additional_cost}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-stock_quantity">Stock Quantity</Label>
              <Input
                id="edit-stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is_metallic"
                  name="is_metallic"
                  checked={formData.is_metallic}
                  onChange={handleInputChange}
                />
                <Label htmlFor="edit-is_metallic">Metallic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is_pearl"
                  name="is_pearl"
                  checked={formData.is_pearl}
                  onChange={handleInputChange}
                />
                <Label htmlFor="edit-is_pearl">Pearl</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is_special_edition"
                  name="is_special_edition"
                  checked={formData.is_special_edition}
                  onChange={handleInputChange}
                />
                <Label htmlFor="edit-is_special_edition">Special Edition</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is_available"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                />
                <Label htmlFor="edit-is_available">Available</Label>
              </div>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 