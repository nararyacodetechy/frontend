// src/components/dashboard/order/AddFeature.tsx
'use client';

import { Feature } from '@/types/order';
import { PlusCircle } from 'lucide-react';

interface AddFeatureProps {
  newFeature: Partial<Feature>;
  setNewFeature: (feature: Partial<Feature>) => void;
  handleAddFeature: () => void;
}

export default function AddFeature({ newFeature, setNewFeature, handleAddFeature }: AddFeatureProps) {
  const isValid = newFeature.name && newFeature.function && newFeature.price && newFeature.duration;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 text-md">🛠️ Tambah Fitur Baru</h3>
      <div className="grid md:grid-cols-5 gap-3">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-1">Nama Fitur</label>
          <input
            type="text"
            placeholder="Contoh: Checkout"
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
            value={newFeature.name || ''}
            onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-1">Tujuan</label>
          <input
            type="text"
            placeholder="Contoh: Order handling"
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
            value={newFeature.function || ''}
            onChange={(e) => setNewFeature({ ...newFeature, function: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-1">Harga (Rp)</label>
          <input
            type="number"
            placeholder="150000"
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
            value={newFeature.price || ''}
            onChange={(e) => setNewFeature({ ...newFeature, price: e.target.value })}
            required
            min="0"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-1">Durasi</label>
          <input
            type="text"
            placeholder="3 hari"
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
            value={newFeature.duration || ''}
            onChange={(e) => setNewFeature({ ...newFeature, duration: e.target.value })}
            required
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleAddFeature}
            className={`w-full px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
              isValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isValid}
          >
            <PlusCircle size={16} />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}