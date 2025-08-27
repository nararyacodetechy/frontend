// app/my-page/user/orders/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderDetails } from '@/services/userOrderService';
import { Order } from '@/types/order';
import CustomAlert from '@/components/general/CustomAlert';
import InfoClient from '@/components/dashboard/order/InfoClient';
import InfoOrder from '@/components/dashboard/order/InfoOrder';
import Onboarding from '@/components/dashboard/order/Onboarding';
import ListFeatures from '@/components/dashboard/order/ListFeatures';
import PricingAndPayment from '@/components/dashboard/order/PricingAndPayment';
import { useAuth } from '@/context/AuthContext';

export default function UserOrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await getOrderDetails(id as string);
        if (response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to fetch order');
        }
      } catch (error) {
        setError('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">Order not found.</div>;

  return (
    <>
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
      <div className="space-y-6 p-6">
        <InfoClient data={data} />
        <InfoOrder data={data} />
        <Onboarding data={data} setData={setData} setAlertConfig={setAlertConfig} />
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
          <ListFeatures
            data={data}
            setData={setData}
            toggleSubmissionFeature={() => {}}
            handleEditFeature={() => {}}
            handleDeleteFeature={() => {}}
            openRequirements={{}}
            setOpenRequirements={() => {}}
            openDiscussionNotes={{}}
            setOpenDiscussionNotes={() => {}}
            discussionStatus={{}}
            setDiscussionStatus={() => {}}
            newRequirement={{}}
            setNewRequirement={() => {}}
            editingRequirement={null}
            setEditingRequirement={() => {}}
            editRequirementValue=""
            setEditRequirementValue={() => {}}
            handleAddRequirement={() => {}}
            handleDeleteRequirement={() => {}}
            handleEditRequirement={() => {}}
            handleSaveEditRequirement={() => {}}
            setAlertConfig={setAlertConfig}
            readOnly={true} // Add readOnly prop to disable editing
          />
        </div>
        {data.onboarding?.status === 'completed' && (
          <PricingAndPayment data={data} setData={setData} setAlertConfig={setAlertConfig} />
        )}
      </div>
    </>
  );
}