// app/layout.tsx
import './globals.css'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'Mokami',
  description: 'Solusi Web App untuk UMKM & Retail',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#121212] text-white font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
