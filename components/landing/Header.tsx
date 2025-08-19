// components/landing/Header.tsx
import Link from 'next/link';
import { headers } from 'next/headers';
import { fetchMyProfile } from '@/services/accountService';
import { RoleEnum } from '@/types/role';

export default async function Header() {
  let role: RoleEnum | null = null;

  try {
    const cookie = (await headers()).get('cookie') || ''; // ambil cookie dari request masuk
    const profile = await fetchMyProfile({ cookie });
    role = profile?.activeRole || null;
  } catch (err) {
    console.warn('Failed to fetch profile for header:', err);
    role = null;
  }

  const showMyPage = role === RoleEnum.USER;
  const myPagePath = '/my-page/user';

  return (
    <header className="fixed top-0 z-40 bg-white dark:bg-[#121212] text-black dark:text-white border-b border-gray-200 py-4 px-6 md:px-12 w-full">
      <div className="flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Mokami</Link>
        <nav className="flex gap-8">
          <Link href="/">Home</Link>
          {showMyPage ? (
            <Link href={myPagePath}>My Page</Link>
          ) : (
            <Link href="/auth/login">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
