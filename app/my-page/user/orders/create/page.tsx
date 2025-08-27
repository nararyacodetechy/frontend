// app/my-page/user/orders/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/services/userOrderService';
import { Order } from '@/types/order';
import CustomAlert from '@/components/general/CustomAlert';

export default function CreateOrderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Order>>({
    orderName: '',
    projectType: '',
    projectDetail: '',
    reference: '',
    image: '',
    budgetPrice: '0',
    designPreference: { color: '', style: '' },
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('designPreference.')) {
      const key = name.split('.')[1] as 'color' | 'style';
      setFormData((prev) => ({
        ...prev,
        designPreference: { ...prev.designPreference!, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({ ...prev, image: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        // Placeholder for image upload logic
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          body: formDataUpload,
          credentials: 'include',
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url; // Assume backend returns image URL
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const response = await createOrder({
        ...formData,
        image: imageUrl,
        budgetPrice: String(formData.budgetPrice),
      });

      if (response.data) {
        setAlertConfig({
          isOpen: true,
          type: 'alert',
          title: 'Success',
          message: 'Order created successfully!',
          confirmText: 'OK',
          cancelText: '',
          onConfirm: () => {
            setAlertConfig((prev) => ({ ...prev, isOpen: false }));
            router.push('/my-page/user/orders');
          },
          onCancel: () => {},
        });
      } else {
        throw new Error(response.error || 'Failed to create order');
      }
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Error',
        message: 'Failed to create order. Please try again.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <CustomAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
      <h1 className="text-2xl font-semibold">Create New Order</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Order Name</label>
          <input
            type="text"
            name="orderName"
            value={formData.orderName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Type</label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select project type</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Detail</label>
          <textarea
            name="projectDetail"
            value={formData.projectDetail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Reference</label>
          <input
            type="url"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Budget (Rp)</label>
          <input
            type="number"
            name="budgetPrice"
            value={formData.budgetPrice}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Design Color</label>
          <input
            type="text"
            name="designPreference.color"
            value={formData.designPreference?.color}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Design Style</label>
          <input
            type="text"
            name="designPreference.style"
            value={formData.designPreference?.style}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}