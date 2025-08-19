'use client'

import { useState } from 'react'
import { Order, Feature } from '@/types/order'
import { ChevronDown, ChevronRight, Pencil, Trash2, Send, XCircle, CheckCircle, Clock, FileText, MessageCircle, ArrowUp, ArrowDown, DollarSign, List, Layers, Filter, Archive } from 'lucide-react'

interface ListFeaturesProps {
    data: Order
    setData: (data: Order | null) => void
    toggleSubmissionFeature: (id: string) => void
    handleEditFeature: (feature: Feature) => void
    handleDeleteFeature: (id: string) => void
    openRequirements: { [key: string]: boolean }
    setOpenRequirements: (value: { [key: string]: boolean }) => void
    openDiscussionNotes: { [key: string]: boolean }
    setOpenDiscussionNotes: (value: { [key: string]: boolean }) => void
    discussionStatus: { [key: string]: 'open' | 'resolved' | 'archived' }
    setDiscussionStatus: (value: { [key: string]: 'open' | 'resolved' | 'archived' }) => void
    newRequirement: { [key: string]: string }
    setNewRequirement: (value: { [key: string]: string }) => void
    editingRequirement: { featureId: string; requirementId: string } | null
    setEditingRequirement: (value: { featureId: string; requirementId: string } | null) => void
    editRequirementValue: string
    setEditRequirementValue: (value: string) => void
    handleAddRequirement: (featureId: string, title: string) => void
    handleDeleteRequirement: (featureId: string, requirementId: string) => void
    handleEditRequirement: (featureId: string, requirementId: string, currentTitle: string) => void
    handleSaveEditRequirement: () => void
    setAlertConfig: (config: {
        isOpen: boolean
        type: 'alert' | 'confirm'
        title: string
        message: string
        confirmText: string
        cancelText: string
        onConfirm: () => void
        onCancel: () => void
    }) => void
}

