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

interface Brand {
  id: string;
  name: string | null;
  logo_url: string | null;
  description: string | null;
  is_active: boolean | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  headquarters: string | null;
  founded_year: number | null;
}

export default function BrandManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    description: '',
    is_active: true,
    website: '',
    contact_email: '',
    contact_phone: '',
    headquarters: '',
    founded_year: '',
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('Brand')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching brands:', error);
      return;
    }

    setBrands(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('Brand').insert([{
      ...formData,
      founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
    }]);

    if (error) {
      console.error('Error adding brand:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      logo_url: '',
      description: '',
      is_active: true,
      website: '',
      contact_email: '',
      contact_phone: '',
      headquarters: '',
      founded_year: '',
    });
    fetchBrands();
  };

  const handleEditBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;

    const { error } = await supabase
      .from('Brand')
      .update({
        ...formData,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
      })
      .eq('id', selectedBrand.id);

    if (error) {
      console.error('Error updating brand:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedBrand(null);
    fetchBrands();
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    const { error } = await supabase.from('Brand').delete().eq('id', id);

    if (error) {
      console.error('Error deleting brand:', error);
      return;
    }

    fetchBrands();
  };

  const openEditDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name ?? '',
      logo_url: brand.logo_url ?? '',
      description: brand.description ?? '',
      is_active: brand.is_active ?? true,
      website: brand.website ?? '',
      contact_email: brand.contact_email ?? '',
      contact_phone: brand.contact_phone ?? '',
      headquarters: brand.headquarters ?? '',
      founded_year: brand.founded_year?.toString() ?? '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Brand Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Brand</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  name="logo_url"
                  value={formData.logo_url}
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
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="headquarters">Headquarters</Label>
                <Input
                  id="headquarters"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  name="founded_year"
                  type="number"
                  value={formData.founded_year}
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
              <Button type="submit">Add Brand</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b border-gray-200 text-left">Brand Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Website</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Contact</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Headquarters</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Founded</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {brand.name ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {brand.website ? (
                    <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {brand.website}
                    </a>
                  ) : '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {brand.contact_email ?? '-'}
                  <br />
                  {brand.contact_phone ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {brand.headquarters ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {brand.founded_year ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {brand.is_active ? 'Active' : 'Inactive'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(brand)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBrand(brand.id)}
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
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBrand} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Brand Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-logo_url">Logo URL</Label>
              <Input
                id="edit-logo_url"
                name="logo_url"
                value={formData.logo_url}
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
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-contact_email">Contact Email</Label>
              <Input
                id="edit-contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-contact_phone">Contact Phone</Label>
              <Input
                id="edit-contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-headquarters">Headquarters</Label>
              <Input
                id="edit-headquarters"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-founded_year">Founded Year</Label>
              <Input
                id="edit-founded_year"
                name="founded_year"
                type="number"
                value={formData.founded_year}
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