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

interface VehicleOffer {
  id: string;
  vehicle_id: string;
  dealer_id: string;
  offer_title: string | null;
  offer_description: string | null;
  discount_amount: number | null;
  discount_percentage: number | null;
  start_date: string | null;
  end_date: string | null;
  terms_conditions: string | null;
  is_active: boolean | null;
  offer_type: string | null;
  minimum_purchase_amount: number | null;
  maximum_discount: number | null;
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

export default function VehicleOfferManagement() {
  const [offers, setOffers] = useState<VehicleOffer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<VehicleOffer | null>(null);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    dealer_id: '',
    offer_title: '',
    offer_description: '',
    discount_amount: '',
    discount_percentage: '',
    start_date: '',
    end_date: '',
    terms_conditions: '',
    is_active: true,
    offer_type: '',
    minimum_purchase_amount: '',
    maximum_discount: '',
  });

  useEffect(() => {
    fetchOffers();
    fetchVehicles();
    fetchDealers();
  }, []);

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from('VehicleOffer')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching offers:', error);
      return;
    }

    setOffers(data || []);
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

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('VehicleOffer').insert([{
      ...formData,
      discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
      discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
      minimum_purchase_amount: formData.minimum_purchase_amount ? parseFloat(formData.minimum_purchase_amount) : null,
      maximum_discount: formData.maximum_discount ? parseFloat(formData.maximum_discount) : null,
    }]);

    if (error) {
      console.error('Error adding offer:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      vehicle_id: '',
      dealer_id: '',
      offer_title: '',
      offer_description: '',
      discount_amount: '',
      discount_percentage: '',
      start_date: '',
      end_date: '',
      terms_conditions: '',
      is_active: true,
      offer_type: '',
      minimum_purchase_amount: '',
      maximum_discount: '',
    });
    fetchOffers();
  };

  const handleEditOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    const { error } = await supabase
      .from('VehicleOffer')
      .update({
        ...formData,
        discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        minimum_purchase_amount: formData.minimum_purchase_amount ? parseFloat(formData.minimum_purchase_amount) : null,
        maximum_discount: formData.maximum_discount ? parseFloat(formData.maximum_discount) : null,
      })
      .eq('id', selectedOffer.id);

    if (error) {
      console.error('Error updating offer:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedOffer(null);
    fetchOffers();
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    const { error } = await supabase.from('VehicleOffer').delete().eq('id', id);

    if (error) {
      console.error('Error deleting offer:', error);
      return;
    }

    fetchOffers();
  };

  const openEditDialog = (offer: VehicleOffer) => {
    setSelectedOffer(offer);
    setFormData({
      vehicle_id: offer.vehicle_id,
      dealer_id: offer.dealer_id,
      offer_title: offer.offer_title ?? '',
      offer_description: offer.offer_description ?? '',
      discount_amount: offer.discount_amount?.toString() ?? '',
      discount_percentage: offer.discount_percentage?.toString() ?? '',
      start_date: offer.start_date ?? '',
      end_date: offer.end_date ?? '',
      terms_conditions: offer.terms_conditions ?? '',
      is_active: offer.is_active ?? true,
      offer_type: offer.offer_type ?? '',
      minimum_purchase_amount: offer.minimum_purchase_amount?.toString() ?? '',
      maximum_discount: offer.maximum_discount?.toString() ?? '',
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
        <h2 className="text-2xl font-bold">Vehicle Offer Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Offer</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Offer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOffer} className="space-y-4">
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
                <Label htmlFor="offer_title">Offer Title</Label>
                <Input
                  id="offer_title"
                  name="offer_title"
                  value={formData.offer_title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="offer_description">Description</Label>
                <Input
                  id="offer_description"
                  name="offer_description"
                  value={formData.offer_description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="offer_type">Offer Type</Label>
                <Input
                  id="offer_type"
                  name="offer_type"
                  value={formData.offer_type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount_amount">Discount Amount</Label>
                <Input
                  id="discount_amount"
                  name="discount_amount"
                  type="number"
                  value={formData.discount_amount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage">Discount Percentage</Label>
                <Input
                  id="discount_percentage"
                  name="discount_percentage"
                  type="number"
                  step="0.01"
                  value={formData.discount_percentage}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="minimum_purchase_amount">Minimum Purchase Amount</Label>
                <Input
                  id="minimum_purchase_amount"
                  name="minimum_purchase_amount"
                  type="number"
                  value={formData.minimum_purchase_amount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="maximum_discount">Maximum Discount</Label>
                <Input
                  id="maximum_discount"
                  name="maximum_discount"
                  type="number"
                  value={formData.maximum_discount}
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
                  required
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                <Input
                  id="terms_conditions"
                  name="terms_conditions"
                  value={formData.terms_conditions}
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
              <Button type="submit">Add Offer</Button>
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
              <th className="py-2 px-4 border-b border-gray-200 text-left">Offer Title</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Type</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Discount</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Valid Period</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {getVehicleName(offer.vehicle_id)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {getDealerName(offer.dealer_id)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {offer.offer_title ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {offer.offer_type ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {offer.discount_amount 
                    ? `$${offer.discount_amount.toLocaleString()}`
                    : offer.discount_percentage 
                      ? `${offer.discount_percentage}%`
                      : '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {offer.start_date && offer.end_date
                    ? `${new Date(offer.start_date).toLocaleDateString()} - ${new Date(offer.end_date).toLocaleDateString()}`
                    : 'No date range'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {offer.is_active ? 'Active' : 'Inactive'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(offer)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteOffer(offer.id)}
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
            <DialogTitle>Edit Offer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditOffer} className="space-y-4">
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
              <Label htmlFor="edit-offer_title">Offer Title</Label>
              <Input
                id="edit-offer_title"
                name="offer_title"
                value={formData.offer_title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-offer_description">Description</Label>
              <Input
                id="edit-offer_description"
                name="offer_description"
                value={formData.offer_description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-offer_type">Offer Type</Label>
              <Input
                id="edit-offer_type"
                name="offer_type"
                value={formData.offer_type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-discount_amount">Discount Amount</Label>
              <Input
                id="edit-discount_amount"
                name="discount_amount"
                type="number"
                value={formData.discount_amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-discount_percentage">Discount Percentage</Label>
              <Input
                id="edit-discount_percentage"
                name="discount_percentage"
                type="number"
                step="0.01"
                value={formData.discount_percentage}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-minimum_purchase_amount">Minimum Purchase Amount</Label>
              <Input
                id="edit-minimum_purchase_amount"
                name="minimum_purchase_amount"
                type="number"
                value={formData.minimum_purchase_amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-maximum_discount">Maximum Discount</Label>
              <Input
                id="edit-maximum_discount"
                name="maximum_discount"
                type="number"
                value={formData.maximum_discount}
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
                required
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
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-terms_conditions">Terms & Conditions</Label>
              <Input
                id="edit-terms_conditions"
                name="terms_conditions"
                value={formData.terms_conditions}
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