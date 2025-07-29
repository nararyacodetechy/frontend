"use client";

export const reasonsToBuildWebApp = [
  // Bagian 2: Alasan Tujuan Bisnis
  {
    bigTitle: 'Alasan Tujuan Bisnis',
    items: [
      {
        title: 'Menambah Nilai Bisnis',
        description:
          'Produk digital meningkatkan persepsi profesionalisme dan kemajuan usaha.',
      },
      {
        title: 'Meningkatkan Kepercayaan Klien',
        description:
          'Aplikasi menunjukkan bahwa bisnis Anda serius dan transparan dalam pengelolaan.',
      },
      {
        title: 'Bisa Dipamerkan ke Investor',
        description:
          'Produk digital menunjukkan skala dan potensi bisnis yang siap berkembang.',
      },
      {
        title: 'Aset Digital Bisnis',
        description:
          'Aplikasi web adalah aset yang memiliki nilai tambah di masa depan.',
      },
      {
        title: 'Mendukung Skala Nasional / Global',
        description:
          'Bisnis lokal bisa menjangkau pasar lebih luas tanpa batasan wilayah.',
      },
      {
        title: 'Efisiensi Internal = Margin Lebih Besar',
        description:
          'Waktu staf tersimpan, kinerja meningkat, sehingga laba bersih naik.',
      },
      {
        title: 'Lebih Siap Masuk Era Digital',
        description:
          'Persaingan bisnis makin digital. Memiliki aplikasi adalah modal dasar.',
      },
      {
        title: 'Kepuasan Klien Lebih Tinggi',
        description:
          'Klien bisa mendapatkan layanan yang cepat, transparan, dan mudah digunakan.',
      },
      {
        title: 'Visibilitas dan Kontrol Penuh',
        description:
          'Pemilik usaha bisa mengontrol semua aktivitas bisnis tanpa harus hadir fisik.',
      },
      {
        title: 'Pembeda dengan Kompetitor',
        description:
          'Jika kompetitor belum memiliki sistem, maka Anda satu langkah lebih maju.',
      },
    ],
  },

  // Bagian 2: Alasan Mendesak (Jika Tanpa Web App)
  {
    bigTitle: 'Alasan Mendesak (Jika Tanpa Web App)',
    items: [
      {
        title: 'Tumpukan Chat Tidak Terorganisir',
        description:
          'Pesanan, komplain, dan pertanyaan tersebar di WhatsApp tanpa sistem.',
      },
      {
        title: 'Data Hilang karena Salah Simpan',
        description:
          'File Excel tercecer, tidak tersimpan cloud, atau tertimpa tanpa backup.',
      },
      {
        title: 'Kesalahan Manusia Tinggi',
        description:
          'Input manual rentan salah, terlambat, atau tidak sinkron antar staf.',
      },
      {
        title: 'Bisnis Tidak Bisa Dipantau Jarak Jauh',
        description:
          'Pemilik harus hadir langsung untuk tahu apa yang terjadi.',
      },
      {
        title: 'Tidak Tahu Progress dan Performa',
        description:
          'Tidak ada laporan otomatis atau dashboard untuk melihat performa.',
      },
      {
        title: 'Sulit Menjaga Kepercayaan Klien',
        description:
          'Klien tidak mendapatkan update jelas tentang proses atau layanan.',
      },
      {
        title: 'Stres dan Kelelahan Tim Operasional',
        description:
          'Karena semua dikerjakan manual dan multitasking.',
      },
      {
        title: 'Sulit Mengembangkan Tim',
        description:
          'Tanpa sistem, tim baru akan lama beradaptasi dan butuh banyak pelatihan.',
      },
      {
        title: 'Tidak Bisa Bersaing di Era Sekarang',
        description:
          'Kompetitor yang pakai sistem bisa bergerak lebih cepat dan efisien.',
      },
      {
        title: 'Potensi Kehilangan Peluang Besar',
        description:
          'Banyak klien lebih memilih layanan yang digital, cepat, dan transparan.',
      },
    ],
  },
  // Bagian 3: Alasan Teknis & Efisiensi
  {
    bigTitle: 'Alasan Teknis & Efisiensi',
    items: [
      {
        title: 'Otomatisasi Proses Manual',
        description:
          'Mengurangi pekerjaan berulang seperti input data, laporan, atau transaksi. Lebih efisien, hemat waktu, dan minim kesalahan.',
      },
      {
        title: 'Akses Data Real-Time',
        description:
          'Data bisa diakses kapan saja dan di mana saja, tanpa perlu menunggu laporan manual.',
      },
      {
        title: 'Centralisasi Informasi',
        description:
          'Semua data dan aktivitas bisnis tersimpan dalam satu tempat yang mudah diakses dan dikelola.',
      },
      {
        title: 'Integrasi dengan Sistem Lain',
        description:
          'Dapat terhubung dengan tools lain seperti pembayaran, WhatsApp, email, API pihak ketiga, dsb.',
      },
      {
        title: 'User Management',
        description:
          'Manajemen pengguna dengan hak akses berbeda untuk admin, staf, dan klien.',
      },
      {
        title: 'Monitoring Lebih Mudah',
        description:
          'Pantau performa bisnis secara langsung melalui dashboard dan grafik interaktif.',
      },
      {
        title: 'Keamanan Data Lebih Terjamin',
        description:
          'Dibandingkan spreadsheet/manual, aplikasi web memiliki sistem keamanan seperti autentikasi, enkripsi, backup otomatis.',
      },
      {
        title: 'Multi-Platform',
        description:
          'Dapat digunakan lintas perangkat (laptop, tablet, HP) tanpa perlu install.',
      },
      {
        title: 'Update Mudah',
        description:
          'Tidak perlu menyebarkan ulang file. Update langsung di server dan otomatis berlaku ke semua pengguna.',
      },
      {
        title: 'Pengurangan Biaya Jangka Panjang',
        description:
          'Mengurangi kebutuhan tenaga kerja tambahan dan menurunkan biaya operasional berulang.',
      },
    ],
  },
];

export default function SectionWhyWebApp() {
  // Flatten items and include index for numbering
  const flatItems = reasonsToBuildWebApp.flatMap((section) =>
    section.items
  );

  return (
    <section className="w-full px-12 py-16 bg-white dark:bg-black text-black dark:text-white mb-28">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-20">
          Mengapa Harus Membuat Web Aplikasi?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {flatItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-zinc-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}