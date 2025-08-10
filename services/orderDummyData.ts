import { Order } from '@/types/order'

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
    budgetPrice: 1000000, // Final: 750,000 - 150,000 (20% discount) + 66,000 (11% tax) + 30,000 (5% commission)
    designPreference: {
      color: 'Biru dan Putih',
      style: 'Minimalis modern',
    },
    onboarding: {
      status: 'initial',
      meetings: [
        {
          id: 'm1',
          date: '2025-08-10',
          time: '14:00',
          link: 'https://meet.google.com/abc-defg-hij',
          notes: 'Diskusi awal terkait kebutuhan fitur dan desain.',
        },
      ],
      analysisNotes: 'Klien membutuhkan website yang responsif dengan fokus pada UX yang intuitif. Solusi: Integrasi payment gateway dan fitur wishlist untuk meningkatkan konversi.',
    },
    pricingStatus: 'confirmed',
    paymentTerms: 'installments',
    paymentStatus: 'pending',
    features: [
      {
        id: 'f1',
        name: 'Login Pembeli',
        function: 'Agar pembeli bisa menyimpan histori & wishlist',
        price: 225000,
        duration: '2 hari',
        approvalStatus: 'draft',
        isMarkedForDiscussion: false,
        discussionNote: '',
        discussionStatus: 'open',
        tasks: [
          { id: 't1', title: 'Buat halaman login', status: 'done' },
          { id: 't2', title: 'Integrasi API autentikasi', status: 'in-progress' },
        ],
        requirements: [
          { id: 'r1', title: 'Halaman login responsif', status: 'pending' },
          { id: 'r2', title: 'Validasi email dan password', status: 'approved' },
        ],
      },
      {
        id: 'f2',
        name: 'Keranjang Belanja',
        function: 'Menyimpan produk sebelum checkout',
        price: 125000,
        duration: '3 hari',
        approvalStatus: 'waiting',
        isMarkedForDiscussion: false,
        discussionNote: '',
        discussionStatus: 'open',
        tasks: [{ id: 't3', title: 'Desain UI keranjang', status: 'todo' }],
        requirements: [{ id: 'r3', title: 'Tombol tambah ke keranjang', status: 'pending' }],
      },
      {
        id: 'f3',
        name: 'Transaksi Analytic',
        function: 'Mengukur performa transaksi',
        price: 150000,
        duration: '3 hari',
        approvalStatus: 'waiting',
        isMarkedForDiscussion: true,
        discussionNote: 'Mohon dikonfirmasi apakah slider bisa otomatis jalan dan swipe manual?',
        discussionStatus: 'open',
        tasks: [{ id: 't3', title: 'Desain UI transaksi', status: 'todo' }],
        requirements: [{ id: 'r3', title: 'Tombol tambah ke transaksi baru', status: 'pending' }],
      },
      {
        id: 'f4',
        name: 'Checkout',
        function: 'Menyelesaikan transaksi pembelian',
        price: 250000, // Adjusted from 2,500,000 to match total feature price of 750,000
        duration: '4 hari',
        approvalStatus: 'approved',
        isMarkedForDiscussion: false,
        discussionNote: '',
        discussionStatus: 'open',
        tasks: [{ id: 't4', title: 'Testing proses pembayaran', status: 'done' }],
        requirements: [{ id: 'r4', title: 'Integrasi payment gateway', status: 'approved' }],
      },
    ],
    totalPriceFeatures: 750000,
    pricingProposals: [
      {
        id: 'p1',
        amount: 750000,
        discount: 0,
        taxRate: 12,
        commissionRate: 5,
        notes: 'Harga awal berdasarkan fitur yang diajukan setelah konsultasi PM.',
        proposedBy: 'PM',
        createdAt: '2025-08-05T10:00:00Z',
      },
      {
        id: 'p2',
        amount: 0,
        discount: 0,
        taxRate: 0,
        commissionRate: 0,
        notes: 'Minta diskon 20% karena anggaran terbatas.',
        proposedBy: 'Client',
        createdAt: '2025-08-06T12:00:00Z',
      },
      {
        id: 'p3',
        amount: 750000, // Client proposes based on totalPriceFeatures
        discount: 150000, // 20% discount
        taxRate: 12,
        commissionRate: 5,
        notes: 'Setuju memberikan diskon 20% karena anggaran terbatas',
        proposedBy: 'PM',
        createdAt: '2025-08-06T12:00:00Z',
      },
    ],
    totalPriceFinal: 702000,
  },
]

export function getOrderById(id: string) {
  return dummyOrders.find((order) => order.id === id)
}

// Example calculation for order-001:
// 1. Total Price Features (sum of feature prices):
//    - Login Pembeli: 225,000
//    - Keranjang Belanja: 125,000
//    - Transaksi Analytic: 150,000
//    - Checkout: 250,000
//    Total: 225,000 + 125,000 + 150,000 + 250,000 = 750,000 (totalPriceFeatures)

// 2. Initial Proposal (p1):
//    - Amount: 750,000 (totalPriceFeatures)
//    - Discount: 0
//    - Subtotal: 750,000 - 0 = 750,000
//    - Tax (12%): 750,000 × 0.12 = 90,000
//    - Commission (5%): 750,000 × 0.05 = 37,500
//    - Final Total: 750,000 + 90,000 + 37,500 = 877,500

// 3. Client Negotiation (p2, requesting 20% discount):
//    - Amount: 750,000 (totalPriceFeatures, unchanged base)
//    - Discount: 750,000 × 0.20 = 150,000
//    - Subtotal: 750,000 - 150,000 = 600,000
//    - Tax (12%): 600,000 × 0.12 = 72,000
//    - Commission (5%): 600,000 × 0.05 = 30,000
//    - Final Total: 600,000 + 72,000 + 30,000 = 702,000 (totalPriceFinal)