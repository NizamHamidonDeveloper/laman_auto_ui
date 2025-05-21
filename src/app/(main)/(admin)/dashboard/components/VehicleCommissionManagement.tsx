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

interface VehicleCommission {
  id: string;
  vehicle_id: string;
  dealer_id: string;
  commission_type: string | null;
  commission_rate: number | null;
  min_amount: number | null;
  max_amount: number | null;
  is_active: boolean | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
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

export default function VehicleCommissionManagement() {
  const [commissions, setCommissions] = useState<VehicleCommission[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<VehicleCommission | null>(null);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    dealer_id: '',
    commission_type: '',
    commission_rate: '',
    min_amount: '',
    max_amount: '',
    is_active: true,
    start_date: '',
    end_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchCommissions();
    fetchVehicles();
    fetchDealers();
  }, []);

  const fetchCommissions = async () => {
    const { data, error } = await supabase
      .from('VehicleCommission')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching commissions:', error);
      return;
    }

    setCommissions(data || []);
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

  const handleAddCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('VehicleCommission').insert([{
      ...formData,
      commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : null,
      min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
      max_amount: formData.max_amount ? parseFloat(formData.max_amount) : null,
    }]);

    if (error) {
      console.error('Error adding commission:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      vehicle_id: '',
      dealer_id: '',
      commission_type: '',
      commission_rate: '',
      min_amount: '',
      max_amount: '',
      is_active: true,
      start_date: '',
      end_date: '',
      notes: '',
    });
    fetchCommissions();
  };

  const handleEditCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommission) return;

    const { error } = await supabase
      .from('VehicleCommission')
      .update({
        ...formData,
        commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : null,
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        max_amount: formData.max_amount ? parseFloat(formData.max_amount) : null,
      })
      .eq('id', selectedCommission.id);

    if (error) {
      console.error('Error updating commission:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedCommission(null);
    fetchCommissions();
  };

  const handleDeleteCommission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this commission?')) return;

    const { error } = await supabase.from('VehicleCommission').delete().eq('id', id);

    if (error) {
      console.error('Error deleting commission:', error);
      return;
    }

    fetchCommissions();
  };

  const openEditDialog = (commission: VehicleCommission) => {
    setSelectedCommission(commission);
    setFormData({
      vehicle_id: commission.vehicle_id,
      dealer_id: commission.dealer_id,
      commission_type: commission.commission_type ?? '',
      commission_rate: commission.commission_rate?.toString() ?? '',
      min_amount: commission.min_amount?.toString() ?? '',
      max_amount: commission.max_amount?.toString() ?? '',
      is_active: commission.is_active ?? true,
      start_date: commission.start_date ?? '',
      end_date: commission.end_date ?? '',
      notes: commission.notes ?? '',
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
        <h2 className="text-2xl font-bold">Vehicle Commission Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Commission</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Commission</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCommission} className="space-y-4">
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
                <Label htmlFor="commission_type">Commission Type</Label>
                <Input
                  id="commission_type"
                  name="commission_type"
                  value={formData.commission_type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="commission_rate">Commission Rate (%)</Label>
                <Input
                  id="commission_rate"
                  name="commission_rate"
                  type="number"
                  step="0.01"
                  value={formData.commission_rate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="min_amount">Minimum Amount</Label>
                <Input
                  id="min_amount"
                  name="min_amount"
                  type="number"
                  value={formData.min_amount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="max_amount">Maximum Amount</Label>
                <Input
                  id="max_amount"
                  name="max_amount"
                  type="number"
                  value={formData.max_amount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
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
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <Button type="submit">Add Commission</Button>
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
              <th className="py-2 px-4 border-b border-gray-200 text-left">Commission Type</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Rate</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Min Amount</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Max Amount</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Valid Period</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission) => (
              <tr key={commission.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {getVehicleName(commission.vehicle_id)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {getDealerName(commission.dealer_id)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {commission.commission_type ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {commission.commission_rate ? `${commission.commission_rate}%` : '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {commission.min_amount ? `$${commission.min_amount.toLocaleString()}` : '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {commission.max_amount ? `$${commission.max_amount.toLocaleString()}` : '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {commission.start_date && commission.end_date
                    ? `${new Date(commission.start_date).toLocaleDateString()} - ${new Date(commission.end_date).toLocaleDateString()}`
                    : 'No date range'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {commission.is_active ? 'Active' : 'Inactive'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(commission)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCommission(commission.id)}
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
            <DialogTitle>Edit Commission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCommission} className="space-y-4">
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
              <Label htmlFor="edit-commission_type">Commission Type</Label>
              <Input
                id="edit-commission_type"
                name="commission_type"
                value={formData.commission_type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-commission_rate">Commission Rate (%)</Label>
              <Input
                id="edit-commission_rate"
                name="commission_rate"
                type="number"
                step="0.01"
                value={formData.commission_rate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-min_amount">Minimum Amount</Label>
              <Input
                id="edit-min_amount"
                name="min_amount"
                type="number"
                value={formData.min_amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-max_amount">Maximum Amount</Label>
              <Input
                id="edit-max_amount"
                name="max_amount"
                type="number"
                value={formData.max_amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-start_date">Start Date</Label>
              <Input
                id="edit-start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-end_date">End Date</Label>
              <Input
                id="edit-end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
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
                id="edit-is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <Label htmlFor="edit-is_active">Active</Label>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 