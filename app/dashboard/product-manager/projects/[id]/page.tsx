'use client'

import { useParams } from 'next/navigation'
import { ChevronDown, ChevronRight, Pencil, Trash2, PlusCircle } from 'lucide-react'
import { getOrderById, Order, FeatureTask } from '@/services/orderDummyData'
import { useEffect, useState } from 'react'
import CustomAlert from '@/components/general/CustomAlert'

export default function ProjectDetailPage() {
    const { id } = useParams()
    const [data, setData] = useState<Order | null>(null)
    const [editFeature, setEditFeature] = useState<FeatureTask | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    
    const [newFeature, setNewFeature] = useState<FeatureTask>({
        id: '',
        name: '',
        function: '',
        price: 0,
        duration: '',
        approvalStatus: '',
    });

    // State tambahan
    const [newTask, setNewTask] = useState({ title: '', status: 'todo' });
    const [editingTask, setEditingTask] = useState<{ featureId: string; taskId: string } | null>(null);
    const [editTaskValue, setEditTaskValue] = useState('');
    const [openTasks, setOpenTasks] = useState<{ [key: string]: boolean }>({})

      // State untuk custom alert
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
    }, [id])
  
    if (!data) {
      return <div className="p-6">Order tidak ditemukan.</div>
    }

    const handleAdd = () => {
        const newF: FeatureTask = {
        ...newFeature,
        id: crypto.randomUUID(),
        approved: false,
        }
        setData(prev => ({
        ...prev,
        features: [...prev.features, newF],
        }))
        setNewFeature({ name: '', function: '', price: 0, duration: '' })
    }

    const toggleSubmission = (id: string) => {
        if (!data) return;
        const feature = data.features.find(f => f.id === id);
        if (!feature) return;
      
        if (feature.approvalStatus === 'draft') {
          // Konfirmasi untuk ajukan
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
              }));
              setAlertConfig(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
          });
        } else if (feature.approvalStatus === 'waiting') {
          // Konfirmasi untuk batalkan
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
              }));
              setAlertConfig(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
          });
        }
    };      
      
    const handleEdit = (task: FeatureTask) => {
        setEditFeature(task)
        setShowEditModal(true)
    }
    
    const handleEditSave = () => {
        if (!editFeature || !data) return
    
        const updatedFeatures = data.features.map(f => {
          if (f.id === editFeature.id) {
            if (f.approvalStatus !== 'draft') {
              setAlertConfig({
                isOpen: true,
                type: 'confirm',
                title: 'Konfirmasi Perubahan',
                message:
                  'Perubahan fitur ini memerlukan persetujuan klien.\n\nYakin ingin mengirimkan permintaan perubahan?',
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
                    onConfirm: () =>
                      setAlertConfig(prev => ({ ...prev, isOpen: false })),
                    onCancel: () => {},
                  })
                },
                onCancel: () =>
                  setAlertConfig(prev => ({ ...prev, isOpen: false })),
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

    const handleDelete = (id: string) => {
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
            onCancel: () =>
              setAlertConfig(prev => ({ ...prev, isOpen: false })),
          })
        } else {
          setAlertConfig({
            isOpen: true,
            type: 'confirm',
            title: 'Ajukan Penghapusan',
            message:
              'Fitur ini sudah diajukan atau disetujui.\n\nIngin mengajukan permintaan penghapusan fitur ke klien?',
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
                onConfirm: () =>
                  setAlertConfig(prev => ({ ...prev, isOpen: false })),
                onCancel: () => {},
              })
            },
            onCancel: () =>
              setAlertConfig(prev => ({ ...prev, isOpen: false })),
          })
        }
    }    

    // Fungsi tambah task
    const handleAddTask = (featureId: string) => {
    if (!newTask.title.trim()) return;
    setData(prev => ({
        ...prev!,
        features: prev!.features.map(f =>
        f.id === featureId
            ? {
                ...f,
                tasks: [
                ...(f.tasks || []),
                { id: crypto.randomUUID(), title: newTask.title, status: 'todo' },
                ],
            }
            : f
        ),
    }));
    setNewTask({ title: '', status: 'todo' });
    };

    // Fungsi hapus task
    const handleDeleteTask = (featureId: string, taskId: string) => {
    setData(prev => ({
        ...prev!,
        features: prev!.features.map(f =>
        f.id === featureId
            ? { ...f, tasks: f.tasks?.filter(t => t.id !== taskId) }
            : f
        ),
    }));
    };

    // Fungsi ubah status task
    const handleToggleTaskStatus = (featureId: string, taskId: string) => {
    setData(prev => ({
        ...prev!,
        features: prev!.features.map(f =>
        f.id === featureId
            ? {
                ...f,
                tasks: f.tasks?.map(t =>
                t.id === taskId
                    ? {
                        ...t,
                        status:
                        t.status === 'todo'
                            ? 'in-progress'
                            : t.status === 'in-progress'
                            ? 'done'
                            : 'todo',
                    }
                    : t
                ),
            }
            : f
        ),
    }));
    };

    const handleEditTask = (featureId: string, taskId: string, currentTitle: string) => {
        setEditingTask({ featureId, taskId });
        setEditTaskValue(currentTitle);
    };

    const handleSaveEditTask = () => {
        if (!editingTask) return;
        setData(prev => ({
            ...prev!,
            features: prev!.features.map(f =>
                f.id === editingTask.featureId
                    ? {
                        ...f,
                        tasks: f.tasks?.map(t =>
                            t.id === editingTask.taskId ? { ...t, title: editTaskValue } : t
                        ),
                    }
                    : f
            ),
        }));
        setEditingTask(null);
        setEditTaskValue('');
    };    
      
    return (
        <>
        {/* Custom Alert */}
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
                        onClick={handleEditSave}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Simpan Perubahan
                    </button>
                    </div>
                </div>
                </div>
            )}
            
            <div className="space-y-6">
                <div className="border border-gray-300 rounded-md p-4 flex flex-col gap-4">
                    <h1 className="text-gray-700 text-md font-semibold">Information Client</h1>
                    <div className="flex items-center gap-10">
                        <img src={data.imageProfile || '/images/no-picture-profile.png'} alt="Foto Klien" className="w-24 h-24 object-cover rounded-full border border-gray-400" />
                        <div className="text-sm space-y-1">
                            <p><strong>ID Klien:</strong> {data.clientId}</p>
                            <p><strong>Username:</strong> @{data.username}</p>
                            <p><strong>Nama:</strong> {data.clientName}</p>
                            <p><strong>NIK:</strong> {data.nik}</p>
                        </div>
                        <div className="text-sm space-y-1">
                            <p><strong>Email:</strong> {data.email}</p>
                            <p><strong>Alamat:</strong> {data.address}</p>
                            <p><strong>Telepon:</strong> {data.phone}</p>
                            <p><strong>Perusahaan:</strong> {data.company}</p>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-300 rounded-md p-4 flex flex-col gap-4">
                    <h1 className="text-gray-700 text-md font-semibold">1. Detail Order</h1>
                    <div className="flex items-start gap-10">
                        <img src={data.imgIdOrder || '/images/no-picture-order.svg'} alt="Gambar ID Order" className="w-48 h-48 border border-gray-400 rounded" />
                        <div className="text-sm space-y-1">
                            <p><strong>ID Order:</strong> {data.id}</p>
                            <p><strong>Nama Order:</strong> {data.orderName}</p>
                            <p><strong>No Order:</strong> {data.orderNumber}</p>
                            <p><strong>Jenis:</strong> {data.projectType}</p>
                            <p><strong>Detail Proyek:</strong> {data.projectDetail}</p>
                            <p><strong>Tanggal Order:</strong> {new Date(data.createdAt || '').toLocaleString()}</p>
                            <p><strong>Status:</strong> {data.status}</p>
                            <p><strong>Preferensi Desain:</strong> {data.designPreference?.color} – {data.designPreference?.style}</p>
                            <p><strong>Referensi:</strong> <a href={data.reference} className="text-blue-600 underline">{data.reference}</a></p>
                            <p><strong>Metode Pembayaran:</strong> {data.paymentMethod}</p>
                            <p><strong>Total Harga:</strong> Rp{data.totalPrice?.toLocaleString()}</p>
                            {data.paymentProof && (
                            <p><strong>Bukti Pembayaran:</strong><br />
                                <img src={data.paymentProof} alt="Bukti Transfer" className="mt-2 w-64 border rounded" />
                            </p>
                            )}
                        </div>
                    </div>

                </div>

                <div className="border border-gray-300 p-4 flex flex-col gap-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700 text-md">Add Feature</h3>
                        <div className="flex flex-col md:flex-row gap-2">
                            <input type="text" placeholder="Nama fitur" className="border border-gray-400 px-2 py-1 rounded w-full" value={newFeature.name} onChange={e => setNewFeature({ ...newFeature, name: e.target.value })} />
                            <input type="text" placeholder="Function" className="border border-gray-400 px-2 py-1 rounded w-full" value={newFeature.function} onChange={e => setNewFeature({ ...newFeature, function: e.target.value })} />
                            <input type="number" placeholder="Harga" className="border border-gray-400 px-2 py-1 rounded w-32" value={newFeature.price} onChange={e => setNewFeature({ ...newFeature, price: Number(e.target.value) })} />
                            <input type="text" placeholder="Durasi" className="border border-gray-400 px-2 py-1 rounded w-32" value={newFeature.duration} onChange={e => setNewFeature({ ...newFeature, duration: e.target.value })} />
                            <button onClick={handleAdd} className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 flex items-center gap-1">
                                <PlusCircle size={16} /> Add
                            </button>
                        </div>
                    </div>
                    <ul className="space-y-2">
                        <h2 className="text-gray-700 text-md font-semibold mt-2">3. List Features</h2>
                        {data.features.map(task => (
                            <li key={task.id} className="border border-gray-400 p-3 rounded text-sm flex flex-col justify-between items-start">
                                <div className="flex w-full justify-between space-y-2">
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            {task.name} — Rp. {task.price.toLocaleString()} ({task.duration})
                                        </p>
                                        <p className="italic text-gray-600">Fungsi: {task.function}</p>
                                        <p>
                                            Status:{' '}
                                            {task.approvalStatus === 'approved' && (
                                            <span className="bg-green-200 px-1 rounded text-green-600">Disetujui</span>
                                            )}
                                            {task.approvalStatus === 'waiting' && (
                                            <span className="bg-yellow-200 px-1 rounded text-yellow-600">Menunggu</span>
                                            )}
                                            {task.approvalStatus === 'draft' && (
                                            <span className="bg-gray-200 px-1 rounded text-gray-500">Draft</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 items-start flex-wrap">
                                        {/* AJUKAN / BATALKAN PENGAJUAN */}
                                        {task.approvalStatus !== 'approved' && (
                                            <button
                                            onClick={() => toggleSubmission(task.id)}
                                            className="text-xs px-2 py-0.5 bg-gray-200 border-none rounded-sm hover:bg-gray-100"
                                            >
                                            {task.approvalStatus === 'draft' ? 'Ajukan' : 'Batalkan'}
                                            </button>
                                        )}

                                        {/* EDIT BUTTON */}
                                        <div
                                            className={task.approvalStatus === 'waiting' ? 'cursor-not-allowed' : ''}
                                            title={task.approvalStatus === 'waiting' ? 'Fitur sedang diajukan ke klien' : ''}
                                        >
                                            <button
                                            onClick={() => handleEdit(task)}
                                            className={`rounded-sm p-1 border  
                                                ${task.approvalStatus === 'waiting' 
                                                ? 'text-gray-400 border-gray-300 bg-gray-100' 
                                                : 'text-yellow-600 border-yellow-400 hover:text-yellow-800 bg-yellow-100'}
                                            `}
                                            disabled={task.approvalStatus === 'waiting'}
                                            >
                                            <Pencil size={14} />
                                            </button>
                                        </div>

                                        {/* DELETE BUTTON + NOTIFIKASI */}
                                        <div
                                            className={task.approvalStatus === 'waiting' ? 'cursor-not-allowed' : ''}
                                            title={task.approvalStatus === 'waiting' ? 'Fitur sedang diajukan ke klien' : ''}
                                            >
                                            {/* Tombol hanya ditampilkan jika belum diajukan untuk dihapus */}
                                            {!task.deletionRequest && (
                                                <button
                                                onClick={() => handleDelete(task.id)}
                                                className={`rounded-sm p-1 border 
                                                    ${task.approvalStatus === 'waiting' 
                                                    ? 'text-gray-400 border-gray-300 bg-gray-100' 
                                                    : 'text-red-600 border-red-400 bg-red-100 hover:text-red-800'}
                                                `}
                                                disabled={task.approvalStatus === 'waiting'}
                                                >
                                                <Trash2 size={14} />
                                                </button>
                                            )}

                                            {/* NOTIFIKASI PENGAJUAN PENGHAPUSAN */}
                                            {task.deletionRequest && (
                                                <p className="text-xs mt-1 text-gray-400 italic">
                                                    Penghapusan fitur sedang diajukan ke klien
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* COLLAPSIBLE TASKS */}
                                <div className="w-full mt-2">
                                    <button
                                        onClick={() => setOpenTasks(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
                                        className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-800"
                                    >
                                        {openTasks[task.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        Tasks ({(task.tasks || []).length})
                                    </button>

                                    {openTasks[task.id] && (
                                        <div className="mt-2">
                                            {/* LIST TASK */}
                                            <ul className="space-y-1">
                                                {(task.tasks || []).map(t => (
                                                    <li
                                                        key={t.id}
                                                        className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded hover:bg-gray-100"
                                                    >
                                                        <div className="flex items-center gap-2 flex-1">
                                                            {/* Tombol Ubah Status */}
                                                            <button
                                                                onClick={() => handleToggleTaskStatus(task.id, t.id)}
                                                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-700 bg-gray-200`}
                                                            >
                                                                {t.status === 'todo' ? 'Todo' :
                                                                t.status === 'in-progress' ? 'Progress' : 'Done'}
                                                            </button>

                                                            {/* Edit Inline - Klik teks langsung ubah */}
                                                            {editingTask?.featureId === task.id && editingTask?.taskId === t.id ? (
                                                                <input
                                                                    type="text"
                                                                    value={editTaskValue}
                                                                    onChange={(e) => setEditTaskValue(e.target.value)}
                                                                    onBlur={handleSaveEditTask} // Simpan saat blur
                                                                    autoFocus
                                                                    className="flex-1 bg-transparent px-1 text-gray-700 focus:outline-none"
                                                                />
                                                            ) : (
                                                                <span
                                                                    className={`flex-1 text-gray-700 ${t.status === 'done' ? 'line-through text-gray-500' : ''}`}
                                                                    onClick={() => handleEditTask(task.id, t.id, t.title)}
                                                                >
                                                                    {t.title}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Tombol Hapus */}
                                                        <button
                                                            onClick={() => handleDeleteTask(task.id, t.id)}
                                                            className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* FORM TAMBAH TASK */}
                                            <div className="flex gap-1 mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Tambah task..."
                                                    value={newTask[task.id] || ''}
                                                    onChange={e =>
                                                        setNewTask({ ...newTask, [task.id]: e.target.value })
                                                    }
                                                    className="bg-gray-100 px-2 py-1 text-xs rounded w-full focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        handleAddTask(task.id, newTask[task.id] || '');
                                                        setNewTask({ ...newTask, [task.id]: '' });
                                                    }}
                                                    className="bg-gray-300 text-gray-700 px-2 rounded text-xs hover:bg-gray-400"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
