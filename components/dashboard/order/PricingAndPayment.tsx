// src/components/dashboard/order/PricingAndPayment.tsx
'use client';

import { useState } from 'react';
import { Order, PricingProposal } from '@/types/order';
import { DollarSign, Handshake, CheckCircle, Undo2, FileText, Calendar, Percent, Calculator } from 'lucide-react';

interface PricingAndPaymentProps {
  data: Order;
  setData: (data: Order) => void;
  setAlertConfig: (config: {
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => void;
}

export default function PricingAndPayment({ data, setData, setAlertConfig }: PricingAndPaymentProps) {
  const [proposal, setProposal] = useState({
    amount: Number(data.totalPriceFeatures) || 0,
    notes: '',
    discount: 0,
    discountPercent: 0,
    taxRate: 12,
    commissionRate: 5,
  });
  const [paymentTerms, setPaymentTerms] = useState(data.paymentTerms || 'full');
  const [pmHistoryNote, setPmHistoryNote] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPriceFeatures = data.features?.reduce((sum, feature) => sum + Number(feature.price), 0) || 0;
  const isAgreementConfirmed = data.pricingStatus === 'confirmed';

  const latestValidProposal = data.pricingProposals?.slice().reverse().find((prop) => Number(prop.amount) > 0);
  const displaySubtotal = latestValidProposal ? Number(latestValidProposal.amount) - Number(latestValidProposal.discount || 0) : totalPriceFeatures;
  const displayTax = latestValidProposal ? displaySubtotal * (Number(latestValidProposal.taxRate) / 100) : 0;
  const displayCommission = latestValidProposal ? displaySubtotal * (Number(latestValidProposal.commissionRate) / 100) : 0;
  const displayFinalTotal = displaySubtotal + displayTax + displayCommission;

  const handleDiscountPercentChange = (percent: number) => {
    const discount = (percent / 100) * proposal.amount;
    setProposal({ ...proposal, discount, discountPercent: percent });
  };

  const handleAddProposal = async () => {
    if (proposal.amount <= 0) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Harga Tidak Valid',
        message: 'Harap masukkan jumlah harga yang valid.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
      return;
    }
    if (proposal.taxRate < 0 || proposal.taxRate > 100) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Pajak Tidak Valid',
        message: 'Pajak harus antara 0% dan 100%.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
      return;
    }
    if (proposal.discount > proposal.amount) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Diskon Tidak Valid',
        message: 'Diskon tidak boleh melebihi jumlah harga.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
      return;
    }

    setLoading(true);
    try {
      const newProposal: PricingProposal = {
        id: crypto.randomUUID(),
        orderId: data.id,
        amount: String(proposal.amount),
        discount: String(proposal.discount),
        taxRate: String(proposal.taxRate),
        commissionRate: String(proposal.commissionRate),
        notes: proposal.notes,
        proposedBy: 'PM',
        createdAt: new Date().toISOString(),
      };

      const subtotal = proposal.amount - proposal.discount;
      const finalTotal = subtotal + subtotal * (proposal.taxRate / 100) + subtotal * (proposal.commissionRate / 100);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setData({
        ...data,
        pricingProposals: [...(data.pricingProposals || []), newProposal],
        totalPriceFinal: String(finalTotal),
      });

      setProposal({ amount: totalPriceFeatures, notes: '', discount: 0, discountPercent: 0, taxRate: 12, commissionRate: 5 });

      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Berhasil',
        message: 'Proposal harga telah ditambahkan.',
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
        message: 'Gagal menambahkan proposal harga. Silakan coba lagi.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPmHistoryNote = async () => {
    if (!pmHistoryNote.trim()) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Catatan Kosong',
        message: 'Harap masukkan catatan untuk riwayat negosiasi.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
      return;
    }

