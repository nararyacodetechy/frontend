// src/components/user/OrderList.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import { fetchOrders } from '@/services/userOrderService';
import CustomAlert from '@/components/general/CustomAlert';
import { Search, Filter, FileText, DollarSign, Calendar } from 'lucide-react';

export default function OrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'under-review' | 'waiting' | 'analysis-finished' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
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
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await fetchOrders();
        if (response.data) {
          setOrders(response.data);
          setFilteredOrders(response.data);
        } else {
          setAlertConfig({
            isOpen: true,
            type: 'alert',
            title: 'Error',
            message: 'Failed to load orders.',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
            onCancel: () => {},
          });
        }
      } catch (error) {
        setAlertConfig({
          isOpen: true,
          type: 'alert',
          title: 'Error',
          message: 'Failed to load orders. Please try again.',
          confirmText: 'OK',
          cancelText: '',
          onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
          onCancel: () => {},
        });
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    const filtered = orders
      .filter((order) =>
        statusFilter === 'all' ? true : order.status === statusFilter
      )
      .filter((order) =>
        order.orderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.projectType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  const handleViewDetails = (id: string) => {
    router.push(`/my-page/user/orders/${id}`);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under-review':
        return 'bg-blue-100 text-blue-700';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700';
      case 'analysis-finished':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <h2 className="text-2xl font-semibold text-gray-800">My Orders</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, number, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm focus:outline-none bg-transparent"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            <option value="all">All</option>
            <option value="under-review">Under Review</option>
            <option value="waiting">Waiting</option>
            <option value="analysis-finished">Analysis Finished</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders found.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <ul className="divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <li key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <FileText size={14} className="text-gray-500" />
                      {order.orderName}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <FileText size={12} className="text-gray-500" />
                      Order Number: {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <Calendar size={12} className="text-gray-500" />
                      Project Type: {order.projectType}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <DollarSign size={12} className="text-gray-500" />
                      Budget: Rp {Number(order.budgetPrice).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'under-review' && 'Under Review'}
                      {order.status === 'waiting' && 'Waiting'}
                      {order.status === 'analysis-finished' && 'Analysis Finished'}
                      {order.status === 'completed' && 'Completed'}
                    </span>
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => router.push('/my-page/user/orders/create')}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
      >
        <PlusCircle size={16} />
        Create New Order
      </button>
    </div>
  );
}