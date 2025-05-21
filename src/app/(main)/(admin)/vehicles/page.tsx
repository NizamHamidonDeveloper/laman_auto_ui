'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabase.from('Vehicle').select('*');
      setVehicles(data || []);
    };
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('Vehicles').insert([{ brand, model }]);
    if (error) setError(error.message);
    else {
      setBrand('');
      setModel('');
      setError(null);
      const { data } = await supabase.from('Vehicle').select('*');
      setVehicles(data || []);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    const { error } = await supabase.from('Vehicle').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      const { data } = await supabase.from('Vehicle').select('*');
      setVehicles(data || []);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Vehicle Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddVehicle} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Vehicle
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">ID</th>
            <th className="py-2">Brand</th>
            <th className="py-2">Model</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td className="py-2">{vehicle.id}</td>
              <td className="py-2">{vehicle.brand}</td>
              <td className="py-2">{vehicle.model}</td>
              <td className="py-2">
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 