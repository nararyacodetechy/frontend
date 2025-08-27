// app/my-page/user/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye } from 'lucide-react';
import { getUserOrders, createOrder } from '@/services/userOrderService';
import { Order } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import CustomAlert from '@/components/general/CustomAlert';

export default function UserOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    orderName: '',
    projectType: '',
    projectDetail: '',
    reference: '',
    image: '',
    imgIdOrder: '',
    status: 'under-review',
    paymentMethod: 'bank_transfer',
    paymentProof: '',
    budgetPrice: '0',
    designPreference: { color: '', style: '' },
    totalPriceFeatures: '0',
    totalPriceFinal: '0',
    pricingStatus: 'negotiating',
    paymentTerms: 'installments',
    paymentStatus: 'pending',
    features: [],
    pricingProposals: [],
    onboarding: { status: 'initial', analysisNotes: '', meetings: [] },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'alert' as 'alert' | 'confirm',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await getUserOrders();
      if (response.error) {
        setError(response.error);
      } else {
        setOrders(response.data || []);
        setFilteredOrders(response.data || []);
      }
      setLoading(true);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (order) =>
          order.orderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.projectType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, orders]);

  const handleCreateOrder = async () => {
    setLoading(true);
    const response = await createOrder(newOrder);
    if (response.data) {
      setOrders([...orders, response.data]);
      setFilteredOrders([...orders, response.data]);
      setShowCreateForm(false);
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Success',
        message: 'Order created successfully!',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    } else {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Error',
        message: response.error || 'Failed to create order',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    }
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('designPreference.')) {
      const key = name.split('.')[1] as 'color' | 'style';
      setNewOrder((prev) => ({
        ...prev,
        designPreference: { ...prev.designPreference!, [key]: value },
      }));
    } else if (name.includes('onboarding.')) {
      const key = name.split('.')[1] as 'status' | 'analysisNotes';
      setNewOrder((prev) => ({
        ...prev,
        onboarding: { ...prev.onboarding!, [key]: value },
      }));
    } else {
      setNewOrder((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-4 p-6">
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
      <h1 className="text-2xl font-semibold">My Orders</h1>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Create Order Form */}
      {showCreateForm ? (
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Create New Order</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1">Order Name</label>
              <input
                type="text"
                name="orderName"
                value={newOrder.orderName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1">Project Type</label>
              <select
                name="projectType"
                value={newOrder.projectType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select project type</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1">Project Detail</label>
              <textarea
                name="projectDetail"
                value={newOrder.projectDetail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1">Reference</label>
              <input
                type="url"
                name="reference"
                value={newOrder.reference}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewOrder((prev) => ({ ...prev, image: file.name }));
                  }
                }}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1">Budget Price</label>
              <input
                type="number"
                name="budgetPrice"
                value={newOrder.budgetPrice}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1">Design Preference Color</label>
              <input
                type="text"
                name="designPreference.color"
                value={newOrder.designPreference?.color}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1">Design Preference Style</label>
              <input
                type="text"
                name="designPreference.style"
                value={newOrder.designPreference?.style}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Simplified fields for demo; add more as needed */}
          </div>
          <div className="col-span-2 flex gap-4 mt-4">
            <button
              onClick={handleCreateOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Order
        </button>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search order..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredOrders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-300 rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between gap-4"
        >
          <div className="flex flex-col gap-2">
            <p className="text-lg font-medium">{order.orderName}</p>
            <p className="text-sm text-gray-500">No. Order: {order.orderNumber}</p>
            <p className="text-sm text-gray-500">Jenis: {order.projectType}</p>
            <p className="text-sm text-gray-500">Detail: {order.projectDetail}</p>
            <p className="text-sm text-gray-500">Status: {order.status}</p>
          </div>
          <div className="flex justify-between items-center min-w-[180px] h-full gap-2">
            <a href={`/my-page/user/orders/${order.id}`}>
              <button className="flex items-center gap-1 px-2 py-1.5 text-sm border border-gray-400 rounded hover:bg-gray-100">
                <Eye className="w-4 h-4" />
              </button>
            </a>
            <select
              value={order.status}
              disabled
              className="border border-gray-400 px-2 py-1 text-sm rounded h-full bg-gray-100 text-gray-500"
            >
              <option value="under-review">Under Review</option>
              <option value="waiting">Waiting</option>
              <option value="analysis-finished">Analysis Finished</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}