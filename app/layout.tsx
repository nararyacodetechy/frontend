// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'Mokami',
  description: 'Solusi Web App untuk UMKM & Retail',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#121212] text-white font-sans">
        <main>{children}</main>
      </body>
    </html>
  )
}
