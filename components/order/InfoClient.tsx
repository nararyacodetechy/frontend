'use client'

import { useState } from 'react'
import { Order } from '@/types/order'
import { Copy, Check, Eye, EyeOff, Mail, Phone, MapPin, Building } from 'lucide-react'

interface InfoClientProps {
    data: Order
}

export default function InfoClient({ data }: InfoClientProps) {
    const [showNIK, setShowNIK] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 3000) // Reset setelah 2 detik
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building size={20} className="text-gray-500" />
                Informasi Klien
            </h2>
            <div className="flex gap-16">
                <div className="flex-shrink-0">
                    <img
                        src={data.imageProfile || '/images/no-picture-profile.png'}
                        alt="Foto Klien"
                        className="w-32 h-32 object-cover rounded-full border border-gray-300"
                        onError={(e) => (e.currentTarget.src = '/images/no-picture-profile.png')}
                    />
                </div>
                <div className="grid grid-cols-2 gap-6 flex-1">
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700">Identitas</h3>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-4">
                                <span><strong>ID Klien:</strong> {data.clientId || 'Tidak tersedia'}</span>
                                <button
                                    onClick={() => handleCopy(data.clientId, 'clientId')}
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Salin ID Klien"
                                >
                                    {copiedField === 'clientId' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                </button>
                            </p>
                            <p><strong>Nama:</strong> {data.clientName || 'Tidak tersedia'}</p>
                            <p className="flex items-center gap-4">
                                <span>
                                    <strong>NIK:</strong> {showNIK ? data.nik || 'Tidak tersedia' : '••••••••••••••••'}
                                </span>
                                <button
                                    onClick={() => setShowNIK(!showNIK)}
                                    className="text-gray-500 hover:text-gray-700"
                                    title={showNIK ? 'Sembunyikan NIK' : 'Tampilkan NIK'}
                                >
                                    {showNIK ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </p>
                            <p><strong>Username:</strong> @{data.username || 'Tidak tersedia'}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700">Kontak</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-500" />
                                <div className="flex gap-4">
                                    <a
                                        href={`mailto:${data.email}`}
                                        className="text-blue-600 hover:underline"
                                        title="Kirim email"
                                    >
                                        {data.email || 'Tidak tersedia'}
                                    </a>
                                    {data.email && (
                                        <button
                                            onClick={() => handleCopy(data.email!, 'email')}
                                            className="text-gray-500 hover:text-gray-700"
                                            title="Salin Email"
                                        >
                                            {copiedField === 'email' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-500" />
                                <div className="flex items-center gap-4">
                                    <a
                                        href={`tel:${data.phone}`}
                                        className="text-blue-600 hover:underline"
                                        title="Hubungi nomor"
                                    >
                                        {data.phone || 'Tidak tersedia'}
                                    </a>
                                    {data.phone && (
                                        <button
                                            onClick={() => handleCopy(data.phone!, 'phone')}
                                            className="text-gray-500 hover:text-gray-700"
                                            title="Salin Telepon"
                                        >
                                            {copiedField === 'phone' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="flex items-center gap-2">
                                <MapPin size={14} className="text-gray-500" />
                                {data.address || 'Tidak tersedia'}
                            </p>
                            <p className="flex items-center gap-2">
                                <Building size={14} className="text-gray-500" />
                                {data.company || 'Tidak tersedia'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}