export default function ListFeatures({
    data,
    setData,
    toggleSubmissionFeature,
    handleEditFeature,
    handleDeleteFeature,
    openRequirements,
    setOpenRequirements,
    openDiscussionNotes,
    setOpenDiscussionNotes,
    discussionStatus,
    setDiscussionStatus,
    newRequirement,
    setNewRequirement,
    editingRequirement,
    setEditingRequirement,
    editRequirementValue,
    setEditRequirementValue,
    handleAddRequirement,
    handleDeleteRequirement,
    handleEditRequirement,
    handleSaveEditRequirement,
    setAlertConfig
}: ListFeaturesProps) {
    const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'waiting' | 'approved'>('all');

    const handleMoveRequirement = (featureId: string, requirementId: string, direction: 'up' | 'down') => {
        setData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                features: prev.features.map(f => {
                    if (f.id !== featureId) return f;
                    const requirements = [...(f.requirements || [])];
                    const index = requirements.findIndex(r => r.id === requirementId);
                    if (index === -1) return f;
                    if (direction === 'up' && index > 0) {
                        [requirements[index - 1], requirements[index]] = [requirements[index], requirements[index - 1]];
                    } else if (direction === 'down' && index < requirements.length - 1) {
                        [requirements[index], requirements[index + 1]] = [requirements[index + 1], requirements[index]];
                    }
                    return { ...f, requirements };
                }),
            };
        });
    };

    const handleToggleDiscussionStatus = (featureId: string, newStatus: 'open' | 'resolved' | 'archived') => {
        if (newStatus === 'resolved') {
            setAlertConfig({
                isOpen: true,
                type: 'confirm',
                title: 'Tandai Catatan Selesai',
                message: 'Yakin ingin menandai catatan ini sebagai selesai? Pastikan sudah disetujui oleh klien.',
                confirmText: 'Tandai Selesai',
                cancelText: 'Batal',
                onConfirm: () => {
                    setDiscussionStatus(prev => ({ ...prev, [featureId]: 'resolved' }));
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                },
                onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            });
        } else if (newStatus === 'archived') {
            setAlertConfig({
                isOpen: true,
                type: 'confirm',
                title: 'Arsipkan Catatan',
                message: 'Yakin ingin mengarsipkan catatan ini? Catatan akan dihapus dari tampilan setelah disetujui.',
                confirmText: 'Arsipkan',
                cancelText: 'Batal',
                onConfirm: () => {
                    setDiscussionStatus(prev => ({ ...prev, [featureId]: 'archived' }));
                    setData(prev => ({
                        ...prev!,
                        features: prev!.features.map(f =>
                            f.id === featureId ? { ...f, isMarkedForDiscussion: false, discussionNote: '' } : f
                        ),
                    }));
                    setOpenDiscussionNotes(prev => ({ ...prev, [featureId]: false }));
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                },
                onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            });
        } else {
            setDiscussionStatus(prev => ({ ...prev, [featureId]: 'open' }));
        }
    };

    const totalPrice = data.features.reduce((sum, feature) => sum + feature.price, 0);
    const totalFeatures = data.features.length;
    const totalRequirements = data.features.reduce((sum, feature) => sum + (feature.requirements?.length || 0), 0);
    const statusBreakdown = {
        draft: data.features.filter(f => f.approvalStatus === 'draft').length,
        waiting: data.features.filter(f => f.approvalStatus === 'waiting').length,
        approved: data.features.filter(f => f.approvalStatus === 'approved').length,
    };

    const filteredFeatures = filterStatus === 'all'
        ? data.features
        : data.features.filter(f => f.approvalStatus === filterStatus);

    return (
        <div>
            <ul>
                <h2 className="text-gray-700 text-md font-semibold my-2">🚩 List Features</h2>
                {filteredFeatures.length === 0 ? (
                    <p className="text-gray-500 text-sm">Tidak ada fitur dengan status {filterStatus === 'all' ? 'tersedia' : filterStatus}.</p>
                ) : (
                    filteredFeatures.map(feature => (
                        <li
                            key={feature.id}
                            className="border-y border-gray-200 py-2 text-sm flex flex-col justify-between items-start"
                        >
                            <div className="flex w-full justify-between space-y-2">
                                <div className="space-y-1">
                                    <div className="flex gap-2">
                                        <p className="font-semibold text-sm text-gray-800">{feature.name}</p>
                                        {feature.isMarkedForDiscussion && discussionStatus[feature.id] !== 'archived' && (
                                            <div className="inline-flex items-center gap-1 text-xs bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-md">
                                                <MessageCircle size={14} className="text-red-500" />
                                                <button
                                                    onClick={() =>
                                                        setOpenDiscussionNotes(prev => ({
                                                            ...prev,
                                                            [feature.id]: !prev[feature.id],
                                                        }))
                                                    }
                                                    className={`cursor-pointer underline ${
                                                        discussionStatus[feature.id] === 'resolved'
                                                            ? 'text-blue-700 hover:text-blue-800'
                                                            : 'text-red-700 hover:text-red-800'
                                                    }`}
                                                >
                                                    {openDiscussionNotes[feature.id] ? 'Sembunyikan' : 'Lihat Catatan'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">Tujuan: {feature.function}</p>
                                    <p className="text-sm">Rp. {feature.price.toLocaleString()} ({feature.duration})</p>
                                    {feature.isMarkedForDiscussion && openDiscussionNotes[feature.id] && feature.discussionNote && discussionStatus[feature.id] !== 'archived' && (
                                        <div
                                            className={`mt-2 border-l-4 p-2 text-xs rounded ${
                                                discussionStatus[feature.id] === 'resolved'
                                                    ? 'bg-green-50 border-green-300 text-green-700'
                                                    : 'bg-red-50 border-red-300 text-red-700'
                                            }`}
                                        >
                                            <p className="font-semibold">Catatan Klien:</p>
                                            <p className="italic mt-1">“{feature.discussionNote}”</p>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleToggleDiscussionStatus(feature.id, discussionStatus[feature.id] === 'resolved' ? 'open' : 'resolved')}
                                                    className={`cursor-pointer text-xs underline ${
                                                        discussionStatus[feature.id] === 'resolved'
                                                            ? 'text-green-700 hover:text-green-900'
                                                            : 'text-red-700 hover:text-red-900'
                                                    }`}
                                                >
                                                    {discussionStatus[feature.id] === 'resolved'
                                                        ? 'Tandai Belum Selesai'
                                                        : 'Tandai Selesai'}
                                                </button>
                                                {discussionStatus[feature.id] === 'resolved' && (
                                                    <button
                                                        onClick={() => handleToggleDiscussionStatus(feature.id, 'archived')}
                                                        className="cursor-pointer text-xs underline text-blue-700 hover:text-blue-800"
                                                    >
                                                        Arsipkan
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 text-xs h-6">
                                    {feature.approvalStatus !== "approved" && (
                                        <button
                                            onClick={() => toggleSubmissionFeature(feature.id)}
                                            className={`cursor-pointer flex items-center gap-1 border px-2 py-1 rounded text-xs font-semibold transition
                                                ${
                                                    feature.approvalStatus === "draft"
                                                        ? "border-green-400 bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "border-red-400 bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                        >
                                            {feature.approvalStatus === "draft" ? (
                                                <>
                                                    <Send size={14} />
                                                    Ajukan
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} />
                                                    Batalkan
                                                </>
                                            )}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditFeature(feature)}
                                        disabled={feature.approvalStatus === "waiting"}
                                        className={`cursor-pointer flex items-center gap-1 border px-2 py-1 rounded 
                                            ${
                                                feature.approvalStatus === "waiting"
                                                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                                                    : "bg-yellow-100 text-yellow-700 border-yellow-400 hover:text-yellow-900"
                                            }`}
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>
                                    {!feature.deletionRequest ? (
                                        <button
                                            onClick={() => handleDeleteFeature(feature.id)}
                                            disabled={feature.approvalStatus === "waiting"}
                                            className={`cursor-pointer flex items-center gap-1 border px-2 py-1 rounded 
                                                ${
                                                    feature.approvalStatus === "waiting"
                                                        ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                                                        : "bg-red-100 text-red-700 border-red-400 hover:text-red-900"
                                                }`}
                                        >
                                            <Trash2 size={14} />
                                            Hapus
                                        </button>
                                    ) : (
                                        <p className="italic text-gray-400">Penghapusan fitur sedang diajukan ke klien</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full mt-1">
                                <div className="flex justify-between items-center text-xs font-medium text-gray-700">
                                    <button
                                        onClick={() =>
                                            setOpenRequirements(prev => ({ ...prev, [feature.id]: !prev[feature.id] }))
                                        }
                                        className="flex items-center gap-1 hover:text-gray-900 transition"
                                    >
                                        {openRequirements[feature.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        Detail Kebutuhan
                                        <span className="text-gray-400 font-normal">
                                            ({(feature.requirements || []).length})
                                        </span>
                                    </button>
                                    {feature.approvalStatus === 'approved' && (
                                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                            <CheckCircle size={12} />
                                            Disetujui
                                        </span>
                                    )}
                                    {feature.approvalStatus === 'waiting' && (
                                        <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                                            <Clock size={12} />
                                            Menunggu
                                        </span>
                                    )}
                                    {feature.approvalStatus === 'draft' && (
                                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                            <FileText size={12} />
                                            Draft
                                        </span>
                                    )}
                                </div>
                                {openRequirements[feature.id] && (
                                    <div className="mt-2">
                                        <ul className="space-y-1">
                                            {(feature.requirements || []).map((req, index) => (
                                                <li
                                                    key={req.id}
                                                    className="group flex items-center gap-1 justify-between text-xs rounded hover:bg-gray-50 transition"
                                                >
                                                    <div className="flex items-center">
                                                        {feature.approvalStatus === 'draft' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleDeleteRequirement(feature.id, req.id)}
                                                                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 text-gray-500 transition"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleMoveRequirement(feature.id, req.id, 'up')}
                                                                    disabled={index === 0}
                                                                    className={`p-1 rounded-full ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 group-hover:opacity-100 opacity-0 transition'}`}
                                                                    title="Naik"
                                                                >
                                                                    <ArrowUp size={12} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleMoveRequirement(feature.id, req.id, 'down')}
                                                                    disabled={index === (feature.requirements?.length || 0) - 1}
                                                                    className={`p-1 rounded-full ${index === (feature.requirements?.length || 0) - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 group-hover:opacity-100 opacity-0 transition'}`}
                                                                    title="Turun"
                                                                >
                                                                    <ArrowDown size={12} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center flex-1 gap-2">
                                                        <span className="text-gray-400 text-left">{index + 1}.</span>
                                                        {editingRequirement?.featureId === feature.id &&
                                                        editingRequirement?.requirementId === req.id ? (
                                                            <input
                                                                type="text"
                                                                value={editRequirementValue}
                                                                onChange={(e) => setEditRequirementValue(e.target.value)}
                                                                onBlur={handleSaveEditRequirement}
                                                                autoFocus
                                                                className="flex-1 border-b border-gray-300 text-gray-700 bg-transparent text-xs focus:outline-none"
                                                                disabled={feature.approvalStatus !== 'draft'}
                                                            />
                                                        ) : (
                                                            <span
                                                                className={`flex-1 text-gray-700 ${
                                                                    feature.approvalStatus === 'draft' ? 'hover:underline cursor-pointer' : 'cursor-not-allowed'
                                                                }`}
                                                                onClick={() =>
                                                                    feature.approvalStatus === 'draft' &&
                                                                    handleEditRequirement(feature.id, req.id, req.title)
                                                                }
                                                            >
                                                                {req.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {feature.approvalStatus === 'draft' && (
                                            <div className="flex gap-1 mt-3 items-center">
                                                <button
                                                    onClick={() => {
                                                        handleAddRequirement(feature.id, newRequirement[feature.id] || '')
                                                        setNewRequirement({ ...newRequirement, [feature.id]: '' })
                                                    }}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-xs font-semibold"
                                                >
                                                    Enter
                                                </button>
                                                <input
                                                    type="text"
                                                    placeholder="Tambah detail kebutuhan..."
                                                    value={newRequirement[feature.id] || ''}
                                                    onChange={e =>
                                                        setNewRequirement({ ...newRequirement, [feature.id]: e.target.value })
                                                    }
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            handleAddRequirement(feature.id, newRequirement[feature.id] || '')
                                                            setNewRequirement({ ...newRequirement, [feature.id]: '' })
                                                        }
                                                    }}
                                                    className="flex-1 bg-gray-50 border border-gray-200 px-2 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h3 className="text-gray-800 text-lg font-semibold mb-4 flex items-center gap-2">
                    <List size={18} />
                    Kesimpulan Proyek
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <p className="flex items-center gap-2 text-gray-700">
                            <DollarSign size={16} className="text-gray-500" />
                            <strong>Total Harga:</strong> Rp. {totalPrice.toLocaleString()}
                        </p>
                        <p className="flex items-center gap-2 text-gray-700">
                            <List size={16} className="text-gray-500" />
                            <strong>Jumlah Fitur:</strong> {totalFeatures}
                        </p>
                        <p className="flex items-center gap-2 text-gray-700">
                            <Layers size={16} className="text-gray-500" />
                            <strong>Jumlah Kebutuhan:</strong> {totalRequirements}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <p className="flex items-center gap-2 text-gray-700">
                            <Filter size={16} className="text-gray-500" />
                            <strong>Status Fitur:</strong>
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setFilterStatus('draft')}
                                className={`cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                                    filterStatus === 'draft' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <FileText size={12} />
                                Draft: {statusBreakdown.draft}
                            </button>
                            <button
                                onClick={() => setFilterStatus('waiting')}
                                className={`cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                                    filterStatus === 'waiting' ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                }`}
                            >
                                <Clock size={12} />
                                Menunggu: {statusBreakdown.waiting}
                            </button>
                            <button
                                onClick={() => setFilterStatus('approved')}
                                className={`cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                                    filterStatus === 'approved' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                            >
                                <CheckCircle size={12} />
                                Disetujui: {statusBreakdown.approved}
                            </button>
                            {filterStatus !== 'all' && (
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                >
                                    <Filter size={12} />
                                    Tampilkan Semua
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}