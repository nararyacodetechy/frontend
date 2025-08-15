import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { AuthProvider } from '@/context/AuthContext'

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="pt-15 min-h-screen w-full">{children}</main>
      <Footer />
    </AuthProvider>
  )
}
