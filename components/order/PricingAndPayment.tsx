'use client'

import { useState } from 'react'
import { Order, PricingProposal } from '@/types/order'
import { DollarSign, Handshake, CheckCircle, Undo2, FileText, Calendar, Percent, Calculator } from 'lucide-react'

interface PricingAndPaymentProps {
  data: Order
  setData: (data: Order | null) => void
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

export default function PricingAndPayment({ data, setData, setAlertConfig }: PricingAndPaymentProps) {
  // Initialize proposal state with totalPriceFeatures as the base amount
  const [proposal, setProposal] = useState({
    amount: data.totalPriceFeatures || 0, // Base price from sum of feature prices
    notes: '',
    discount: 0, // Absolute discount amount (e.g., 150,000)
    discountPercent: 0, // Discount as a percentage (e.g., 20%)
    taxRate: 12, // Fixed tax rate (12%)
    commissionRate: 5, // Fixed commission rate (5%)
  });
  const [paymentTerms, setPaymentTerms] = useState(data.paymentTerms || 'full')
  const [pmHistoryNote, setPmHistoryNote] = useState('')

  // Calculate totalPriceFeatures by summing feature prices
  const totalPriceFeatures = data.features?.reduce((sum, feature) => sum + feature.price, 0) || 0;
  const isAgreementConfirmed = data.pricingStatus === 'confirmed'

  // Find the latest valid proposal (with amount > 0) for display
  const latestValidProposal = data.pricingProposals?.slice().reverse().find(prop => prop.amount > 0);
  // Calculate price breakdown:
  // - Subtotal: Base amount minus discount
  // - Tax: Subtotal * (taxRate / 100)
  // - Commission: Subtotal * (commissionRate / 100)
  // - Final Total: Subtotal + Tax + Commission
  const displaySubtotal = latestValidProposal ? latestValidProposal.amount - (latestValidProposal.discount || 0) : totalPriceFeatures;
  const displayTax = latestValidProposal ? displaySubtotal * (latestValidProposal.taxRate / 100) : 0;
  const displayCommission = latestValidProposal ? displaySubtotal * (latestValidProposal.commissionRate / 100) : 0;
  const displayFinalTotal = displaySubtotal + displayTax + displayCommission;

  // Update discount and discountPercent when percentage changes
  const handleDiscountPercentChange = (percent: number) => {
    const discount = (percent / 100) * proposal.amount
    setProposal({ ...proposal, discount, discountPercent: percent })
  }

  const handleAddProposal = () => {
    // Validate proposal inputs
    if (proposal.amount <= 0) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Harga Tidak Valid',
        message: 'Harap masukkan jumlah harga yang valid.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      })
      return
    }
    if (proposal.taxRate < 0 || proposal.taxRate > 100) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Pajak Tidak Valid',
        message: 'Pajak harus antara 0% dan 100%.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      })
      return
    }
    if (proposal.discount > proposal.amount) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Diskon Tidak Valid',
        message: 'Diskon tidak boleh melebihi jumlah harga.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      })
      return
    }

    // Create new proposal with current inputs
    const newProposal: PricingProposal = {
      id: crypto.randomUUID(),
      amount: proposal.amount,
      discount: proposal.discount,
      taxRate: proposal.taxRate,
      commissionRate: proposal.commissionRate,
      notes: proposal.notes,
      proposedBy: 'PM',
      createdAt: new Date().toISOString(),
    }

    // Calculate final price: (amount - discount) + tax + commission
    const subtotal = proposal.amount - proposal.discount;
    const finalTotal = subtotal + subtotal * (proposal.taxRate / 100) + subtotal * (proposal.commissionRate / 100);

    // Update order with new proposal and final total
    setData(prev => ({
      ...prev!,
      pricingProposals: [...(prev!.pricingProposals || []), newProposal],
      totalPriceFinal: finalTotal, // Store final negotiated price
    }));

    // Reset proposal form to initial state
    setProposal({ amount: totalPriceFeatures, notes: '', discount: 0, discountPercent: 0, taxRate: 12, commissionRate: 5 })
  }

  const handleAddPmHistoryNote = () => {
    if (!pmHistoryNote.trim()) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Catatan Kosong',
        message: 'Harap masukkan catatan untuk riwayat negosiasi.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      })
      return
    }

    const newProposal: PricingProposal = {
      id: crypto.randomUUID(),
      amount: 0,
      discount: 0,
      taxRate: 0,
      commissionRate: 0,
      notes: pmHistoryNote,
      proposedBy: 'PM',
      createdAt: new Date().toISOString(),
    }

    setData(prev => ({
      ...prev!,
      pricingProposals: [...(prev!.pricingProposals || []), newProposal],
    }))

    setPmHistoryNote('')
  }

  const handleConfirmAgreement = () => {
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Konfirmasi Kesepakatan',
      message: 'Yakin ingin mengonfirmasi harga dan syarat pembayaran? Ini akan mengunci perubahan.',
      confirmText: 'Konfirmasi',
      cancelText: 'Batal',
      onConfirm: () => {
        setData(prev => ({
          ...prev!,
          pricingStatus: 'confirmed',
          paymentTerms,
          paymentStatus: 'pending',
          totalPriceFinal: displayFinalTotal,
        }))
        setAlertConfig(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
    })
  }

  const handleReopenNegotiation = () => {
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Buka Kembali Negosiasi',
      message: 'Yakin ingin membuka kembali negosiasi harga? Ini akan memungkinkan perubahan harga dan syarat.',
      confirmText: 'Buka Kembali',
      cancelText: 'Batal',
      onConfirm: () => {
        setData(prev => ({
          ...prev!,
          pricingStatus: 'negotiating',
        }))
        setAlertConfig(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
    })
  }

  const handleMarkPaid = () => {
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Tandai Dibayar',
      message: 'Yakin ingin menandai pembayaran sebagai diterima? Pastikan bukti pembayaran telah diverifikasi.',
      confirmText: 'Tandai Dibayar',
      cancelText: 'Batal',
      onConfirm: () => {
        setData(prev => ({
          ...prev!,
          paymentStatus: 'paid',
        }))
        setAlertConfig(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-700'
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'paid':
        return 'bg-green-200 text-green-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-8">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <DollarSign size={20} className="text-gray-500" />
        Harga dan Pembayaran
      </h2>

      {/* Price Summary */}
      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Calculator size={16} className="text-gray-500" />
          Ringkasan Harga
        </h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Total Fitur:</span>
            <span>Rp {totalPriceFeatures.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Diskon ({latestValidProposal ? ((latestValidProposal.discount / latestValidProposal.amount) * 100).toFixed(1) : 0}%):</span>
            <span>Rp {(latestValidProposal?.discount || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Subtotal:</span>
            <span>Rp {displaySubtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak ({latestValidProposal?.taxRate || 0}%):</span>
            <span>Rp {displayTax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Komisi Aplikasi ({latestValidProposal?.commissionRate || 0}%):</span>
            <span>Rp {displayCommission.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-300 pt-2">
            <span>Total Akhir:</span>
            <span>Rp {(data.totalPriceFinal || displayFinalTotal).toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Perhitungan: Total Fitur - Diskon = Subtotal; Subtotal + Pajak + Komisi = Total Akhir
          </p>
        </div>
      </div>

      {/* Negotiation Section */}
      {!isAgreementConfirmed && (
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Handshake size={16} className="text-gray-500" />
            Negosiasi Harga
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Jumlah Harga</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                <DollarSign size={16} className="text-gray-500" />
                <input
                  type="number"
                  value={proposal.amount}
                  onChange={e => setProposal({ ...proposal, amount: Number(e.target.value), discount: 0, discountPercent: 0 })}
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  disabled={isAgreementConfirmed}
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Diskon</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                <DollarSign size={16} className="text-gray-500" />
                <input
                  type="number"
                  value={proposal.discount}
                  onChange={e => setProposal({ ...proposal, discount: Number(e.target.value), discountPercent: (Number(e.target.value) / proposal.amount) * 100 })}
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  disabled={isAgreementConfirmed}
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Diskon (%)</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                <Percent size={16} className="text-gray-500" />
                <input
                  type="number"
                  value={proposal.discountPercent}
                  onChange={e => handleDiscountPercentChange(Number(e.target.value))}
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  disabled={isAgreementConfirmed}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Pajak (%)</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
                <Percent size={16} className="text-gray-500" />
                <input
                  type="number"
                  value={proposal.taxRate}
                  className="flex-1 text-sm bg-transparent"
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Komisi Aplikasi (%)</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
                <Percent size={16} className="text-gray-500" />
                <input
                  type="number"
                  value={proposal.commissionRate}
                  className="flex-1 text-sm bg-transparent"
                  disabled
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-600">Catatan</label>
              <textarea
                placeholder="Catatan untuk klien (misalnya, alasan diskon atau kenaikan harga)"
                value={proposal.notes}
                onChange={e => setProposal({ ...proposal, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                rows={3}
                disabled={isAgreementConfirmed}
              />
            </div>
          </div>
          <button
            onClick={handleAddProposal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
            disabled={isAgreementConfirmed}
          >
            <Handshake size={16} /> Ajukan Proposal Harga
          </button>
        </div>
      )}

      {/* PM Negotiation History Notes */}
      {!isAgreementConfirmed && (
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FileText size={16} className="text-gray-500" />
            Catatan Negosiasi PM
          </h3>
          <textarea
            placeholder="Masukkan catatan negosiasi dari PM (misalnya, hasil diskusi atau keputusan internal)..."
            value={pmHistoryNote}
            onChange={e => setPmHistoryNote(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
            rows={3}
            disabled={isAgreementConfirmed}
          />
          <button
            onClick={handleAddPmHistoryNote}
            className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 flex items-center gap-2"
            disabled={isAgreementConfirmed}
          >
            <FileText size={16} /> Tambah Catatan PM
          </button>
        </div>
      )}

      {/* Negotiation History */}
      {data.pricingProposals?.length > 0 && (
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            Riwayat Negosiasi
          </h3>
          <div className="space-y-3">
            {data.pricingProposals
              .slice()
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map(prop => {
                const propSubtotal = prop.amount - (prop.discount || 0)
                const propTax = propSubtotal * (prop.taxRate / 100)
                const propCommission = propSubtotal * (prop.commissionRate / 100)
                const propTotal = propSubtotal + propTax + propCommission
                const isClient = prop.proposedBy === 'Client'
                return (
                  <div
                    key={prop.id}
                    className={`flex ${isClient ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] border border-gray-200 rounded-lg p-3 text-sm ${
                        isClient ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <p className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        {new Date(prop.createdAt).toLocaleString('id-ID')}
                      </p>
                      <p><strong>{isClient ? 'Klien' : 'PM'}:</strong> {prop.proposedBy}</p>
                      {prop.amount > 0 ? (
                        <>
                          <p><strong>Harga:</strong> Rp {prop.amount.toLocaleString()}</p>
                          <p><strong>Diskon:</strong> Rp {(prop.discount || 0).toLocaleString()}</p>
                          <p><strong>Pajak ({prop.taxRate}%):</strong> Rp {propTax.toLocaleString()}</p>
                          <p><strong>Komisi ({prop.commissionRate}%):</strong> Rp {propCommission.toLocaleString()}</p>
                          <p className="font-semibold"><strong>Total Harga:</strong> Rp {propTotal.toLocaleString()}</p>
                        </>
                      ) : (
                        <p className="text-gray-500">Tidak ada detail harga (catatan atau feedback).</p>
                      )}
                      {prop.notes && <p><strong>Catatan:</strong> {prop.notes}</p>}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Payment Terms */}
      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <FileText size={16} className="text-gray-500" />
          Syarat Pembayaran
        </h3>
        <select
          value={paymentTerms}
          onChange={e => setPaymentTerms(e.target.value as 'full' | 'installments' | 'milestones')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
          disabled={isAgreementConfirmed}
        >
          <option value="full">Pembayaran Penuh</option>
          <option value="installments">Cicilan</option>
          <option value="milestones">Berdasarkan Milestone</option>
        </select>
      </div>

      {/* Payment Status */}
      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-gray-500" />
          Status Pembayaran
        </h3>
        <p>
          <strong>Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(data.paymentStatus || 'pending')}`}>
            {data.paymentStatus === 'pending' ? 'Menunggu' : 'Dibayar'}
          </span>
        </p>
        {data.paymentProof && (
          <p className="mt-2">
            <strong>Bukti Pembayaran:</strong>
            <a href={data.paymentProof} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Lihat Bukti
            </a>
          </p>
        )}
        {data.paymentStatus !== 'paid' && (
          <button
            onClick={handleMarkPaid}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle size={16} /> Tandai Dibayar
          </button>
        )}
      </div>

      {/* Confirm/Reopen Agreement */}
      <div className="flex justify-end gap-2">
        {!isAgreementConfirmed && (
          <button
            onClick={handleConfirmAgreement}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 flex items-center gap-2"
            disabled={data.pricingProposals?.length === 0}
          >
            <CheckCircle size={16} /> Konfirmasi Kesepakatan
          </button>
        )}
        {isAgreementConfirmed && (
          <button
            onClick={handleReopenNegotiation}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 flex items-center gap-2"
          >
            <Undo2 size={16} /> Buka Kembali Negosiasi
          </button>
        )}
      </div>
    </div>
  )
}