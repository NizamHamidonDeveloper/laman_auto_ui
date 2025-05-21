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

interface Dealer {
  id: string;
  dealership_name: string | null;
  business_name: string | null;
  registration_number: string | null;
  contact_person: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  location: string | null;
  is_active: boolean | null;
  vso: string | null;
}

export default function DealerManagement() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [formData, setFormData] = useState({
    dealership_name: '',
    business_name: '',
    registration_number: '',
    contact_person: '',
    phone_number: '',
    email: '',
    address: '',
    location: '',
    is_active: true,
    vso: '',
  });

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    const { data, error } = await supabase
      .from('Dealer')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dealers:', error);
      return;
    }

    setDealers(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('Dealer').insert([formData]);

    if (error) {
      console.error('Error adding dealer:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      dealership_name: '',
      business_name: '',
      registration_number: '',
      contact_person: '',
      phone_number: '',
      email: '',
      address: '',
      location: '',
      is_active: true,
      vso: '',
    });
    fetchDealers();
  };

  const handleEditDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealer) return;

    const { error } = await supabase
      .from('Dealer')
      .update(formData)
      .eq('id', selectedDealer.id);

    if (error) {
      console.error('Error updating dealer:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedDealer(null);
    fetchDealers();
  };

  const handleDeleteDealer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dealer?')) return;

    const { error } = await supabase.from('Dealer').delete().eq('id', id);

    if (error) {
      console.error('Error deleting dealer:', error);
      return;
    }

    fetchDealers();
  };

  const openEditDialog = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setFormData({
      dealership_name: dealer.dealership_name ?? '',
      business_name: dealer.business_name ?? '',
      registration_number: dealer.registration_number ?? '',
      contact_person: dealer.contact_person ?? '',
      phone_number: dealer.phone_number ?? '',
      email: dealer.email ?? '',
      address: dealer.address ?? '',
      location: dealer.location ?? '',
      is_active: dealer.is_active ?? true,
      vso: dealer.vso ?? '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dealer Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Dealer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Dealer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDealer} className="space-y-4">
              <div>
                <Label htmlFor="dealership_name">Dealership Name</Label>
                <Input
                  id="dealership_name"
                  name="dealership_name"
                  value={formData.dealership_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vso">VSO</Label>
                <Input
                  id="vso"
                  name="vso"
                  value={formData.vso}
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
              <Button type="submit">Add Dealer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b border-gray-200 text-left">Dealership Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Business Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Contact Person</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Phone</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Email</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Location</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {dealer.dealership_name ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {dealer.business_name ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {dealer.contact_person ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {dealer.phone_number ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {dealer.email ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {dealer.location ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {dealer.is_active ? 'Active' : 'Inactive'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(dealer)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDealer(dealer.id)}
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
            <DialogTitle>Edit Dealer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditDealer} className="space-y-4">
            <div>
              <Label htmlFor="edit-dealership_name">Dealership Name</Label>
              <Input
                id="edit-dealership_name"
                name="dealership_name"
                value={formData.dealership_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-business_name">Business Name</Label>
              <Input
                id="edit-business_name"
                name="business_name"
                value={formData.business_name}
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
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-contact_person">Contact Person</Label>
              <Input
                id="edit-contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-phone_number">Phone Number</Label>
              <Input
                id="edit-phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-vso">VSO</Label>
              <Input
                id="edit-vso"
                name="vso"
                value={formData.vso}
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