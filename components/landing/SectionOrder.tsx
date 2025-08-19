'use client'

import { useState } from 'react'

export default function SectionOrder() {
  const [form, setForm] = useState({ name: '', contact: '', paket: 'Basic' })
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/user/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSuccess(true)
  }

  return (
    <section className="px-6 md:px-12 py-16 bg-[#262626]" id="order">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Order Form</h2>

      <div className="max-w-2xl mx-auto mb-8 text-center text-[#ccc]">
        <p className="mb-3">
          Kami menyarankan Anda berdiskusi terlebih dahulu dengan tim MokamiApp sebelum melakukan pemesanan,
          agar kami benar-benar memahami kebutuhan dan solusi yang akan dibangun.
        </p>
        <p className="text-sm text-[#999]">
          Diskusi ini akan membantu menentukan fitur, integrasi, serta paket terbaik sesuai kondisi bisnis Anda.
        </p>
      </div>

      {success ? (
        <p className="text-center text-green-400">Terima kasih! Kami akan menghubungi Anda.</p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
          <input
            className="w-full p-3 bg-[#121212] text-white border border-[#444]"
            placeholder="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full p-3 bg-[#121212] text-white border border-[#444]"
            placeholder="No. WhatsApp / Email"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            required
          />
          <select
            className="w-full p-3 bg-[#121212] text-white border border-[#444]"
            value={form.paket}
            onChange={(e) => setForm({ ...form, paket: e.target.value })}
          >
            <option>Basic</option>
            <option>Pro</option>
            <option>Ultimate</option>
          </select>
          <button type="submit" className="w-full bg-white text-black py-3 rounded hover:opacity-90">
            Kirim Order
          </button>
        </form>
      )}
    </section>
  )
}
