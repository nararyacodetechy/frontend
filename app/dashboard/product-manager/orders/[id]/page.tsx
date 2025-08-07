'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getOrderById } from '@/services/orderDummyData'
import { Order, Feature } from '@/types/order'
import CustomAlert from '@/components/general/CustomAlert'
import InfoClient from '@/components/order/InfoClient'
import InfoOrder from '@/components/order/InfoOrder'
import AddFeature from '@/components/order/AddFeature'
import ListFeatures from '@/components/order/ListFeatures'

export default function OrderDetailPage() {
    const { id } = useParams()
    const [data, setData] = useState<Order | null>(null)
    const [editFeature, setEditFeature] = useState<Feature | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    
    const [newFeature, setNewFeature] = useState<Feature>({
        id: '',
        name: '',
        function: '',
        price: 0,
        duration: '',
        approvalStatus: 'draft',
        requirements: [],
        isMarkedForDiscussion: false,
        discussionNote: '',
        discussionStatus: 'open',
    })
    
    const [newRequirement, setNewRequirement] = useState<{ [key: string]: string }>({})
    const [editingRequirement, setEditingRequirement] = useState<{ featureId: string; requirementId: string } | null>(null)
    const [editRequirementValue, setEditRequirementValue] = useState('')
    const [openRequirements, setOpenRequirements] = useState<{ [key: string]: boolean }>({})
    const [openDiscussionNotes, setOpenDiscussionNotes] = useState<{ [key: string]: boolean }>({})
    const [discussionStatus, setDiscussionStatus] = useState<{ [key: string]: 'open' | 'resolved' | 'archived' }>({})

    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        type: 'alert' as 'alert' | 'confirm',
        title: '',
        message: '',
        confirmText: 'Sure',
        cancelText: 'Cancel',
        onConfirm: () => {},
        onCancel: () => {},
    })

    useEffect(() => {
        const result = getOrderById(id as string)
        setData(result || null)
        if (result) {
            const initialDiscussionStatus = result.features.reduce((acc, feature) => ({
                ...acc,
                [feature.id]: feature.discussionStatus || 'open',
            }), {});
            setDiscussionStatus(initialDiscussionStatus);
        }
    }, [id])

    const handleAddFeature = () => {
        const newF: Feature = {
            ...newFeature,
            id: crypto.randomUUID(),
            approvalStatus: 'draft',
            requirements: [],
            isMarkedForDiscussion: false,
            discussionNote: '',
            discussionStatus: 'open',
        }
        setData(prev => ({
            ...prev!,
            features: [...(prev?.features || []), newF],
        }))
        setNewFeature({
            id: '',
            name: '',
            function: '',
            price: 0,
            duration: '',
            approvalStatus: 'draft',
            requirements: [],
            isMarkedForDiscussion: false,
            discussionNote: '',
            discussionStatus: 'open',
        })
    }

    const toggleSubmissionFeature = (id: string) => {
        if (!data) return
        const feature = data.features.find(f => f.id === id)
        if (!feature) return
      
        if (feature.approvalStatus === 'draft') {
            setAlertConfig({
                isOpen: true,
                type: 'confirm',
                title: 'Ajukan Fitur',
                message: 'Yakin ingin mengajukan fitur ini ke klien?',
                confirmText: 'Ajukan',
                cancelText: 'Batal',
                onConfirm: () => {
                    setData(prev => ({
                        ...prev!,
                        features: prev!.features.map(f =>
                            f.id === id ? { ...f, approvalStatus: 'waiting' } : f
                        ),
                    }))
                    setAlertConfig(prev => ({ ...prev, isOpen: false }))
                },
                onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            })
        } else if (feature.approvalStatus === 'waiting') {
            setAlertConfig({
                isOpen: true,
                type: 'confirm',
                title: 'Batalkan Pengajuan',
                message: 'Yakin ingin membatalkan pengajuan fitur ini?',
                confirmText: 'Batalkan',
                cancelText: 'Tidak',
                onConfirm: () => {
                    setData(prev => ({
                        ...prev!,
                        features: prev!.features.map(f =>
                            f.id === id ? { ...f, approvalStatus: 'draft' } : f
                        ),
                    }))
                    setAlertConfig(prev => ({ ...prev, isOpen: false }))
                },
                onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            })
        }
    }

    const handleEditFeature = (feature: Feature) => {
        setEditFeature(feature)
        setShowEditModal(true)
    }
    
    const handleEditSaveFeature = () => {
        if (!editFeature || !data) return
    
        const updatedFeatures = data.features.map(f => {
            if (f.id === editFeature.id) {
                if (f.approvalStatus !== 'draft') {
                    setAlertConfig({
                        isOpen: true,
                        type: 'confirm',
                        title: 'Konfirmasi Perubahan',
                        message: 'Perubahan fitur ini memerlukan persetujuan klien.\n\nYakin ingin mengirimkan permintaan perubahan?',
                        confirmText: 'Sure',
                        cancelText: 'Cancel',
                        onConfirm: () => {
                            setData({
                                ...data,
                                features: data.features.map(fe =>
                                    fe.id === editFeature.id
                                        ? { ...editFeature, approvalStatus: 'waiting' }
                                        : fe
                                ),
                            })
                            setShowEditModal(false)
                            setAlertConfig({
                                ...alertConfig,
                                isOpen: true,
                                type: 'alert',
                                title: 'Berhasil',
                                message: 'Permintaan perubahan fitur telah dikirimkan ke klien.',
                                onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
                                onCancel: () => {},
                            })
                        },
                        onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
                    })
                    return f
                }
                return { ...editFeature, approvalStatus: 'draft' }
            }
            return f
        })
    
        setData({ ...data, features: updatedFeatures })
        setShowEditModal(false)
    }

    const handleDeleteFeature = (id: string) => {
        const feature = data?.features.find(f => f.id === id)
        if (!feature) return
    
        if (feature.approvalStatus === 'draft') {
            setAlertConfig({
                isOpen: true,
                type: 'confirm',
                title: 'Hapus Fitur',
                message: 'Yakin ingin menghapus fitur ini?',
                onConfirm: () => {
                    setData(prev => ({
                        ...prev!,
                        features: prev!.features.filter(f => f.id !== id),
                    }))
                    setAlertConfig(prev => ({ ...prev, isOpen: false }))
                },
                onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            })
        } else {
            setAlertConfig({
                isOpen: true,
                type: 'confirm',
                title: 'Ajukan Penghapusan',
                message: 'Fitur ini sudah diajukan atau disetujui.\n\nIngin mengajukan permintaan penghapusan fitur ke klien?',
                onConfirm: () => {
                    setData(prev => ({
                        ...prev!,
                        features: prev!.features.map(f =>
                            f.id === id ? { ...f, deletionRequest: true } : f
                        ),
                    }))
                    setAlertConfig({
                        isOpen: true,
                        type: 'alert',
                        title: 'Pengajuan Dikirim',
                        message: 'Permintaan penghapusan telah diajukan ke klien.',
                        onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
                        onCancel: () => {},
                    })
                },
                onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            })
        }
    }

    const handleAddRequirement = (featureId: string, title: string) => {
        if (!title.trim()) return
        setData(prev => ({
            ...prev!,
            features: prev!.features.map(f =>
                f.id === featureId
                    ? {
                        ...f,
                        requirements: [
                            ...(f.requirements || []),
                            { id: crypto.randomUUID(), title }
                        ],
                    }
                    : f
            ),
        }))
    }

    const handleDeleteRequirement = (featureId: string, requirementId: string) => {
        setData(prev => ({
            ...prev!,
            features: prev!.features.map(f =>
                f.id === featureId
                    ? { ...f, requirements: f.requirements?.filter(r => r.id !== requirementId) }
                    : f
            ),
        }))
    }

    const handleEditRequirement = (featureId: string, requirementId: string, currentTitle: string) => {
        const feature = data?.features.find(f => f.id === featureId)
        if (!feature || feature.approvalStatus !== 'draft') return
        setEditingRequirement({ featureId, requirementId })
        setEditRequirementValue(currentTitle)
    }
    
    const handleSaveEditRequirement = () => {
        if (!editingRequirement) return
        setData(prev => ({
            ...prev!,
            features: prev!.features.map(f =>
                f.id === editingRequirement.featureId
                    ? {
                        ...f,
                        requirements: f.requirements?.map(r =>
                            r.id === editingRequirement.requirementId
                                ? { ...r, title: editRequirementValue }
                                : r
                        ),
                    }
                    : f
            ),
        }))
        setEditingRequirement(null)
        setEditRequirementValue('')
    }

    if (!data) {
        return <div className="p-6">Order tidak ditemukan.</div>
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
                                onChange={e => setEditFeature({ ...editFeature, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Fungsi"
                                className="border border-gray-400 px-3 py-2 rounded"
                                value={editFeature.function}
                                onChange={e => setEditFeature({ ...editFeature, function: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Harga"
                                className="border border-gray-400 px-3 py-2 rounded"
                                value={editFeature.price}
                                onChange={e => setEditFeature({ ...editFeature, price: Number(e.target.value) })}
                            />
                            <input
                                type="text"
                                placeholder="Durasi"
                                className="border border-gray-400 px-3 py-2 rounded"
                                value={editFeature.duration}
                                onChange={e => setEditFeature({ ...editFeature, duration: e.target.value })}
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
            </div>
        </>
    )
}