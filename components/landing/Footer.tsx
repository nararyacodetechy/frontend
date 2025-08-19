import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 justify-between">
        
        {/* Brand (kiri) */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-black">Mokami</h2>
          <p className="mt-2 text-sm text-black max-w-xs">
            Solusi pembuatan web app profesional untuk UMKM yang ingin go digital dan otomatisasi bisnis.
          </p>
        </div>

        {/* Links (kanan) */}
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Quick Links 1 */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-black transition">Beranda</Link></li>
              <li><Link href="/services" className="hover:text-black transition">Layanan</Link></li>
              <li><Link href="/portfolio" className="hover:text-black transition">Flow</Link></li>
              <li><Link href="/contact" className="hover:text-black transition">Consulting</Link></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Lainnya</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/order" className="hover:text-black transition">Order</Link></li>
              <li><Link href="/services" className="hover:text-black transition">Layanan</Link></li>
              <li><Link href="/portfolio" className="hover:text-black transition">Portfolio</Link></li>
              <li><Link href="/contact" className="hover:text-black transition">Kontak</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: <a href="mailto:info@mokami.com" className="hover:text-black transition">info@mokami.com</a></li>
              <li>WhatsApp: <a href="https://wa.me/6281234567890" target="_blank" className="hover:text-black transition">+62 812-3456-7890</a></li>
              <li>Alamat: Jakarta, Indonesia</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-black transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-black transition"><Linkedin size={20} /></a>
              <a href="mailto:info@mokami.com" className="hover:text-black transition"><Mail size={20} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 text-center text-xs text-gray-500 py-4">
        &copy; {new Date().getFullYear()} Mokami. All rights reserved.
      </div>
    </footer>
  )
}
