// src/components/user/OrderDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import { fetchOrderById } from '@/services/userOrderService';
import CustomAlert from '@/components/general/CustomAlert';
import { FileText, Calendar, DollarSign, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
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

  useEffect(() => {
    const loadOrder = async () => {
      if (typeof id !== 'string') return;
      setLoading(true);
      try {
        const response = await fetchOrderById(id);
        if (response.data) {
          setOrder(response.data);
        } else {
          setAlertConfig({
            isOpen: true,
            type: 'alert',
            title: 'Error',
            message: 'Failed to load order details.',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: () => {
              setAlertConfig((prev) => ({ ...prev, isOpen: false }));
              router.push('/my-page/user/orders');
            },
            onCancel: () => {},
          });
        }
      } catch (error) {
        setAlertConfig({
          isOpen: true,
          type: 'alert',
          title: 'Error',
          message: 'Failed to load order details. Please try again.',
          confirmText: 'OK',
          cancelText: '',
          onConfirm: () => {
            setAlertConfig((prev) => ({ ...prev, isOpen: false }));
            router.push('/my-page/user/orders');
          },
          onCancel: () => {},
        });
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id, router]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!order) {
    return null;
  }

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
      <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
            <FileText size={18} className="text-gray-500" />
            {order.orderName}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status === 'under-review' && 'Under Review'}
            {order.status === 'waiting' && 'Waiting'}
            {order.status === 'analysis-finished' && 'Analysis Finished'}
            {order.status === 'completed' && 'Completed'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <strong>Order Number:</strong> {order.orderNumber}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <strong>Project Type:</strong> {order.projectType}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <strong>Project Detail:</strong> {order.projectDetail}
            </p>
            {order.reference && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <LinkIcon size={16} className="text-gray-500" />
                <strong>Reference:</strong>{' '}
                <a href={order.reference} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {order.reference}
                </a>
              </p>
            )}
            {order.image && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <ImageIcon size={16} className="text-gray-500" />
                <strong>Image:</strong>{' '}
                <a href={order.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Image
                </a>
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <DollarSign size={16} className="text-gray-500" />
              <strong>Budget:</strong> Rp {Number(order.budgetPrice).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <DollarSign size={16} className="text-gray-500" />
              <strong>Total Price (Final):</strong> Rp {Number(order.totalPriceFinal).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <strong>Payment Method:</strong> {order.paymentMethod || 'Not set'}
            </p>
            {order.paymentProof && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <strong>Payment Proof:</strong>{' '}
                <a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Proof
                </a>
              </p>
            )}
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <strong>Design Preference:</strong> {order.designPreference?.color || 'N/A'}, {order.designPreference?.style || 'N/A'}
            </p>
          </div>
        </div>
        {order.features.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
            <ul className="space-y-2">
              {order.features.map((feature) => (
                <li key={feature.id} className="border border-gray-200 rounded-md p-3 text-sm">
                  <p><strong>{feature.name}</strong> - Rp {Number(feature.price).toLocaleString()} ({feature.duration})</p>
                  <p>{feature.function}</p>
                  {feature.requirements?.length > 0 && (
                    <ul className="ml-4 list-disc text-xs text-gray-600">
                      {feature.requirements.map((req) => (
                        <li key={req.id}>{req.title}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => router.push('/my-page/user/orders')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
}