// app/my-page/user/layout.tsx
'use client';

import MobileMenuBar from '@/components/my-page/general/MobileMenuBar';
import UserSidebar from '@/components/my-page/general/UserSidebar';
import { ReactNode, useEffect, useState } from 'react';

export default function MyPageUserLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top menubar (only visible on small screens) */}
      <MobileMenuBar onOpen={() => setDrawerOpen(true)} />

      <div className="flex">
        {/* Sidebar - offcanvas mobile, persistent desktop */}
        <aside
          className={`fixed inset-y-0 left-0 z-35 bg-white border-r border-gray-200 transform transition-transform duration-200
            md:static md:translate-x-0 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} md:w-80`}
          aria-hidden={!drawerOpen && isClient && typeof window !== 'undefined' && window.innerWidth < 768}
        >
          <div className="h-full overflow-y-auto">
            <UserSidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </aside>

        {/* Mobile overlay */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
        )}

        {/* Main content (with left padding on md to avoid overlap) */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
