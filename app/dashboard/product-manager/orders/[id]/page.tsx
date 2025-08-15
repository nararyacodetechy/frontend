'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById, addFeature, updateFeature, deleteFeature, addRequirement, updateRequirement, deleteRequirement } from '@/services/productManagerService';
import { Order } from '@/types/order';
import { Feature, RequirementItem } from '@/types/feature';
import CustomAlert from '@/components/general/CustomAlert';
import InfoClient from '@/components/order/InfoClient';
import InfoOrder from '@/components/order/InfoOrder';
import Onboarding from '@/components/order/Onboarding';
import AddFeature from '@/components/order/AddFeature';
import ListFeatures from '@/components/order/ListFeatures';
import PricingAndPayment from '@/components/order/PricingAndPayment';
import { useAuth } from '@/context/AuthContext';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<Order | null>(null);
  const [editFeature, setEditFeature] = useState<Feature | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newFeature, setNewFeature] = useState<Feature>({
    id: '',
    orderId: id as string,
    name: '',
    function: '',
    price: 0,
    duration: '',
    approvalStatus: 'draft',
    requirements: [],
    isMarkedForDiscussion: false,
    discussionNote: '',
    discussionStatus: 'open',
    createdAt: '',
    updatedAt: '',
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
    confirmText: 'Sure',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(id as string);
        setData(response.data || null);
        if (response.data) {
          const initialDiscussionStatus = response.data.features.reduce(
            (acc, feature) => ({
              ...acc,
              [feature.id]: feature.discussionStatus || 'open',
            }),
            {}
          );
          setDiscussionStatus(initialDiscussionStatus);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  }, [id]);

  const handleAddFeature = async () => {
    try {
      const response = await addFeature(id as string, { ...newFeature, id: undefined });
      setData((prev) => ({
        ...prev!,
        features: [...(prev?.features || []), response.data!],
      }));
      setNewFeature({
        id: '',
        orderId: id as string,
        name: '',
        function: '',
        price: 0,
        duration: '',
        approvalStatus: 'draft',
        requirements: [],
        isMarkedForDiscussion: false,
        discussionNote: '',
        discussionStatus: 'open',
        createdAt: '',
        updatedAt: '',
        tasks: [],
      });
    } catch (error) {
      console.error('Error adding feature:', error);
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
      title: feature.approvalStatus === 'draft' ? 'Ajukan Fitur' : 'Batalkan Pengajuan',
      message:
        feature.approvalStatus === 'draft'
          ? 'Yakin ingin mengajukan fitur ini ke klien?'
          : 'Yakin ingin membatalkan pengajuan fitur ini?',
      confirmText: feature.approvalStatus === 'draft' ? 'Ajukan' : 'Batalkan',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          const response = await updateFeature(featureId, { ...feature, approvalStatus: newStatus });
          setData((prev) => ({
            ...prev!,
            features: prev!.features.map((f) =>
              f.id === featureId ? response.data! : f
            ),
          }));
          setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error updating feature:', error);
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
        features: data.features.map((f) =>
          f.id === editFeature.id ? response.data! : f
        ),
      });
      setShowEditModal(false);
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Berhasil',
        message: 'Permintaan perubahan fitur telah dikirimkan ke klien.',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    } catch (error) {
      console.error('Error updating feature:', error);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    const feature = data?.features.find((f) => f.id === featureId);
    if (!feature) return;

    if (feature.approvalStatus === 'draft') {
      setAlertConfig({
        isOpen: true,
        type: 'confirm',
        title: 'Hapus Fitur',
        message: 'Yakin ingin menghapus fitur ini?',
        onConfirm: async () => {
          try {
            await deleteFeature(featureId);
            setData((prev) => ({
              ...prev!,
              features: prev!.features.filter((f) => f.id !== featureId),
            }));
            setAlertConfig((prev) => ({ ...prev, isOpen: false }));
          } catch (error) {
            console.error('Error deleting feature:', error);
          }
        },
        onCancel: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
      });
    } else {
      setAlertConfig({
        isOpen: true,
        type: 'confirm',
        title: 'Ajukan Penghapusan',
        message: 'Fitur ini sudah diajukan atau disetujui.\n\nIngin mengajukan permintaan penghapusan fitur ke klien?',
        onConfirm: async () => {
          try {
            const response = await updateFeature(featureId, { ...feature, deletionRequest: true });
            setData((prev) => ({
              ...prev!,
              features: prev!.features.map((f) =>
                f.id === featureId ? response.data! : f
              ),
            }));
            setAlertConfig({
              isOpen: true,
              type: 'alert',
              title: 'Pengajuan Dikirim',
              message: 'Permintaan penghapusan telah diajukan ke klien.',
              onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
              onCancel: () => {},
            });
          } catch (error) {
            console.error('Error requesting feature deletion:', error);
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
          f.id === featureId
            ? { ...f, requirements: [...(f.requirements || []), response.data!] }
            : f
        ),
      }));
    } catch (error) {
      console.error('Error adding requirement:', error);
    }
  };

  const handleDeleteRequirement = async (featureId: string, requirementId: string) => {
    try {
      await deleteRequirement(requirementId);
      setData((prev) => ({
        ...prev!,
        features: prev!.features.map((f) =>
          f.id === featureId
            ? { ...f, requirements: f.requirements?.filter((r) => r.id !== requirementId) }
            : f
        ),
      }));
    } catch (error) {
      console.error('Error deleting requirement:', error);
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
      const response = await updateRequirement(editingRequirement.requirementId, { title: editRequirementValue, status: 'pending' });
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
      console.error('Error updating requirement:', error);
    }
  };

  if (!data) {
    return <div className="p-6">Order tidak ditemukan.</div>;
  }

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
            <h2 className="text-lg text-gray-700 font-semibold mb-4">Edit Fitur</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nama fitur"
                className="border border-gray-400 px-3 py-2 rounded"
                value={editFeature.name}
                onChange={(e) => setEditFeature({ ...editFeature, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Fungsi"
                className="border border-gray-400 px-3 py-2 rounded"
                value={editFeature.function}
                onChange={(e) => setEditFeature({ ...editFeature, function: e.target.value })}
              />
              <input
                type="number"
                placeholder="Harga"
                className="border border-gray-400 px-3 py-2 rounded"
                value={editFeature.price}
                onChange={(e) => setEditFeature({ ...editFeature, price: Number(e.target.value) })}
              />
              <input
                type="text"
                placeholder="Durasi"
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
                Batal
              </button>
              <button
                onClick={handleEditSaveFeature}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
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