    setLoading(true);
    try {
      const newProposal: PricingProposal = {
        id: crypto.randomUUID(),
        orderId: data.id,
        amount: '0',
        discount: '0',
        taxRate: '0',
        commissionRate: '0',
        notes: pmHistoryNote,
        proposedBy: 'PM',
        createdAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setData({
        ...data,
        pricingProposals: [...(data.pricingProposals || []), newProposal],
      });

      setPmHistoryNote('');

      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Berhasil',
        message: 'Catatan negosiasi telah ditambahkan.',
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
        message: 'Gagal menambahkan catatan negosiasi. Silakan coba lagi.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAgreement = async () => {
    if (!latestValidProposal) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Tidak Ada Proposal',
        message: 'Harap tambahkan setidaknya satu proposal harga sebelum mengonfirmasi.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      });
      return;
    }

    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Konfirmasi Kesepakatan',
      message: 'Yakin ingin mengonfirmasi harga dan syarat pembayaran? Ini akan mengunci perubahan.',
      confirmText: 'Konfirmasi',
      cancelText: 'Batal',
      onConfirm: async () => {
        setLoading(true);
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));

          setData({
            ...data,
            pricingStatus: 'confirmed',
            paymentTerms,
            paymentStatus: 'pending',
            totalPriceFinal: String(displayFinalTotal),
          });

          setAlertConfig({
            isOpen: true,
            type: 'alert',
            title: 'Berhasil',
            message: 'Kesepakatan harga telah dikonfirmasi.',
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
            message: 'Gagal mengonfirmasi kesepakatan. Silakan coba lagi.',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
            onCancel: () => {},
          });
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const handleReopenNegotiation = async () => {
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Buka Kembali Negosiasi',
      message: 'Yakin ingin membuka kembali negosiasi harga? Ini akan memungkinkan perubahan harga dan syarat.',
      confirmText: 'Buka Kembali',
      cancelText: 'Batal',
      onConfirm: async () => {
        setLoading(true);
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));

          setData({
            ...data,
            pricingStatus: 'negotiating',
          });

          setAlertConfig({
            isOpen: true,
            type: 'alert',
            title: 'Berhasil',
            message: 'Negosiasi harga telah dibuka kembali.',
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
            message: 'Gagal membuka kembali negosiasi. Silakan coba lagi.',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
            onCancel: () => {},
          });
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const handleMarkPaid = async () => {
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Tandai Dibayar',
      message: 'Yakin ingin menandai pembayaran sebagai diterima? Pastikan bukti pembayaran telah diverifikasi.',
      confirmText: 'Tandai Dibayar',
      cancelText: 'Batal',
      onConfirm: async () => {
        setLoading(true);
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));

          setData({
            ...data,
            paymentStatus: 'paid',
          });

