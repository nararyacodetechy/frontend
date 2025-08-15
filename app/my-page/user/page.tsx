import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'

export default function UserMyPage() {
  return (
    <>
      <div className="px-6 w-full min-h-screen text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, User!</h1>
        <p>This is your personalized landing page.</p>
        {/* Tambahkan konten lain sesuai kebutuhan */}
      </div>
    </>
  )
}
