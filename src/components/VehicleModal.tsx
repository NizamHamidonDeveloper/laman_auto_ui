"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleModal({ isOpen, onClose }: VehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    model_name: '',
    model_year: new Date().getFullYear(),
    transmission: '',
    fuel_type: '',
    engine_capacity: '',
    seating_capacity: 5,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('vehicles')
        .insert([formData]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model_name" className="text-foreground">Model Name</Label>
            <Input
              id="model_name"
              value={formData.model_name}
              onChange={(e) => setFormData(prev => ({ ...prev, model_name: e.target.value }))}
              className="bg-background text-foreground border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model_year" className="text-foreground">Model Year</Label>
            <Input
              id="model_year"
              type="number"
              value={formData.model_year}
              onChange={(e) => setFormData(prev => ({ ...prev, model_year: parseInt(e.target.value) }))}
              className="bg-background text-foreground border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transmission" className="text-foreground">Transmission</Label>
            <Select
              value={formData.transmission}
              onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
            >
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuel_type" className="text-foreground">Fuel Type</Label>
            <Select
              value={formData.fuel_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}
            >
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engine_capacity" className="text-foreground">Engine Capacity</Label>
            <Input
              id="engine_capacity"
              value={formData.engine_capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, engine_capacity: e.target.value }))}
              className="bg-background text-foreground border-border"
              placeholder="e.g., 1.5L"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seating_capacity" className="text-foreground">Seating Capacity</Label>
            <Input
              id="seating_capacity"
              type="number"
              value={formData.seating_capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, seating_capacity: parseInt(e.target.value) }))}
              className="bg-background text-foreground border-border"
              required
            />
          </div>

          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 