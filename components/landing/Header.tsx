// components/Header.tsx
import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 z-50 bg-white dark:bg-[#121212] text-black dark:text-white shadow-md py-4 px-12 w-full">
      <div className="flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Mokami</Link>
        <nav>
          <a href="auth/login" className="hover:underline">Sign In</a>
        </nav>
      </div>
    </header>
  )
}
