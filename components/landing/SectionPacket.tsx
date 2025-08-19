export default function SectionPacket() {
  return (
    <section id="paket" className="px-6 md:px-12 py-20 bg-white dark:bg-[#262626] text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-2 text-center">Perbandingan Paket</h2>
      <p className="text-center text-gray-700 dark:text-gray-200 mb-10">Pilih paket sesuai kebutuhan bisnis Anda</p>

      {/* === Informasi Paket (Card style) === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {/* Standalone Lite */}
        <div className="h-fit mt-8 bg-[#F9FAFB] dark:bg-[#121212] p-6 rounded shadow-sm shadow-gray-500 text-black dark:text-white">
          <h3 className="text-lg font-semibold mb-1">🟢 Standalone Lite</h3>
          <p className="text-sm mb-4">Cocok untuk warung, usaha rumahan yang ingin mencatat transaksi tanpa repot install atau daftar akun.</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>Tanpa database</li>
            <li>Langsung pakai</li>
            <li>Tidak perlu internet</li>
            <li>Tanpa biaya bulanan</li>
          </ul>
        </div>

        {/* Cloud Service */}
        <div className="h-fit bg-[#E5E7EB] dark:bg-[#121212] p-6 rounded shadow-sm shadow-gray-500 text-black dark:text-white">
          <div className="absolute top-3 right-3 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
            🔥 Populer
          </div>
          <h3 className="text-lg font-semibold mb-1">🔵 Cloud Service</h3>
          <p className="text-sm mb-4">Cocok untuk toko kecil yang ingin keamanan data & fleksibilitas penggunaan di banyak perangkat.</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>Aman dengan cloud backup</li>
            <li>Bisa dipakai offline & online</li>
            <li>Terintegrasi WA, Email, Instagram</li>
            <li>Bisa dicicil atau langganan</li>
          </ul>
        </div>

        {/* Retail Pro */}
        <div className="h-fit mt-8 bg-[#F9FAFB] dark:bg-[#121212] p-6 rounded shadow-sm shadow-gray-500 text-black dark:text-white">
          <h3 className="text-lg font-semibold mb-1">🟡 Retail Pro</h3>
          <p className="text-sm mb-4">Cocok untuk toko berkembang yang punya tim, perlu kontrol stok, laporan, reminder otomatis, dan pengingat WA.</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>Multi-user (admin, kasir)</li>
            <li>Notifikasi stok & reminder</li>
            <li>Real-time opsional</li>
            <li>Support penuh + backup otomatis</li>
          </ul>
        </div>
      </div>

      {/* === Tabel Perbandingan Fitur === */}
      <div className="overflow-x-auto">
        <table className="w-full border border-[#444] text-sm md:text-base text-left">
          <thead className="bg-[#F0F0F0] dark:bg-[#121212] text-black dark:text-white">
            <tr>
              <th className="p-4 border border-[#444]">Fitur / Paket</th>
              <th className="p-4 border border-[#444] text-center">🟢 Standalone Lite</th>
              <th className="p-4 border border-[#371818] text-center">🔵 Cloud Service</th>
              <th className="p-4 border border-[#444] text-center">🟡 Retail Pro</th>
            </tr>
          </thead>

          <tbody className="text-black dark:text-[#ddd]">
            {[
              ['Login/Register User', '❌Tidak ada (Langsung Pakai)', '❌ Tidak ada (Langsung Pakai)', '✅ Multi-user (admin, kasir, owner)'],
              ['Database', '❌ Tanpa database (lokal di HP)', '✅ Cloud database', '✅ Cloud database'],
              ['Koneksi Internet', '❌ Tidak diperlukan', '✅ Bisa offline/online', '✅ Bisa offline/online'],
              ['Hosting', '❌ Tidak perlu', '✅ Gratis hosting', '✅ Gratis hosting'],
              ['Maintenance & Support', '❌ Tidak disediakan', '✅ Dasar (perbaikan ringan)', '✅ Penuh (bugfix, update fitur, backup)'],
              ['Backup Otomatis', '❌ Tidak tersedia', '❌ Manual (opsional)', '✅ Otomatis + Reminder WA'],
              ['Integrasi WA', '❌ Tidak ada', '✅ Kirim struk', '✅ Kirim struk, reminder, pesan otomatis'],
              ['Integrasi Sistem Eksternal', '❌ Tidak ada', '✅ WhatsApp, Instagram, Email, dll', '✅ WhatsApp, Instagram, Email, dll.'],
              ['Notifikasi', '❌ Tidak tersedia', '❌ Tidak tersedia', '✅ Notifikasi stok habis, pengingat, dsb.'],
              ['Real-time', '❌ Tidak', '❌ Tidak real-time', '✅ Opsional real-time (jika diperlukan)'],
              ['Model Pembayaran', 'Sekali bayar', 'Sekali bayar / Cicilan / Bulanan', 'Cicilan / Bulanan / Tahunan'],
            ].map(([fitur, lite, cloud, pro], index) => (
              <tr key={index} className="border-t border-[#444]">
                <td className="p-4 border border-[#444] font-mediumbg-[#E5E5E5]">{fitur}</td>
                <td className="p-4 border border-[#444] text-center">{lite}</td>
                <td className="p-4 border border-[#444] text-center">{cloud}</td>
                <td className="p-4 border border-[#444] text-center">{pro}</td>
              </tr>
            ))}

            {/* === Harga === */}
            <tr className="bg-[#121212] font-bold text-white text-center">
              <td className="p-6 border border-[#444]">Harga (Estimasi)</td>
              <td className="p-6 border border-[#444]">
                <div className="text-lg">Rp200.000</div>
                <div className="text-sm text-[#aaa]">Sekali Bayar</div>
              </td>
              <td className="p-6 border border-[#444] bg-[#1e1e1e]">
                <div className="text-lg text-yellow-400">Rp500.000</div>
                <div className="text-sm text-[#aaa]">atau Rp50rb/bulan</div>
              </td>
              <td className="p-6 border border-[#444]">
                <div className="text-lg">Rp1.000.000</div>
                <div className="text-sm text-[#aaa]">atau Rp200rb/bulan</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
