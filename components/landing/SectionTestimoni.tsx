export default function SectionTestimoni() {
    return (
      <section className="px-6 md:px-12 py-16 bg-[#121212]">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Testimoni & Studi Kasus</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 border border-[#444] rounded">
            <p className="text-[#ccc]">"Setelah pakai MokamiApp, orderan naik 3x lipat! Landing page-nya simpel dan keren."</p>
            <span className="text-sm text-[#888] mt-2 block">– Toko Herbal Makmur</span>
          </div>
          <div className="p-4 border border-[#444] rounded">
            <p className="text-[#ccc]">"Fitur admin dashboard sangat membantu saya pantau progres produksi."</p>
            <span className="text-sm text-[#888] mt-2 block">– UMKM Fashion Lokal</span>
          </div>
        </div>
      </section>
    )
  }
  