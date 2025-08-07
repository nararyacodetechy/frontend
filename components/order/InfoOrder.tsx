'use client'

import { useState } from 'react'
import { Order } from '@/types/order'
import { Copy, ExternalLink, Download, ZoomIn, FileText, Check } from 'lucide-react'

interface InfoOrderProps {
    data: Order
}

export default function InfoOrder({ data }: InfoOrderProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const [showImageModal, setShowImageModal] = useState(false)

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 3000)
    }

    const handleDownloadProof = () => {
        if (data.paymentProof) {
            const link = document.createElement('a')
            link.href = data.paymentProof
            link.download = `Bukti_Pembayaran_${data.orderNumber}.jpg`
            link.click()
        }
    }

    const handleOpenReference = () => {
        if (data.reference) {
            window.open(data.reference, '_blank', 'noopener,noreferrer')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'selesai':
                return 'bg-green-100 text-green-700'
            case 'menunggu':
                return 'bg-yellow-100 text-yellow-700'
            case 'dalam kajian':
                return 'bg-blue-100 text-blue-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-gray-500" />
                Detail Order
            </h2>
            <div className="flex gap-16">
                <div className="flex-shrink-0">
                    <img
                        src={data.imgIdOrder || '/images/no-picture-order.svg'}
                        alt="Gambar Order"
                        className="w-32 h-32 object-cover rounded-md border border-gray-300"
                        onError={(e) => (e.currentTarget.src = '/images/no-picture-order.svg')}
                    />
                </div>
                <div className="grid grid-cols-2 gap-6 flex-1">
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700">Ikhtisar</h3>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-4">
                                <span><strong>ID Order:</strong> {data.id || 'Tidak tersedia'}</span>
                                <button
                                    onClick={() => handleCopy(data.id, 'id')}
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Salin ID Order"
                                >
                                    {copiedField === 'id' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                </button>
                            </p>
                            <p><strong>Nama Order:</strong> {data.orderName || 'Tidak tersedia'}</p>
                            <p className="flex items-center gap-4">
                                <span><strong>ID Order:</strong> {data.id || 'Tidak tersedia'}</span>
                                <button
                                    onClick={() => handleCopy(data.id, 'id')}
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Salin ID Order"
                                >
                                    {copiedField === 'id' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                </button>
                            </p>
                            <p><strong>Jenis:</strong> {data.projectType || 'Tidak tersedia'}</p>
                            <p>
                                <strong>Status:</strong>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(data.status)}`}>
                                    {data.status || 'Tidak tersedia'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700">Detail Proyek</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>Deskripsi:</strong> {data.projectDetail || 'Tidak tersedia'}</p>
                            <p className="flex items-center gap-2">
                                <strong>Referensi:</strong>
                                <button
                                    onClick={handleOpenReference}
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                    title="Buka referensi"
                                >
                                    {data.reference || 'Tidak tersedia'} <ExternalLink size={14} />
                                </button>
                            </p>
                            <p>
                                <strong>Preferensi Desain:{' '}</strong>
                                {data.designPreference
                                    ? `${data.designPreference.color} – ${data.designPreference.style}`
                                    : 'Tidak tersedia'}
                            </p>
                            <p>
                                <strong>Tanggal Order:{' '}</strong>
                                {data.createdAt
                                    ? new Date(data.createdAt).toLocaleString('id-ID', {
                                          dateStyle: 'medium',
                                          timeStyle: 'short',
                                      })
                                    : 'Tidak tersedia'}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700">Pembayaran</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>Metode:</strong> {data.paymentMethod || 'Tidak tersedia'}</p>
                            <p><strong>Total Harga:</strong> Rp {data.totalPrice?.toLocaleString() || 'Tidak tersedia'}</p>
                            {data.paymentProof && (
                                <p>
                                    <strong>Bukti Pembayaran:</strong>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => setShowImageModal(true)}
                                            className="text-blue-600 hover:underline flex items-center gap-1"
                                            title="Perbesar gambar"
                                        >
                                            <ZoomIn size={14} /> Lihat Bukti
                                        </button>
                                        <button
                                            onClick={handleDownloadProof}
                                            className="text-blue-600 hover:underline flex items-center gap-1"
                                            title="Unduh bukti"
                                        >
                                            <Download size={14} /> Unduh
                                        </button>
                                    </div>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showImageModal && data.paymentProof && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg p-4 max-w-3xl">
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            ✕
                        </button>
                        <img
                            src={data.paymentProof}
                            alt="Bukti Pembayaran"
                            className="max-w-full max-h-[80vh] rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}