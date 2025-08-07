// services/orderDummyData.ts
import { Order } from '@/types/order-types'

export const dummyOrders: Order[] = [
  {
    id: 'order-001',
    orderName: 'Pembuatan Toko Baju Online',
    clientName: 'Bagus Nararya',
    username: 'bagusnararya',
    nik: '3210123456789001',
    email: 'bagus@example.com',
    clientId: 'client-123',
    orderNumber: 'ORD-0001',
    projectType: 'Website Toko Online',
    projectDetail: 'Website untuk penjualan baju dengan sistem pembayaran online.',
    reference: 'https://tokobajuinspirasi.com',
    image: '/placeholder.jpg',
    status: 'Menunggu',
    createdAt: '2025-08-01T10:00:00Z',
    paymentMethod: 'Transfer Bank',
    paymentProof: '/images/bukti-transfer.jpg',
    address: 'Jl. Mawar No. 45, Yogyakarta',
    phone: '081234567890',
    company: 'CV Baju Bagus',
    imageProfile: '',
    imgIdOrder: '',
    totalPrice: 3000000,
    designPreference: {
      color: 'Biru dan Putih',
      style: 'Minimalis modern',
    },
    features: [
      {
        id: 'f1',
        name: 'Login Pembeli',
        function: 'Agar pembeli bisa menyimpan histori & wishlist',
        price: 500000,
        duration: '2 hari',
        approvalStatus: 'draft',
        isMarkedForDiscussion: false,
        discussionNote: '',
        tasks: [
          { id: 't1', title: 'Buat halaman login', status: 'done' },
          { id: 't2', title: 'Integrasi API autentikasi', status: 'in-progress' }
        ],
        requirements: [
          { id: 'r1', title: 'Halaman login responsif', status: 'pending' },
          { id: 'r2', title: 'Validasi email dan password', status: 'approved' }
        ]
      },
      {
        id: 'f2',
        name: 'Keranjang Belanja',
        function: 'Menyimpan produk sebelum checkout',
        price: 700000,
        duration: '3 hari',
        approvalStatus: 'waiting',
        isMarkedForDiscussion: false,
        discussionNote: '',
        tasks: [
          { id: 't3', title: 'Desain UI keranjang', status: 'todo' }
        ],
        requirements: [
          { id: 'r3', title: 'Tombol tambah ke keranjang', status: 'pending' }
        ]
      },
      {
        id: 'f3',
        name: 'Keranjang Belanja',
        function: 'Menyimpan produk sebelum checkout',
        price: 700000,
        duration: '3 hari',
        approvalStatus: 'waiting',
        isMarkedForDiscussion: false,
        discussionNote: '',
        tasks: [
          { id: 't3', title: 'Desain UI keranjang', status: 'todo' }
        ],
        requirements: [
          { id: 'r3', title: 'Tombol tambah ke keranjang', status: 'pending' }
        ]
      },
      {
        id: 'f4',
        name: 'Checkout',
        function: 'Menyelesaikan transaksi pembelian',
        price: 800000,
        duration: '4 hari',
        approvalStatus: 'approved',
        isMarkedForDiscussion: true,
        discussionNote: 'Mohon dikonfirmasi apakah slider bisa otomatis jalan dan swipe manual?',
        tasks: [
          { id: 't4', title: 'Testing proses pembayaran', status: 'done' }
        ],
        requirements: [
          { id: 'r4', title: 'Integrasi payment gateway', status: 'approved' }
        ]
      }
    ]
  },
  {
    id: 'order-002',
    orderName: 'Website Profil Perusahaan Konstruksi',
    clientName: 'Sinta Rahayu',
    username: 'sintarahayu',
    nik: '3210987654321002',
    email: 'sinta@example.com',
    clientId: 'client-456',
    orderNumber: 'ORD-0002',
    projectType: 'Company Profile',
    projectDetail: 'Profil perusahaan kontraktor dengan galeri proyek.',
    reference: 'https://kontraktorindah.co.id',
    image: '/placeholder.jpg',
    status: 'Dalam Kajian',
    createdAt: '2025-08-02T14:30:00Z',
    paymentMethod: 'Transfer Bank',
    paymentProof: '/images/bukti-transfer2.jpg',
    address: 'Jl. Melati No. 10, Jakarta',
    phone: '082345678901',
    company: 'PT Konstruksi Indah',
    imageProfile: '',
    imgIdOrder: '',
    totalPrice: 4500000,
    designPreference: {
      color: 'Abu-abu dan Biru Laut',
      style: 'Profesional korporat',
    },
    features: [
      {
        id: 'f5',
        name: 'Galeri Proyek',
        function: 'Menampilkan dokumentasi proyek sebelumnya',
        price: 1500000,
        duration: '3 hari',
        approvalStatus: 'draft',
        isMarkedForDiscussion: false,
        discussionNote: '',
        tasks: [
          { id: 't5', title: 'Desain halaman galeri', status: 'todo' }
        ],
        requirements: [
          { id: 'r5', title: 'Upload foto proyek', status: 'pending' }
        ]
      }
    ]
  },
  {
    id: 'order-003',
    orderName: 'Landing Page Produk Digital',
    clientName: 'Rico Pratama',
    username: 'ricoprtm',
    nik: '3210678912345678',
    email: 'ricoprtm@example.com',
    clientId: 'client-789',
    orderNumber: 'ORD-0003',
    projectType: 'Landing Page',
    projectDetail: 'Halaman promosi produk digital dengan CTA dan testimoni.',
    reference: 'https://productdigital.id',
    image: '/placeholder.jpg',
    status: 'Selesai',
    createdAt: '2025-07-28T09:00:00Z',
    paymentMethod: 'QRIS',
    paymentProof: '/images/bukti-transfer3.jpg',
    address: 'Jl. Anggrek No. 5, Bandung',
    phone: '085612345678',
    company: 'Freelance Creator',
    imageProfile: '',
    imgIdOrder: '',
    totalPrice: 1200000,
    designPreference: {
      color: 'Hijau Toska',
      style: 'Modern clean',
    },
    features: [
      {
        id: 'f6',
        name: 'CTA WhatsApp',
        function: 'Meningkatkan konversi langsung',
        price: 200000,
        duration: '1 hari',
        approvalStatus: 'approved',
        isMarkedForDiscussion: false,
        discussionNote: '',
        tasks: [],
        requirements: [
          { id: 'r6', title: 'Tombol WA muncul di mobile', status: 'approved' }
        ]
      },
      {
        id: 'f7',
        name: 'Bagian Testimoni',
        function: 'Menambah kepercayaan pengguna baru',
        price: 300000,
        duration: '1 hari',
        approvalStatus: 'draft',
        isMarkedForDiscussion: false,
        discussionNote: '',
        tasks: [],
        requirements: [
          { id: 'r7', title: 'Tambahkan slider testimoni', status: 'pending' }
        ]
      }
    ]
  }
]

export function getOrderById(id: string) {
  return dummyOrders.find((order) => order.id === id)
}
