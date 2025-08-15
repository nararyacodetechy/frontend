'use client';

import { Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getOrders, updateOrder } from '@/services/productManagerService';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/order';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const filteredProjects = orders.filter(
    (p) =>
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await updateOrder(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? response.data || order : order
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Daftar Order Klien</h1>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search order..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredProjects.map((order) => (
        <div
          key={order.id}
          className="border border-gray-300 rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <img
              src={order.image || '/images/no-picture-order.svg'}
              alt={order.image}
              onError={(e) => {
                e.currentTarget.src = '/images/no-picture-order.svg';
              }}
              className="w-40 max-h-50 h-full object-cover rounded-md border border-gray-400"
            />
            <div className="space-y-1">
              <p className="text-lg font-medium">{order.clientName}</p>
              <p className="text-sm text-gray-500">ID Klien: {order.client.id}</p>
              <p className="text-sm text-gray-500">No. Order: {order.orderNumber}</p>
              <p className="text-sm font-semibold text-gray-800">{order.orderName}</p>
              <p className="text-sm text-gray-700">
                <strong>Jenis:</strong> {order.projectType}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Detail:</strong> {order.projectDetail}
              </p>
              <p className="text-sm text-blue-600 underline">
                <a href={order.reference} target="_blank">
                  Referensi
                </a>
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center min-w-[180px] h-full gap-2">
            <div className="self-end">
              <Link href={`/dashboard/${user.activeRole}/orders/${order.id}`}>
                <button className="flex items-center gap-1 px-2 py-1.5 text-sm border border-gray-400 rounded hover:bg-gray-100">
                  <Eye className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
              className="border border-gray-400 px-2 py-1 text-sm rounded h-full"
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