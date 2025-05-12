"use client";

import { useState, useEffect } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { useLoading } from '@/contexts/LoadingContext';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

type VehicleColor = {
  id: string;
  color_name: string;
};

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  vehicleId?: string;
  onSave: () => void;
}

export default function VehicleModal({ isOpen, onClose, mode, vehicleId, onSave }: VehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [colors, setColors] = useState<VehicleColor[]>([]);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { startLoading, stopLoading } = useLoading();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    model_name: '',
    model_year: new Date().getFullYear(),
    transmission: 'AT',
    fuel_type: '',
    engine_capacity: '',
    body_type: '',
    seating_capacity: 5,
    stock_quantity: 0,
    monthly_installment_estimate: 0,
    color_options: [] as string[],
    is_active: true,
  });

  useEffect(() => {
    if (mode === 'edit' && vehicleId) {
      fetchVehicle();
    }
    fetchColors();
  }, [mode, vehicleId]);

  const fetchColors = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_colors')
        .select('id, color_name')
        .order('color_name');

      if (error) throw error;
      setColors(data || []);
    } catch (err) {
      console.error('Error fetching colors:', err);
    }
  };

  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();

      if (error) throw error;
      setFormData(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (colorId: string) => {
    setFormData(prev => ({
      ...prev,
      color_options: prev.color_options.includes(colorId)
        ? prev.color_options.filter(id => id !== colorId)
        : [...prev.color_options, colorId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startLoading();

    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('vehicles')
          .insert([formData]);

        if (error) throw error;
      } else {
        console.log('Updating vehicle with data:', {
          id: vehicleId,
          ...formData
        });
        
        const { error } = await supabase
          .from('vehicles')
          .update(formData)
          .eq('id', vehicleId)
          .select()

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving vehicle:', err);
      setError(err.message || 'Failed to save vehicle');
    } finally {
      stopLoading();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'add' ? 'Add New Vehicle' : 'Edit Vehicle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                value={formData.model_year || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, model_year: parseInt(e.target.value) || 0 }))}
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
                  <SelectItem value="AT">Automatic</SelectItem>
                  <SelectItem value="MT">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_type" className="text-foreground">Fuel Type</Label>
              <Input
                id="fuel_type"
                value={formData.fuel_type}
                onChange={(e) => setFormData(prev => ({ ...prev, fuel_type: e.target.value }))}
                className="bg-background text-foreground border-border"
                required
              />
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
              <Label htmlFor="body_type" className="text-foreground">Body Type</Label>
              <Input
                id="body_type"
                value={formData.body_type}
                onChange={(e) => setFormData(prev => ({ ...prev, body_type: e.target.value }))}
                className="bg-background text-foreground border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seating_capacity" className="text-foreground">Seating Capacity</Label>
              <Input
                id="seating_capacity"
                type="number"
                value={formData.seating_capacity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, seating_capacity: parseInt(e.target.value) || 0 }))}
                className="bg-background text-foreground border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity" className="text-foreground">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                className="bg-background text-foreground border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_installment_estimate" className="text-foreground">Monthly Installment Estimate</Label>
              <Input
                id="monthly_installment_estimate"
                type="number"
                value={formData.monthly_installment_estimate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, monthly_installment_estimate: parseFloat(e.target.value) || 0 }))}
                className="bg-background text-foreground border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Color Options</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {formData.color_options.length > 0
                      ? `${formData.color_options.length} colors selected`
                      : "Select colors"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search colors..." />
                    <CommandList>
                      <CommandEmpty>No color found.</CommandEmpty>
                      <CommandGroup>
                        {colors.map((color) => (
                          <CommandItem
                            key={color.id}
                            value={color.color_name}
                            onSelect={() => {
                              handleColorSelect(color.id);
                            }}
                          >
                            <div className="flex items-center">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.color_options.includes(color.id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span>{color.color_name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.color_options.map((colorId) => {
                  const color = colors.find(c => c.id === colorId);
                  return color ? (
                    <Badge key={colorId} variant="secondary">
                      {color.color_name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active" className="text-foreground">Active</Label>
            </div>
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
            <Button type="submit">
              {mode === 'add' ? 'Add Vehicle' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 