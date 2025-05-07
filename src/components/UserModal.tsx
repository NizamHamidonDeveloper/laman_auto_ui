"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'add';
  userId?: string;
  onSave?: (user: Partial<User>) => void;
};

export default function UserModal({ isOpen, onClose, mode, userId, onSave }: UserModalProps) {
  const [user, setUser] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'add');
  const supabase = createClient();

  console.log('Modal Props:', { isOpen, mode, userId });
  console.log('Current User State:', user);
  console.log('Editing State:', isEditing);

  useEffect(() => {
    if (isOpen && userId && mode !== 'add') {
      console.log('Fetching user data for ID:', userId);
      fetchUser();
    } else if (mode === 'add') {
      console.log('Setting up new user form');
      setUser({});
    }
  }, [isOpen, userId, mode]);

  useEffect(() => {
    if (!isOpen) {
      console.log('Modal closed, resetting states');
      setUser({});
      setIsLoading(false);
      setError(null);
      setIsEditing(mode === 'edit' || mode === 'add');
    }
  }, [isOpen, mode]);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      console.log('Fetched user data:', data);
      setUser(data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Saving user data:', user);
    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('users')
          .insert([user]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('users')
          .update(user)
          .eq('id', userId);
        if (error) throw error;
      }
      console.log('User saved successfully');
      onSave?.(user);
      onClose();
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('Field changed:', { name, value });
    setUser(prev => {
      const newUser = { ...prev, [name]: value };
      console.log('Updated user state:', newUser);
      return newUser;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        console.log('Modal closing');
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New User' : 'User Details'}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={user.email || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={user.name || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={user.phone || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={user.address || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          {mode === 'view' && (
            <Button
              onClick={() => {
                console.log('Edit button clicked');
                setIsEditing(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit
            </Button>
          )}
          {(mode === 'edit' || isEditing) && (
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {mode === 'add' ? 'Create' : 'Update'}
            </Button>
          )}
          <Button
            onClick={() => {
              console.log('Close button clicked');
              onClose();
            }}
            variant="outline"
            disabled={isLoading}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 