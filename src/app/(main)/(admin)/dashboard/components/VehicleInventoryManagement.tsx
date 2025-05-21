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

interface VehicleInventory {
  id: string;
  vehicle_id: string;
  dealer_id: string;
  stock_number: string | null;
  vin: string | null;
  registration_number: string | null;
  color: string | null;
  mileage: number | null;
  condition: string | null;
  status: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  selling_price: number | null;
  notes: string | null;
  is_available: boolean | null;
}

interface Vehicle {
  id: string;
  model_name: string | null;
  brand_id: string | null;
}

interface Dealer {
  id: string;
  dealership_name: string | null;
}

export default function VehicleInventoryManagement() {
  const [inventory, setInventory] = useState<VehicleInventory[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<VehicleInventory | null>(null);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    dealer_id: '',
    stock_number: '',
    vin: '',
    registration_number: '',
    color: '',
    mileage: '',
    condition: '',
    status: '',
    purchase_date: '',
    purchase_price: '',
    selling_price: '',
    notes: '',
    is_available: true,
  });

  useEffect(() => {
    fetchInventory();
    fetchVehicles();
    fetchDealers();
  }, []);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('VehicleInventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inventory:', error);
      return;
    }

    setInventory(data || []);
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

  const fetchDealers = async () => {
    const { data, error } = await supabase
      .from('Dealer')
      .select('id, dealership_name');

    if (error) {
      console.error('Error fetching dealers:', error);
      return;
    }

    setDealers(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('VehicleInventory').insert([{
      ...formData,
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null,
    }]);

    if (error) {
      console.error('Error adding inventory:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      vehicle_id: '',
      dealer_id: '',
      stock_number: '',
      vin: '',
      registration_number: '',
      color: '',
      mileage: '',
      condition: '',
      status: '',
      purchase_date: '',
      purchase_price: '',
      selling_price: '',
      notes: '',
      is_available: true,
    });
    fetchInventory();
  };

  const handleEditInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventory) return;

    const { error } = await supabase
      .from('VehicleInventory')
      .update({
        ...formData,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null,
      })
      .eq('id', selectedInventory.id);

    if (error) {
      console.error('Error updating inventory:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedInventory(null);
    fetchInventory();
  };

  const handleDeleteInventory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;

    const { error } = await supabase.from('VehicleInventory').delete().eq('id', id);

    if (error) {
      console.error('Error deleting inventory:', error);
      return;
    }

    fetchInventory();
  };

  const openEditDialog = (inventory: VehicleInventory) => {
    setSelectedInventory(inventory);
    setFormData({
      vehicle_id: inventory.vehicle_id,
      dealer_id: inventory.dealer_id,
      stock_number: inventory.stock_number ?? '',
      vin: inventory.vin ?? '',
      registration_number: inventory.registration_number ?? '',
      color: inventory.color ?? '',
      mileage: inventory.mileage?.toString() ?? '',
      condition: inventory.condition ?? '',
      status: inventory.status ?? '',
      purchase_date: inventory.purchase_date ?? '',
      purchase_price: inventory.purchase_price?.toString() ?? '',
      selling_price: inventory.selling_price?.toString() ?? '',
      notes: inventory.notes ?? '',
      is_available: inventory.is_available ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.model_name : 'Unknown Vehicle';
  };

  const getDealerName = (dealerId: string) => {
    const dealer = dealers.find(d => d.id === dealerId);
    return dealer ? dealer.dealership_name : 'Unknown Dealer';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vehicle Inventory Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Inventory</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Inventory</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddInventory} className="space-y-4">
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
                <Label htmlFor="dealer_id">Dealer</Label>
                <select
                  id="dealer_id"
                  name="dealer_id"
                  value={formData.dealer_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a dealer</option>
                  {dealers.map((dealer) => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.dealership_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="stock_number">Stock Number</Label>
                <Input
                  id="stock_number"
                  name="stock_number"
                  value={formData.stock_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="registration_number">Registration Number</Label>
                <Input
                  id="registration_number"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Input
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="purchase_price">Purchase Price</Label>
                <Input
                  id="purchase_price"
                  name="purchase_price"
                  type="number"
                  value={formData.purchase_price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="selling_price">Selling Price</Label>
                <Input
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  value={formData.selling_price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
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
              <Button type="submit">Add Inventory</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b border-gray-200 text-left">Vehicle</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Dealer</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Stock Number</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">VIN</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Color</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Mileage</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Selling Price</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Available</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {getVehicleName(item.vehicle_id)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {getDealerName(item.dealer_id)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.stock_number ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.vin ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.color ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.mileage?.toLocaleString() ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.status ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ${item.selling_price?.toLocaleString() ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.is_available ? 'Yes' : 'No'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteInventory(item.id)}
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
            <DialogTitle>Edit Inventory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditInventory} className="space-y-4">
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
              <Label htmlFor="edit-dealer_id">Dealer</Label>
              <select
                id="edit-dealer_id"
                name="dealer_id"
                value={formData.dealer_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a dealer</option>
                {dealers.map((dealer) => (
                  <option key={dealer.id} value={dealer.id}>
                    {dealer.dealership_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-stock_number">Stock Number</Label>
              <Input
                id="edit-stock_number"
                name="stock_number"
                value={formData.stock_number}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-vin">VIN</Label>
              <Input
                id="edit-vin"
                name="vin"
                value={formData.vin}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-registration_number">Registration Number</Label>
              <Input
                id="edit-registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-color">Color</Label>
              <Input
                id="edit-color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-mileage">Mileage</Label>
              <Input
                id="edit-mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-condition">Condition</Label>
              <Input
                id="edit-condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Input
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-purchase_date">Purchase Date</Label>
              <Input
                id="edit-purchase_date"
                name="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-purchase_price">Purchase Price</Label>
              <Input
                id="edit-purchase_price"
                name="purchase_price"
                type="number"
                value={formData.purchase_price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-selling_price">Selling Price</Label>
              <Input
                id="edit-selling_price"
                name="selling_price"
                type="number"
                value={formData.selling_price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
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
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 