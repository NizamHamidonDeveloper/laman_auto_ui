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

interface LoanApplication {
  id: string;
  user_id: string;
  loan_amount: number | null;
  loan_type: string | null;
  loan_application_status: string | null;
  application_date: string | null;
  documents_submitted: boolean | null;
}

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
}

export default function LoanApplicationsManagement() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    loan_amount: '',
    loan_type: '',
    loan_application_status: '',
    application_date: '',
    documents_submitted: false,
  });

  useEffect(() => {
    fetchApplications();
    fetchUsers();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('LoanApplications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching loan applications:', error);
      return;
    }

    setApplications(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('User')
      .select('id, full_name, email');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('LoanApplications').insert([
      {
        ...formData,
        loan_amount: formData.loan_amount ? parseFloat(formData.loan_amount) : null,
      },
    ]);

    if (error) {
      console.error('Error adding loan application:', error);
      return;
    }

    setIsAddDialogOpen(false);
    setFormData({
      user_id: '',
      loan_amount: '',
      loan_type: '',
      loan_application_status: '',
      application_date: '',
      documents_submitted: false,
    });
    fetchApplications();
  };

  const handleEditApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication) return;

    const { error } = await supabase
      .from('LoanApplications')
      .update({
        ...formData,
        loan_amount: formData.loan_amount ? parseFloat(formData.loan_amount) : null,
      })
      .eq('id', selectedApplication.id);

    if (error) {
      console.error('Error updating loan application:', error);
      return;
    }

    setIsEditDialogOpen(false);
    setSelectedApplication(null);
    fetchApplications();
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this loan application?')) return;

    const { error } = await supabase.from('LoanApplications').delete().eq('id', id);

    if (error) {
      console.error('Error deleting loan application:', error);
      return;
    }

    fetchApplications();
  };

  const openEditDialog = (application: LoanApplication) => {
    setSelectedApplication(application);
    setFormData({
      user_id: application.user_id,
      loan_amount: application.loan_amount?.toString() ?? '',
      loan_type: application.loan_type ?? '',
      loan_application_status: application.loan_application_status ?? '',
      application_date: application.application_date ?? '',
      documents_submitted: application.documents_submitted ?? false,
    });
    setIsEditDialogOpen(true);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.full_name : 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Loan Applications Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Application</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Loan Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddApplication} className="space-y-4">
              <div>
                <Label htmlFor="user_id">User</Label>
                <select
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="loan_amount">Loan Amount</Label>
                <Input
                  id="loan_amount"
                  name="loan_amount"
                  type="number"
                  value={formData.loan_amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="loan_type">Loan Type</Label>
                <Input
                  id="loan_type"
                  name="loan_type"
                  value={formData.loan_type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="loan_application_status">Application Status</Label>
                <Input
                  id="loan_application_status"
                  name="loan_application_status"
                  value={formData.loan_application_status}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="application_date">Application Date</Label>
                <Input
                  id="application_date"
                  name="application_date"
                  type="date"
                  value={formData.application_date}
                  onChange={handleInputChange}
                  required
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
              <Button type="submit">Add Application</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b border-gray-200 text-left">User</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Loan Amount</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Loan Type</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Application Date</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Documents</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {getUserName(application.user_id)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ${application.loan_amount?.toLocaleString() ?? '0'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {application.loan_type ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {application.loan_application_status ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {application.application_date ?? '-'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {application.documents_submitted ? 'Yes' : 'No'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(application)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteApplication(application.id)}
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
            <DialogTitle>Edit Loan Application</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditApplication} className="space-y-4">
            <div>
              <Label htmlFor="edit-user_id">User</Label>
              <select
                id="edit-user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-loan_amount">Loan Amount</Label>
              <Input
                id="edit-loan_amount"
                name="loan_amount"
                type="number"
                value={formData.loan_amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-loan_type">Loan Type</Label>
              <Input
                id="edit-loan_type"
                name="loan_type"
                value={formData.loan_type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-loan_application_status">Application Status</Label>
              <Input
                id="edit-loan_application_status"
                name="loan_application_status"
                value={formData.loan_application_status}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-application_date">Application Date</Label>
              <Input
                id="edit-application_date"
                name="application_date"
                type="date"
                value={formData.application_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-documents_submitted"
                name="documents_submitted"
                checked={formData.documents_submitted}
                onChange={handleInputChange}
              />
              <Label htmlFor="edit-documents_submitted">Documents Submitted</Label>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 