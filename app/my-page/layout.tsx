// app/my-page/layout.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export default function MyPageLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Define navigation links for my-page section
  const navLinks = [
    { href: '/my-page', label: 'My Page Overview', roles: [RoleEnum.USER, RoleEnum.CUSTOMER, RoleEnum.ADMIN] },
    { href: '/my-page/customer/profile', label: 'My Profile', roles: [RoleEnum.CUSTOMER, RoleEnum.ADMIN] },
    // Add more links as needed, e.g., for account settings or other customer features
  ];

  const allowedLinks = navLinks.filter((link) => link.roles.includes(user.activeRole));

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">My Page</h2>
        <nav>
          <ul className="space-y-2">
            {allowedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block p-2 hover:bg-gray-700 rounded">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={logout}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user.fullName}</h1>
          <p className="text-gray-600">Role: {user.activeRole}</p>
        </header>
        {children}
      </main>
    </div>
  );
}