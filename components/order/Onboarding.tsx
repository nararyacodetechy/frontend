'use client'

import { useState } from 'react'
import { Order, Meeting } from '@/types/order'
import { Calendar, Clock, Link, FileText, CheckCircle, Plus, Trash2, Copy, Undo2, Zap } from 'lucide-react'

interface OnboardingProps {
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

export default function Onboarding({ data, setData, setAlertConfig }: OnboardingProps) {
  const [newMeeting, setNewMeeting] = useState({
    date: '',
    time: '',
    link: '',
    notes: '',
    isAdHoc: false,
  })
  const [analysisNotes, setAnalysisNotes] = useState(data.onboarding?.analysisNotes || '')
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [showAdHocHistory, setShowAdHocHistory] = useState(false)

  const handleAddMeeting = (isAdHoc: boolean = false) => {
    if (!newMeeting.date || !newMeeting.time || !newMeeting.link) {
      setAlertConfig({
        isOpen: true,
        type: 'alert',
        title: 'Data Tidak Lengkap',
        message: 'Harap isi tanggal, waktu, dan link meeting.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => {},
      })
      return
    }

    const meeting: Meeting = {
      id: crypto.randomUUID(),
      date: newMeeting.date,
      time: newMeeting.time,
      link: newMeeting.link,
      notes: newMeeting.notes,
      isAdHoc,
    }

    setData(prev => ({
      ...prev!,
      onboarding: {
        ...prev!.onboarding,
        meetings: [...(prev!.onboarding?.meetings || []), meeting],
        status: isAdHoc ? prev!.onboarding?.status : 'meeting_scheduled',
      },
    }))

    setNewMeeting({ date: '', time: '', link: '', notes: '', isAdHoc: false })
  }

  const handleDeleteMeeting = (meetingId: string) => {
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Hapus Meeting',
      message: 'Yakin ingin menghapus jadwal meeting ini?',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        setData(prev => ({
          ...prev!,
          onboarding: {
            ...prev!.onboarding,
            meetings: prev!.onboarding?.meetings?.filter(m => m.id !== meetingId) || [],
          },
        }))
        setAlertConfig(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
    })
  }

  const handleSaveAnalysis = () => {
    setData(prev => ({
      ...prev!,
      onboarding: {
        ...prev!.onboarding,
        analysisNotes,
        status: 'analysis_complete',
      },
    }))
    setAlertConfig({
      isOpen: true,
      type: 'alert',
      title: 'Berhasil',
      message: 'Catatan analisis telah disimpan.',
      confirmText: 'OK',
      cancelText: '',
      onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
      onCancel: () => {},
    })
  }

  const handleMarkComplete = () => {
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Selesaikan Onboarding',
      message: 'Yakin ingin menandai onboarding sebagai selesai? Pastikan semua analisis dan meeting telah dilakukan.',
      confirmText: 'Selesai',
      cancelText: 'Batal',
      onConfirm: () => {
        setData(prev => ({
          ...prev!,
          onboarding: {
            ...prev!.onboarding,
            status: 'completed',
          },
        }))
        setAlertConfig(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
    })
  }

