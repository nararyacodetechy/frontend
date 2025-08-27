// components/landing/Header.tsx
import Link from 'next/link';
import { headers } from 'next/headers';
import { fetchMyProfile } from '@/services/accountService';
import { RoleEnum } from '@/types/role';
import { getTokenFromCookies, decodeToken } from '@/lib/auth-server';

export default async function Header() {
  let role: RoleEnum | null = null;
  let profile: any = null;

  const cookie = (await headers()).get('cookie') || '';
  const token = await getTokenFromCookies();
  const decoded = token ? decodeToken(token) : null;
  const userId = decoded?.sub || '';

  // Only fetch profile if token and userId are present
  if (token && userId) {
    try {
      profile = await fetchMyProfile({ cookie, userId });
      role = profile?.activeRole || null;
      console.log('Header: Fetched profile', profile);
    } catch (err) {
      console.warn('Header: Failed to fetch profile', err);
      role = null;
    }
  } else {
    console.log('Header: No valid token or userId, skipping profile fetch');
  }

  // Determine the link based on the role
  let navLink: { href: string; label: string } = { href: '/auth/login', label: 'Sign In' };
  if (role) {
    console.log('Header: Role', role);
    if ([RoleEnum.USER, RoleEnum.CUSTOMER].includes(role)) {
      navLink = { href: '/my-page/user', label: 'My Page' };
    } else {
      navLink = { href: `/dashboard/${role}`, label: 'Dashboard' };
    }
  }

  return (
    <header className="fixed top-0 z-40 bg-white dark:bg-[#121212] text-black dark:text-white border-b border-gray-200 py-4 px-6 md:px-12 w-full">
      <div className="flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Mokami</Link>
        <nav className="flex gap-8">
          <Link href="/">Home</Link>
          <Link href={navLink.href}>{navLink.label}</Link>
        </nav>
      </div>
    </header>
  );
}