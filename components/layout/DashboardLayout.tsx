'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import LoadingRing from '@/components/general/LoadingRing';
import { NAV_CONFIG } from '@/lib/nav-dashboard';
import { useTheme } from 'next-themes';
import { Moon, Sun, Bell, Globe, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for pathname changes
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    setIsNavigating(true);
    timeout = setTimeout(() => {
      setIsNavigating(false);
    }, 300); // arbitrary delay to hide loader once path changes

    return () => clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname?.startsWith('/auth');
    const isRootPage = pathname === '/';

    if (!user && !isAuthPage) {
      router.push('/auth/login');
    } else if (user && isRootPage) {
      router.push(`/dashboard/${user.activeRole.toLowerCase()}`);
    } else {
      setIsReady(true);
    }
  }, [loading, user, pathname, router]);


  if (loading || !isReady || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const matchedRole = Object.values(RoleEnum).find(role =>
    pathname?.startsWith(`/dashboard/${role.toLowerCase()}`)
  );
  const currentRole = matchedRole ?? user.activeRole;
  const navLinks = (NAV_CONFIG[currentRole] ?? []).map(link => ({
    label: link.label,
    href: link.getHref(user.activeRole),
  }));

  return (
    <div className="min-h-screen flex">
      {isNavigating && <LoadingRing />}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white text-black p-4 z-20 border border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Mokami</h2>
        <nav>
          <ul className="space-y-2">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block p-2 rounded hover:bg-gray-100 ${
                    pathname === link.href ? 'bg-gray-100 font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen w-full bg-gray-100 text-black">
        {/* Fixed Header */}
        <header className="fixed top-0 left-64 right-0 z-10 flex justify-between items-center px-6 py-4 border-b border-gray-300 bg-white dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-300">As {user.activeRole}</p>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Translate dropdown */}
            <div className="relative group">
              <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                <Globe className="w-5 h-5" />
              </button>
              <ul className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md hidden group-hover:block">
                <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">EN</button></li>
                <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">ID</button></li>
              </ul>
            </div>

            {/* Notification icon */}
            <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </button>

            {/* User profile dropdown */}
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <User className="w-5 h-5" />
              </button>
              <ul className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md hidden group-hover:block">
                <li className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{user.fullName}</li>
                <li>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Main page content below header */}
        <div className="pt-[90px] pb-6 px-6 min-h-screen bg-white">
          {children}
        </div>
      </main>
    </div>
  );
}