  const handleReopenOnboarding = () => {
    setAlertConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Buka Kembali Onboarding',
      message: 'Yakin ingin membuka kembali onboarding? Ini akan mengizinkan penambahan meeting dan pengeditan analisis.',
      confirmText: 'Buka Kembali',
      cancelText: 'Batal',
      onConfirm: () => {
        setData(prev => ({
          ...prev!,
          onboarding: {
            ...prev!.onboarding,
            status: 'analysis_complete',
          },
        }))
        setAlertConfig(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
    })
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(link)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initial':
        return 'bg-blue-100 text-blue-700'
      case 'meeting_scheduled':
        return 'bg-yellow-100 text-yellow-700'
      case 'analysis_complete':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-green-200 text-green-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const onboardingStatus = data.onboarding?.status || 'initial'
  const isCompleted = onboardingStatus === 'completed'
  const adHocMeetings = data.onboarding?.meetings?.filter(m => m.isAdHoc) || []
  const regularMeetings = data.onboarding?.meetings?.filter(m => !m.isAdHoc) || []

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileText size={20} className="text-gray-500" />
        Onboarding
      </h2>
      <div className="space-y-6">
        {/* Status Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Status Onboarding</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(onboardingStatus)}`}>
            {onboardingStatus === 'initial' && 'Review Awal'}
            {onboardingStatus === 'meeting_scheduled' && 'Meeting Dijadwalkan'}
            {onboardingStatus === 'analysis_complete' && 'Analisis Selesai'}
            {onboardingStatus === 'completed' && (
              <>
                Onboarding Selesai
                {adHocMeetings.length > 0 && ' + Meeting Dadakan'}
              </>
            )}
          </span>
        </div>

        {/* Meeting Scheduling Section */}
        {!isCompleted && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Jadwal Meeting</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Tanggal</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                  <Calendar size={16} className="text-gray-500" />
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                    disabled={isCompleted}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Waktu</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                  <Clock size={16} className="text-gray-500" />
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                    disabled={isCompleted}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Link Meeting</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                  <Link size={16} className="text-gray-500" />
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={newMeeting.link}
                    onChange={e => setNewMeeting({ ...newMeeting, link: e.target.value })}
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                    disabled={isCompleted}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Catatan</label>
                <textarea
                  placeholder="Detail meeting, agenda, dll."
                  value={newMeeting.notes}
                  onChange={e => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                  rows={3}
                  disabled={isCompleted}
                />
              </div>
            </div>
            <button
              onClick={() => handleAddMeeting()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
              disabled={isCompleted}
            >
              <Plus size={16} /> Tambah Meeting
            </button>
          </div>
        )}

        {/* Ad-Hoc Meeting Scheduling */}
        {isCompleted && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Meeting Dadakan</h3>
            <p className="text-xs text-gray-500 mb-3">Tambahkan meeting baru untuk kebutuhan mendadak.</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Tanggal</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                  <Calendar size={16} className="text-gray-500" />
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Waktu</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                  <Clock size={16} className="text-gray-500" />
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Link Meeting</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                  <Link size={16} className="text-gray-500" />
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={newMeeting.link}
                    onChange={e => setNewMeeting({ ...newMeeting, link: e.target.value })}
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Catatan</label>
                <textarea
                  placeholder="Detail meeting dadakan, agenda, dll."
                  value={newMeeting.notes}
                  onChange={e => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                  rows={3}
                />
              </div>
            </div>
            <button
              onClick={() => handleAddMeeting(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700 flex items-center gap-2"
            >
              <Zap size={16} /> Tambah Meeting Dadakan
            </button>
          </div>
        )}

        {/* Meeting History */}
        {(regularMeetings.length > 0 || adHocMeetings.length > 0) && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Riwayat Meeting</h3>
            {regularMeetings.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-2">Meeting Onboarding</h4>
                <ul className="space-y-3">
                  {regularMeetings.map(meeting => (
                    <li key={meeting.id} className="border border-gray-200 rounded-md p-3 text-sm flex justify-between items-center">
                      <div>
                        <p className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-500" />
                          <strong>{new Date(meeting.date).toLocaleDateString('id-ID')} {meeting.time}</strong>
                        </p>
                        <p className="flex items-center gap-2">
                          <Link size={14} className="text-gray-500" />
                          <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {meeting.link}
                          </a>
                          <button
                            onClick={() => handleCopyLink(meeting.link)}
                            className="text-gray-500 hover:text-gray-700 ml-2"
                            title="Salin Link"
                          >
                            <Copy size={14} />
                            {copiedLink === meeting.link && <span className="ml-1 text-xs text-green-600">Disalin!</span>}
                          </button>
                        </p>
                        {meeting.notes && <p className="text-gray-600 mt-1">{meeting.notes}</p>}
                      </div>
                      {!isCompleted && (
                        <button
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus Meeting"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {adHocMeetings.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowAdHocHistory(!showAdHocHistory)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  {showAdHocHistory ? 'Sembunyikan' : 'Tampilkan'} Meeting Dadakan
                  <span className="ml-1">{showAdHocHistory ? '▲' : '▼'}</span>
                </button>
                {showAdHocHistory && (
                  <ul className="space-y-3 mt-2">
                    {adHocMeetings.map(meeting => (
                      <li key={meeting.id} className="border border-gray-200 rounded-md p-3 text-sm flex justify-between items-center bg-yellow-50">
                        <div>
                          <p className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-500" />
                            <strong>{new Date(meeting.date).toLocaleDateString('id-ID')} {meeting.time} (Dadakan)</strong>
                          </p>
                          <p className="flex items-center gap-2">
                            <Link size={14} className="text-gray-500" />
                            <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {meeting.link}
                            </a>
                            <button
                              onClick={() => handleCopyLink(meeting.link)}
                              className="text-gray-500 hover:text-gray-700 ml-2"
                              title="Salin Link"
                            >
                              <Copy size={14} />
                              {copiedLink === meeting.link && <span className="ml-1 text-xs text-green-600">Disalin!</span>}
                            </button>
                          </p>
                          {meeting.notes && <p className="text-gray-600 mt-1">{meeting.notes}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus Meeting"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Analysis Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Analisis dan Solusi</h3>
          <textarea
            placeholder="Masukkan analisis mendalam terkait pesanan klien, solusi, dan masukkan..."
            value={analysisNotes}
            onChange={e => setAnalysisNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
            rows={6}
            disabled={isCompleted}
          />
          {!isCompleted && (
            <button
              onClick={handleSaveAnalysis}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
              Simpan Analisis
            </button>
          )}
        </div>

        {/* Complete/Reopen Onboarding */}
        <div className="flex justify-end gap-2">
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle size={16} /> Tandai Onboarding Selesai
            </button>
          )}
          {isCompleted && (
            <button
              onClick={handleReopenOnboarding}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 flex items-center gap-2"
            >
              <Undo2 size={16} /> Batalkan Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  )
}