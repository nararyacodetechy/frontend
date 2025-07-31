import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen w-full">{children}</main>
      <Footer />
    </>
  )
}
