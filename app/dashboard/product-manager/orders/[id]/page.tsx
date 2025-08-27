// app/dashboard/product-manager/orders/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getOrderById,
  addFeature,
  updateFeature,
  deleteFeature,
  addRequirement,
  updateRequirement,
  deleteRequirement,
} from '@/services/productManagerOrderService';
import { Order, Feature } from '@/types/order';
import CustomAlert from '@/components/general/CustomAlert';
import InfoClient from '@/components/dashboard/order/InfoClient';
import InfoOrder from '@/components/dashboard/order/InfoOrder';
import Onboarding from '@/components/dashboard/order/Onboarding';
import AddFeature from '@/components/dashboard/order/AddFeature';
import ListFeatures from '@/components/dashboard/order/ListFeatures';
import PricingAndPayment from '@/components/dashboard/order/PricingAndPayment';
import { useAuth } from '@/context/AuthContext';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editFeature, setEditFeature] = useState<Feature | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newFeature, setNewFeature] = useState<Partial<Feature>>({
    orderId: id as string,
    name: '',
    function: '',
    price: '0',
    duration: '',
    approvalStatus: 'draft',
    requirements: [],
    isMarkedForDiscussion: false,
    discussionNote: '',
    discussionStatus: 'open',
    tasks: [],
  });
  const [newRequirement, setNewRequirement] = useState<{ [key: string]: string }>({});
  const [editingRequirement, setEditingRequirement] = useState<{ featureId: string; requirementId: string } | null>(null);
  const [editRequirementValue, setEditRequirementValue] = useState('');
  const [openRequirements, setOpenRequirements] = useState<{ [key: string]: boolean }>({});
  const [openDiscussionNotes, setOpenDiscussionNotes] = useState<{ [key: string]: boolean }>({});
  const [discussionStatus, setDiscussionStatus] = useState<{ [key: string]: 'open' | 'close' }>({});
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
        const response = await getOrderById(id as string);
        if (response.data) {
          setData(response.data);
          const initialDiscussionStatus = response.data.features.reduce(
            (acc, feature) => ({
              ...acc,
              [feature.id]: feature.discussionStatus || 'open',
            }),
            {}
          );
          setDiscussionStatus(initialDiscussionStatus);
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

  const handleAddFeature = async () => {
    try {
      const response = await addFeature(id as string, newFeature);
      if (response.data) {
        setData((prev) => ({
          ...prev!,
          features: [...(prev?.features || []), response.data!],
        }));
        setNewFeature({
          orderId: id as string,
          name: '',
          function: '',
          price: '0',
          duration: '',
          approvalStatus: 'draft',
          requirements: [],
          isMarkedForDiscussion: false,
          discussionNote: '',
          discussionStatus: 'open',
          tasks: [],
        });
        setAlertConfig({
          isOpen: true,
          type: 'alert',
          title: 'Success',
          message: 'Feature added successfully!',
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
        message: 'Failed to add feature',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    }
  };

  const toggleSubmissionFeature = async (featureId: string) => {
    if (!data) return;
    const feature = data.features.find((f) => f.id === featureId);
    if (!feature) return;

    const newStatus = feature.approvalStatus === 'draft' ? 'waiting' : 'draft';
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: feature.approvalStatus === 'draft' ? 'Submit Feature' : 'Cancel Submission',
      message:
        feature.approvalStatus === 'draft'
          ? 'Are you sure you want to submit this feature to the client?'
          : 'Are you sure you want to cancel this feature submission?',
      confirmText: feature.approvalStatus === 'draft' ? 'Submit' : 'Cancel',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const response = await updateFeature(featureId, { ...feature, approvalStatus: newStatus });
          setData((prev) => ({
            ...prev!,
            features: prev!.features.map((f) => (f.id === featureId ? response.data! : f)),
          }));
          setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          setAlertConfig({
            isOpen: true,
            type: 'alert',
            title: 'Error',
            message: 'Failed to update feature',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
            onCancel: () => {},
          });
        }
      },
      onCancel: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const handleEditFeature = (feature: Feature) => {
    setEditFeature(feature);
    setShowEditModal(true);
  };

  const handleEditSaveFeature = async () => {
    if (!editFeature || !data) return;

    try {
      const response = await updateFeature(editFeature.id, editFeature);
      setData({
        ...data,
        features: data.features.map((f) => (f.id === editFeature.id ? response.data! : f)),
      });
      setShowEditModal(false);
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Success',
        message: 'Feature updated successfully!',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Error',
        message: 'Failed to update feature',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    const feature = data?.features.find((f) => f.id === featureId);
    if (!feature) return;

    if (feature.approvalStatus === 'draft') {
      setAlertConfig({
        isOpen: true,
        type: 'confirm',
        title: 'Delete Feature',
        message: 'Are you sure you want to delete this feature?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          try {
            await deleteFeature(featureId);
            setData((prev) => ({
              ...prev!,
              features: prev!.features.filter((f) => f.id !== featureId),
            }));
            setAlertConfig((prev) => ({ ...prev, isOpen: false }));
          } catch (error) {
            setAlertConfig({
              isOpen: true,
              type: 'alert',
              title: 'Error',
              message: 'Failed to delete feature',
              confirmText: 'OK',
              cancelText: '',
              onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
              onCancel: () => {},
            });
          }
        },
        onCancel: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
      });
    } else {
      setAlertConfig({
        isOpen: true,
        type: 'confirm',
        title: 'Request Deletion',
        message: 'This feature is submitted or approved. Request deletion from the client?',
        confirmText: 'Request',
        cancelText: 'Cancel',
        onConfirm: async () => {
          try {
            const response = await updateFeature(featureId, { ...feature, deletionRequest: true });
            setData((prev) => ({
              ...prev!,
              features: prev!.features.map((f) => (f.id === featureId ? response.data! : f)),
            }));
            setAlertConfig({
              isOpen: true,
              type: 'alert',
              title: 'Request Sent',
              message: 'Deletion request sent to client.',
              confirmText: 'OK',
              cancelText: '',
              onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
              onCancel: () => {},
            });
          } catch (error) {
            setAlertConfig({
              isOpen: true,
              type: 'alert',
              title: 'Error',
              message: 'Failed to request feature deletion',
              confirmText: 'OK',
              cancelText: '',
              onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
              onCancel: () => {},
            });
          }
        },
        onCancel: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  const handleAddRequirement = async (featureId: string, title: string) => {
    if (!title.trim()) return;
    try {
      const response = await addRequirement(featureId, { title, status: 'pending' });
      setData((prev) => ({
        ...prev!,
        features: prev!.features.map((f) =>
          f.id === featureId ? { ...f, requirements: [...(f.requirements || []), response.data!] } : f
        ),
      }));
      setNewRequirement((prev) => ({ ...prev, [featureId]: '' }));
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Error',
        message: 'Failed to add requirement',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    }
  };

  const handleDeleteRequirement = async (featureId: string, requirementId: string) => {
    try {
      await deleteRequirement(requirementId);
      setData((prev) => ({
        ...prev!,
        features: prev!.features.map((f) =>
          f.id === featureId ? { ...f, requirements: f.requirements?.filter((r) => r.id !== requirementId) } : f
        ),
      }));
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Error',
        message: 'Failed to delete requirement',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    }
  };

  const handleEditRequirement = (featureId: string, requirementId: string, currentTitle: string) => {
    const feature = data?.features.find((f) => f.id === featureId);
    if (!feature || feature.approvalStatus !== 'draft') return;
    setEditingRequirement({ featureId, requirementId });
    setEditRequirementValue(currentTitle);
  };

  const handleSaveEditRequirement = async () => {
    if (!editingRequirement) return;
    try {
      const response = await updateRequirement(editingRequirement.requirementId, {
        title: editRequirementValue,
        status: 'pending',
      });
      setData((prev) => ({
        ...prev!,
        features: prev!.features.map((f) =>
          f.id === editingRequirement.featureId
            ? {
                ...f,
                requirements: f.requirements?.map((r) =>
                  r.id === editingRequirement.requirementId ? response.data! : r
                ),
              }
            : f
        ),
      }));
      setEditingRequirement(null);
      setEditRequirementValue('');
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Error',
        message: 'Failed to update requirement',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    }
  };

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

      {showEditModal && editFeature && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-300 shadow-lg relative">
            <h2 className="text-lg text-gray-700 font-semibold mb-4">Edit Feature</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Feature Name"
                className="border border-gray-400 px-3 py-2 rounded"
                value={editFeature.name}
                onChange={(e) => setEditFeature({ ...editFeature, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Function"
                className="border border-gray-400 px-3 py-2 rounded"
                value={editFeature.function}
                onChange={(e) => setEditFeature({ ...editFeature, function: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                className="border border-gray-400 px-3 py-2 rounded"
                value={editFeature.price}
                onChange={(e) => setEditFeature({ ...editFeature, price: e.target.value })}
              />
              <input
                type="text"
                placeholder="Duration"
                className="border border-gray-400 px-3 py-2 rounded"
                value={editFeature.duration}
                onChange={(e) => setEditFeature({ ...editFeature, duration: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSaveFeature}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 p-6">
        <InfoClient data={data} />
        <InfoOrder data={data} />
        <Onboarding data={data} setData={setData} setAlertConfig={setAlertConfig} />
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
          <AddFeature
            newFeature={newFeature}
            setNewFeature={setNewFeature}
            handleAddFeature={handleAddFeature}
          />
          <ListFeatures
            data={data}
            setData={setData}
            toggleSubmissionFeature={toggleSubmissionFeature}
            handleEditFeature={handleEditFeature}
            handleDeleteFeature={handleDeleteFeature}
            openRequirements={openRequirements}
            setOpenRequirements={setOpenRequirements}
            openDiscussionNotes={openDiscussionNotes}
            setOpenDiscussionNotes={setOpenDiscussionNotes}
            discussionStatus={discussionStatus}
            setDiscussionStatus={setDiscussionStatus}
            newRequirement={newRequirement}
            setNewRequirement={setNewRequirement}
            editingRequirement={editingRequirement}
            setEditingRequirement={setEditingRequirement}
            editRequirementValue={editRequirementValue}
            setEditRequirementValue={setEditRequirementValue}
            handleAddRequirement={handleAddRequirement}
            handleDeleteRequirement={handleDeleteRequirement}
            handleEditRequirement={handleEditRequirement}
            handleSaveEditRequirement={handleSaveEditRequirement}
            setAlertConfig={setAlertConfig}
          />
        </div>
        {data.onboarding?.status === 'completed' && (
          <PricingAndPayment data={data} setData={setData} setAlertConfig={setAlertConfig} />
        )}
      </div>
    </>
  );
}