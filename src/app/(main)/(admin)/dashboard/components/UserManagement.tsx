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

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  salary: number | null;
  employment_status: string | null;
  employment_details: string | null;
  ic_number: string | null;
  house_ownership_status: string | null;
  residence_duration: string | null;
  marital_status: string | null;
  education_level: string | null;
  number_of_children: number | null;
  company_name: string | null;
  company_address: string | null;
  company_phone: string | null;
  job_title: string | null;
  business_type: string | null;
  employment_start_date: string | null;
  referral_name_1: string | null;
  referral_phone_1: string | null;
  referral_relationship_1: string | null;
  referral_name_2: string | null;
  referral_phone_2: string | null;
  referral_relationship_2: string | null;
  documents_submitted: boolean | null;
  profile_status: string | null;
  phone_verified: boolean | null;
  role: string | null;
  is_profile_complete: boolean | null;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    salary: '',
    employment_status: '',
    employment_details: '',
    ic_number: '',
    house_ownership_status: '',
    residence_duration: '',
    marital_status: '',
    education_level: '',
    number_of_children: '',
    company_name: '',
    company_address: '',
    company_phone: '',
    job_title: '',
    business_type: '',
    employment_start_date: '',
    referral_name_1: '',
    referral_phone_1: '',
    referral_relationship_1: '',
    referral_name_2: '',
    referral_phone_2: '',
    referral_relationship_2: '',
    documents_submitted: false,
    profile_status: '',
    phone_verified: false,
    role: '',
    is_profile_complete: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('User').insert([
      {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        number_of_children: formData.number_of_children ? parseInt(formData.number_of_children) : null,
      },
    ]);

    if (error) {
      console.error('Error adding user:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      salary: '',
      employment_status: '',
      employment_details: '',
      ic_number: '',
      house_ownership_status: '',
      residence_duration: '',
      marital_status: '',
      education_level: '',
      number_of_children: '',
      company_name: '',
      company_address: '',
      company_phone: '',
      job_title: '',
      business_type: '',
      employment_start_date: '',
      referral_name_1: '',
      referral_phone_1: '',
      referral_relationship_1: '',
      referral_name_2: '',
      referral_phone_2: '',
      referral_relationship_2: '',
      documents_submitted: false,
      profile_status: '',
      phone_verified: false,
      role: '',
      is_profile_complete: false,
    });
    fetchUsers();
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const { error } = await supabase
      .from('User')
      .update({
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        number_of_children: formData.number_of_children ? parseInt(formData.number_of_children) : null,
      })
      .eq('id', selectedUser.id);

    if (error) {
      console.error('Error updating user:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const { error } = await supabase.from('User').delete().eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return;
    }

    fetchUsers();
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      address: user.address ?? '',
      salary: user.salary?.toString() ?? '',
      employment_status: user.employment_status ?? '',
      employment_details: user.employment_details ?? '',
      ic_number: user.ic_number ?? '',
      house_ownership_status: user.house_ownership_status ?? '',
      residence_duration: user.residence_duration ?? '',
      marital_status: user.marital_status ?? '',
      education_level: user.education_level ?? '',
      number_of_children: user.number_of_children?.toString() ?? '',
      company_name: user.company_name ?? '',
      company_address: user.company_address ?? '',
      company_phone: user.company_phone ?? '',
      job_title: user.job_title ?? '',
      business_type: user.business_type ?? '',
      employment_start_date: user.employment_start_date ?? '',
      referral_name_1: user.referral_name_1 ?? '',
      referral_phone_1: user.referral_phone_1 ?? '',
      referral_relationship_1: user.referral_relationship_1 ?? '',
      referral_name_2: user.referral_name_2 ?? '',
      referral_phone_2: user.referral_phone_2 ?? '',
      referral_relationship_2: user.referral_relationship_2 ?? '',
      documents_submitted: user.documents_submitted ?? false,
      profile_status: user.profile_status ?? '',
      phone_verified: user.phone_verified ?? false,
      role: user.role ?? '',
      is_profile_complete: user.is_profile_complete ?? false,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
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
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="employment_status">Employment Status</Label>
                <Input
                  id="employment_status"
                  name="employment_status"
                  value={formData.employment_status}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="employment_details">Employment Details</Label>
                <Input
                  id="employment_details"
                  name="employment_details"
                  value={formData.employment_details}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="ic_number">IC Number</Label>
                <Input
                  id="ic_number"
                  name="ic_number"
                  value={formData.ic_number}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="house_ownership_status">House Ownership Status</Label>
                <Input
                  id="house_ownership_status"
                  name="house_ownership_status"
                  value={formData.house_ownership_status}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="residence_duration">Residence Duration</Label>
                <Input
                  id="residence_duration"
                  name="residence_duration"
                  value={formData.residence_duration}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="marital_status">Marital Status</Label>
                <Input
                  id="marital_status"
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="education_level">Education Level</Label>
                <Input
                  id="education_level"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="number_of_children">Number of Children</Label>
                <Input
                  id="number_of_children"
                  name="number_of_children"
                  type="number"
                  value={formData.number_of_children}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="company_address">Company Address</Label>
                <Input
                  id="company_address"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="company_phone">Company Phone</Label>
                <Input
                  id="company_phone"
                  name="company_phone"
                  value={formData.company_phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="business_type">Business Type</Label>
                <Input
                  id="business_type"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="employment_start_date">Employment Start Date</Label>
                <Input
                  id="employment_start_date"
                  name="employment_start_date"
                  type="date"
                  value={formData.employment_start_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="referral_name_1">Referral Name 1</Label>
                <Input
                  id="referral_name_1"
                  name="referral_name_1"
                  value={formData.referral_name_1}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="referral_phone_1">Referral Phone 1</Label>
                <Input
                  id="referral_phone_1"
                  name="referral_phone_1"
                  value={formData.referral_phone_1}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="referral_relationship_1">Referral Relationship 1</Label>
                <Input
                  id="referral_relationship_1"
                  name="referral_relationship_1"
                  value={formData.referral_relationship_1}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="referral_name_2">Referral Name 2</Label>
                <Input
                  id="referral_name_2"
                  name="referral_name_2"
                  value={formData.referral_name_2}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="referral_phone_2">Referral Phone 2</Label>
                <Input
                  id="referral_phone_2"
                  name="referral_phone_2"
                  value={formData.referral_phone_2}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="referral_relationship_2">Referral Relationship 2</Label>
                <Input
                  id="referral_relationship_2"
                  name="referral_relationship_2"
                  value={formData.referral_relationship_2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="documents_submitted"
                  name="documents_submitted"
                  checked={formData.documents_submitted}
                  onChange={handleInputChange}
                />
                <Label htmlFor="documents_submitted">Documents Submitted</Label>
              </div>
              <div>
                <Label htmlFor="profile_status">Profile Status</Label>
                <Input
                  id="profile_status"
                  name="profile_status"
                  value={formData.profile_status}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="phone_verified"
                  name="phone_verified"
                  checked={formData.phone_verified}
                  onChange={handleInputChange}
                />
                <Label htmlFor="phone_verified">Phone Verified</Label>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_profile_complete"
                  name="is_profile_complete"
                  checked={formData.is_profile_complete}
                  onChange={handleInputChange}
                />
                <Label htmlFor="is_profile_complete">Profile Complete</Label>
              </div>
              <Button type="submit">Add User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b border-gray-200 text-left">Full Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Email</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Phone</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Role</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Profile Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">{user.full_name ?? '-'}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.email ?? '-'}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.phone ?? '-'}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.role ?? '-'}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.profile_status ?? '-'}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
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
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
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
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="employment_status">Employment Status</Label>
              <Input
                id="employment_status"
                name="employment_status"
                value={formData.employment_status}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="employment_details">Employment Details</Label>
              <Input
                id="employment_details"
                name="employment_details"
                value={formData.employment_details}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="ic_number">IC Number</Label>
              <Input
                id="ic_number"
                name="ic_number"
                value={formData.ic_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="house_ownership_status">House Ownership Status</Label>
              <Input
                id="house_ownership_status"
                name="house_ownership_status"
                value={formData.house_ownership_status}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="residence_duration">Residence Duration</Label>
              <Input
                id="residence_duration"
                name="residence_duration"
                value={formData.residence_duration}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <Input
                id="marital_status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="education_level">Education Level</Label>
              <Input
                id="education_level"
                name="education_level"
                value={formData.education_level}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="number_of_children">Number of Children</Label>
              <Input
                id="number_of_children"
                name="number_of_children"
                type="number"
                value={formData.number_of_children}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="company_address">Company Address</Label>
              <Input
                id="company_address"
                name="company_address"
                value={formData.company_address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="company_phone">Company Phone</Label>
              <Input
                id="company_phone"
                name="company_phone"
                value={formData.company_phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="business_type">Business Type</Label>
              <Input
                id="business_type"
                name="business_type"
                value={formData.business_type}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="employment_start_date">Employment Start Date</Label>
              <Input
                id="employment_start_date"
                name="employment_start_date"
                type="date"
                value={formData.employment_start_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="referral_name_1">Referral Name 1</Label>
              <Input
                id="referral_name_1"
                name="referral_name_1"
                value={formData.referral_name_1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="referral_phone_1">Referral Phone 1</Label>
              <Input
                id="referral_phone_1"
                name="referral_phone_1"
                value={formData.referral_phone_1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="referral_relationship_1">Referral Relationship 1</Label>
              <Input
                id="referral_relationship_1"
                name="referral_relationship_1"
                value={formData.referral_relationship_1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="referral_name_2">Referral Name 2</Label>
              <Input
                id="referral_name_2"
                name="referral_name_2"
                value={formData.referral_name_2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="referral_phone_2">Referral Phone 2</Label>
              <Input
                id="referral_phone_2"
                name="referral_phone_2"
                value={formData.referral_phone_2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="referral_relationship_2">Referral Relationship 2</Label>
              <Input
                id="referral_relationship_2"
                name="referral_relationship_2"
                value={formData.referral_relationship_2}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="documents_submitted"
                name="documents_submitted"
                checked={formData.documents_submitted}
                onChange={handleInputChange}
              />
              <Label htmlFor="documents_submitted">Documents Submitted</Label>
            </div>
            <div>
              <Label htmlFor="profile_status">Profile Status</Label>
              <Input
                id="profile_status"
                name="profile_status"
                value={formData.profile_status}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="phone_verified"
                name="phone_verified"
                checked={formData.phone_verified}
                onChange={handleInputChange}
              />
              <Label htmlFor="phone_verified">Phone Verified</Label>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_profile_complete"
                name="is_profile_complete"
                checked={formData.is_profile_complete}
                onChange={handleInputChange}
              />
              <Label htmlFor="is_profile_complete">Profile Complete</Label>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 