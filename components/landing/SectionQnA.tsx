// components/SectionQnA.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const qnaData = [
    {
      question: "1. Berapa lama proses pengerjaan aplikasi?",
      answer: [
        "Waktu pengerjaan tergantung pada kompleksitas sistem dan paket yang dipilih. Rata-rata:",
        "- Website company profile: 1–2 minggu",
        "- Sistem internal (POS, CRM, Manajemen): 3–6 minggu",
        "- Custom app atau platform startup: 1–2 bulan",
        "Waktu lebih detail seperti jadwal konsultasi, desain, pengembangan, dan peluncuran, akan ditentukan setelah scope jelas."
      ],
    },
    {
      question: "2. Apakah saya bisa hanya menggunakan jasa desain saja?",
      answer: [
        "Tentu. Kami menerima pengerjaan desain UI/UX secara terpisah.",
        "Layanan ini cocok untuk klien yang sudah memiliki tim development sendiri."
      ],
    },
    {
      question: "3. Apakah ada sistem revisi?",
      answer: [
        "Ya, setiap tahap memiliki kesempatan revisi:",
        "- 1x revisi flow sistem (gratis)",
        "- 2x revisi desain (gratis)",
        "- 1x revisi minor saat development",
        "Revisi tambahan akan dikenakan biaya sesuai estimasi waktu pengerjaan tambahan."
      ],
    },
    {
      question: "4. Apakah saya bisa mengubah fitur di tengah pengerjaan?",
      answer: [
        "Perubahan fitur besar saat development tidak disarankan.",
        "Namun, bisa dilakukan dengan penyesuaian waktu dan biaya.",
        "Sebaiknya semua fitur dikunci sebelum tahap development dimulai."
      ],
    },
    {
      question: "5. Saya tidak paham teknis, apakah bisa tetap konsultasi?",
      answer: [
        "Justru itu alasan kami menyediakan Product Manager.",
        "Ia akan menerjemahkan kebutuhan Anda ke dalam sistem teknis dengan bahasa yang mudah dipahami."
      ],
    },
    {
      question: "6. Apakah bisa mencicil pembayaran?",
      answer: [
        "Ya. Pembayaran dibagi dalam 4 tahap:",
        "Tahap 1: Setelah persetujuan flow sistem (Down Payment) untuk memastikan klien yang bersungguh-sungguh.",
        "Tahap 2: Setelah desain disetujui. Setelah design selesai, ditahap ini klien diperbolehkan untuk tidak melanjutkan proyeknya jika kurang puas atau sudah punya tim developer sendiri.",
        "Tahap 3: Setelah project selesai dikembangkan",
        "Tahap 4: Project siap diluncurkan atau digunakan",
        "Bahkan kami menyediakan trial untuk menguji aplikasi sebelum membayar keseluruhannya.",
      ],
    },
    {
      question: "7. Apakah source code diserahkan ke klien?",
      answer: [
        "Ya. Source code dan dokumentasi dasar akan diserahkan saat project selesai.",
        "Kecuali jika Anda memilih paket yang tidak termasuk source handover."
      ],
    },
    {
      question: "8. Apakah saya bisa update sistem sendiri setelah live?",
      answer: [
        "Jika Anda memilih paket dengan dashboard admin atau CMS, tentu bisa.",
        "Kami juga menawarkan training singkat dan dokumentasi pengguna agar Anda bisa mengelola sistem secara mandiri."
      ],
    },
    {
      question: "9. Apakah sistem saya aman dari serangan hacker?",
      answer: [
        "Kami menerapkan standar keamanan dasar, seperti:",
        "- Validasi input/output",
        "- Proteksi dari SQL Injection & XSS",
        "- Autentikasi JWT atau OAuth2",
        "- Middleware proteksi role/user",
        "Untuk kebutuhan keamanan tinggi (seperti pembayaran atau data sensitif), kami sarankan menggunakan paket advance dengan konfigurasi DevOps dan keamanan tambahan."
      ],
    },
    {
      question: "10. Apakah sistem akan terus kami rawat setelah live?",
      answer: [
        "Kami memberikan 14 hari masa garansi (bug fixing).",
        "Setelah itu, Anda bisa memilih layanan maintenance bulanan (opsional) atau mengelola sendiri sistem Anda."
      ],
    },
    {
      question: "11. Apakah saya bisa lihat progres selama pengerjaan?",
      answer: [
        "Ya. Kami menyediakan sistem task project management di my-page Anda setelah login.",
        "Anda akan diberi akses agar bisa memantau perkembangan, status tiap tahap, dan deadline.",
        "Anda juga akan berdiskusi aktif, untuk fitur yang akan dibuat agar pemahaman klien dan tim benar-benar sevisi."
      ],
    },
    {
      question: "12. Apa yang harus saya siapkan sebelum konsultasi?",
      answer: [
        "Cukup siapkan ide dasar, tujuan bisnis, dan jika ada:",
        "- Referensi desain",
        "- Data operasional (proses konvensional saat ini)",
        "- Gambaran fitur yang dibutuhkan",
        "Kami akan bantu menyusun semuanya jadi sistem digital yang rapi."
      ],
    },
    {
      question: "13. Apakah saya perlu hosting atau domain sendiri?",
      answer: [
        "Tidak harus. Kami bisa bantu siapkan dan kelola domain & hosting Anda, atau menggunakan akun Anda sendiri.",
        "Untuk project skala besar, kami sarankan menggunakan VPS atau layanan cloud seperti Vercel, DigitalOcean, atau CloudPanel."
      ],
    },
    {
      question: "14. Apakah aplikasi bisa diakses lewat HP dan desktop?",
      answer: [
        "Ya. Semua aplikasi kami bersifat responsive (multi-device ready) dan bisa dibuka melalui browser HP maupun desktop.",
        "Namun untuk harga ekonomis, kami sarankan menggunakan Web App (PWA) daripada membangun aplikasi seperti di play store/ app store."
      ],
    },
    {
      question: "15. Apakah bisa terintegrasi dengan sistem eksternal seperti Google Sheet, Google form atau yang lainnya?",
      answer: [
        "Tentu bisa, tergantung paket yang Anda pilih. Integrasi sistem eksternal untuk beberapa kebutuhan seperti:",
        "- Auto reply WhatsApp",
        "- Kirim notifikasi via WhatsApp",
        "- Mengumpulkan riview dan ulasan di google maps",
        "- Data analisis untuk tracking hasil penjualan",
        "- Google Sheets (untuk laporan otomatis)",
        "- Google Calendar",
        "- API logistik, e-wallet, payment gateway, bahkan ERP lain",
      ],
    },
    {
      question: "16. Apakah ada NDA (Non-Disclosure Agreement)?",
      answer: [
        "Jika Anda ingin kerahasiaan project dijaga, kami siap menandatangani NDA agar seluruh informasi internal Anda tetap aman."
      ],
    },
    {
      question: "17. Bisakah saya upgrade sistem di masa depan?",
      answer: [
        "Tentu. Sistem kami dirancang modular, jadi bisa dikembangkan lebih lanjut di kemudian hari — baik fitur, desain, maupun performa."
      ],
    },
    {
      question: "18. Apakah sistem akan langsung online setelah selesai?",
      answer: [
        "Setelah tahap finalisasi dan pembayaran selesai, sistem akan di-deploy dan online sesuai domain/hosting yang disepakati.",
        "Kami juga akan bantu proses migrasi jika dibutuhkan."
      ],
    },
    {
      question: "19. Saya butuh sistem untuk internal tim, bukan publik. Bisa?",
      answer: [
        "Bisa. Banyak klien kami membangun sistem internal seperti:",
        "- Sistem manajemen karyawan",
        "- CRM internal",
        "- Inventory gudang",
        "- Dashboard keuangan",
        "Aplikasi bisa dibuat hanya bisa diakses oleh internal tim saja, dengan login aman."
      ],
    },
    {
      question: "20. Apakah saya harus paham teknis untuk bisa bekerja sama?",
      answer: [
        "Tidak perlu. Tugas kami adalah menerjemahkan kebutuhan bisnis Anda ke dalam sistem digital yang efisien.",
        "Kami akan bantu dari awal hingga akhir, dengan bahasa yang mudah dimengerti — no tech jargon."
      ],
    },
    {
      question: "21. Bagaimana dengan pelatihan penggunaan sistem?",
      answer: [
        "Kami sediakan:",
        "- Kami akan mengadakan meeting online untuk uji coba aplikasi dan melihat langsung demo web aplikasi dari tim kami.",
        "- Dokumen panduan akan ada di my-page/proyek/panduan (jika dibutuhkan)",
      ],
    },
    {
      question: "22. Apakah bisa minta revisi desain/fitur?",
      answer: [
        "Bisa! Kami berikan revisi dalam batas wajar sesuai scope awal.",
        "Jika revisi di luar scope (penambahan fitur baru), akan kami estimasikan ulang secara transparan."
      ],
    },
    {
      question: "23. Apakah ada garansi setelah pengerjaan selesai?",
      answer: [
        "Ya. Kami memberikan garansi bug fixing gratis selama 14 hari setelah sistem online.",
        "Jika ada error dari sisi sistem, akan kami perbaiki tanpa biaya tambahan."
      ],
    },
    {
      question: "24. Apakah saya bisa punya akses penuh ke source code?",
      answer: [
        "Bisa. Anda bisa memilih dua opsi:",
        "- Akses penuh: semua source code dan dokumentasi diberikan",
        "- Akses handover: kami bantu kelola proyek Anda dalam langganan sebagai tim teknologi online Anda. Dipertengahan perjalanan, Anda diperbolehkan mengubahnya menjadi full akses Anda untuk dikelola sendiri oleh tim khusus Anda."
      ],
    },
    {
      question: "25. Apakah bisa sistem saya multi-user dengan role yang berbeda-beda?",
      answer: [
        "Bisa. Sistem dapat dibuat dengan level akses sesuai peran, seperti:",
        "- Admin",
        "- Staff",
        "- Manajer",
        "- Viewer",
        "Masing-masing hanya bisa mengakses fitur yang sesuai."
      ],
    },
];
  

export default function SectionQnA() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
  
    const toggle = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Pertanyaan Umum (Q&amp;A)</h2>
        <div className="space-y-4">
          {qnaData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
            >
              <button
                className="w-full text-left p-4 font-medium bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggle(index)}
              >
                {item.question}
              </button>
  
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { height: 'auto', opacity: 1 },
                      collapsed: { height: 0, opacity: 0 }
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden bg-white border-t border-gray-200"
                  >
                    <div className="p-4 text-gray-700 space-y-2">
                      {Array.isArray(item.answer) ? (
                        item.answer.map((text, i) => <p key={i}>{text}</p>)
                      ) : (
                        <p>{item.answer}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    );
}