          setAlertConfig({
            isOpen: true,
            type: 'alert',
            title: 'Berhasil',
            message: 'Pembayaran telah ditandai sebagai diterima.',
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
            message: 'Gagal menandai pembayaran. Silakan coba lagi.',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
            onCancel: () => {},
          });
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-8">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <DollarSign size={20} className="text-gray-500" />
        Harga dan Pembayaran
      </h2>

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
            <span>Diskon ({latestValidProposal ? ((Number(latestValidProposal.discount) / Number(latestValidProposal.amount)) * 100).toFixed(1) : 0}%):</span>
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
            <span>Rp {(Number(data.totalPriceFinal) || displayFinalTotal).toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Perhitungan: Total Fitur - Diskon = Subtotal; Subtotal + Pajak + Komisi = Total Akhir
          </p>
        </div>
      </div>

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
                  onChange={(e) => setProposal({ ...proposal, amount: Number(e.target.value), discount: 0, discountPercent: 0 })}
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  disabled={isAgreementConfirmed || loading}
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
                  onChange={(e) =>
                    setProposal({ ...proposal, discount: Number(e.target.value), discountPercent: (Number(e.target.value) / proposal.amount) * 100 })
                  }
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  disabled={isAgreementConfirmed || loading}
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
                  onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  disabled={isAgreementConfirmed || loading}
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
                  onChange={(e) => setProposal({ ...proposal, taxRate: Number(e.target.value) })}
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  disabled={isAgreementConfirmed || loading}
                  min="0"
                  max="100"
                  step="0.1"
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
                  onChange={(e) => setProposal({ ...proposal, commissionRate: Number(e.target.value) })}
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  disabled={isAgreementConfirmed || loading}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-600">Catatan Proposal</label>
              <textarea
                placeholder="Masukkan catatan untuk proposal ini..."
                value={proposal.notes}
                onChange={(e) => setProposal({ ...proposal, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                rows={3}
                disabled={isAgreementConfirmed || loading}
              />
            </div>
          </div>
          <button
            onClick={handleAddProposal}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isAgreementConfirmed || loading}
          >
            <PlusCircle size={16} />
            {loading ? 'Menambahkan...' : 'Tambah Proposal'}
          </button>
        </div>
      )}

      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <FileText size={16} className="text-gray-500" />
          Riwayat Negosiasi
        </h3>
        {data.pricingProposals?.length ? (
          <ul className="space-y-3">
            {data.pricingProposals
              .slice()
              .reverse()
              .map((prop) => (
                <li key={prop.id} className="border border-gray-200 rounded-md p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      {new Date(prop.createdAt).toLocaleDateString('id-ID')}
                    </span>
                    <span className={`text-xs font-medium ${prop.proposedBy === 'PM' ? 'text-blue-600' : 'text-green-600'}`}>
                      {prop.proposedBy === 'PM' ? 'Manajer Proyek' : 'Klien'}
                    </span>
                  </div>
                  {Number(prop.amount) > 0 ? (
                    <div className="mt-2 space-y-1">
                      <p>Jumlah: Rp {Number(prop.amount).toLocaleString()}</p>
                      <p>Diskon: Rp {Number(prop.discount || 0).toLocaleString()}</p>
                      <p>Pajak: {prop.taxRate}%</p>
                      <p>Komisi: {prop.commissionRate}%</p>
                      {prop.notes && <p className="text-gray-600">Catatan: {prop.notes}</p>}
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-600">Catatan: {prop.notes}</p>
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Belum ada riwayat negosiasi.</p>
        )}
        {!isAgreementConfirmed && (
          <div className="mt-4">
            <label className="text-xs font-medium text-gray-600">Tambah Catatan Negosiasi</label>
            <textarea
              placeholder="Masukkan catatan negosiasi..."
              value={pmHistoryNote}
              onChange={(e) => setPmHistoryNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              rows={3}
              disabled={loading}
            />
            <button
              onClick={handleAddPmHistoryNote}
              className={`mt-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <FileText size={16} />
              {loading ? 'Menambahkan...' : 'Tambah Catatan'}
            </button>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Handshake size={16} className="text-gray-500" />
          Syarat Pembayaran
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Metode Pembayaran</label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value as 'full' | 'installments' | 'milestones')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              disabled={isAgreementConfirmed || loading}
            >
              <option value="full">Pembayaran Penuh</option>
              <option value="installments">Cicilan</option>
              <option value="milestones">Berdasarkan Milestone</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(data.pricingStatus || 'negotiating')}`}>
              Status Harga: {data.pricingStatus === 'negotiating' ? 'Negosiasi' : 'Dikonfirmasi'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(data.paymentStatus || 'pending')}`}>
              Status Pembayaran: {data.paymentStatus === 'pending' ? 'Menunggu' : 'Dibayar'}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {!isAgreementConfirmed && (
            <button
              onClick={handleConfirmAgreement}
              className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <CheckCircle size={16} />
              {loading ? 'Mengonfirmasi...' : 'Konfirmasi Kesepakatan'}
            </button>
          )}
          {isAgreementConfirmed && data.paymentStatus !== 'paid' && (
            <>
              <button
                onClick={handleReopenNegotiation}
                className={`bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                <Undo2 size={16} />
                {loading ? 'Membuka...' : 'Buka Kembali Negosiasi'}
              </button>
              <button
                onClick={handleMarkPaid}
                className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                <CheckCircle size={16} />
                {loading ? 'Menandai...' : 'Tandai Dibayar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}