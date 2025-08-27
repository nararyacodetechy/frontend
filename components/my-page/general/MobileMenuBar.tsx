'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MobileMenuBar({ onOpen }: { onOpen: () => void }) {
  const pathname = usePathname(); // reactive & client-only

  const getPageLabel = () => {
    if (pathname === '/my-page/user') return 'Dashboard';
    if (pathname.startsWith('/my-page/user/account/profile')) return 'Account / Profile';
    if (pathname.startsWith('/my-page/user/account/security')) return 'Account / Security';
    if (pathname.startsWith('/my-page/user/order')) return 'Orders';
    if (pathname.startsWith('/my-page/user/projects')) return 'Projects';
    if (pathname.startsWith('/my-page/user/settings')) return 'Settings';
    return '';
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 md:hidden">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Hamburger */}
        <button
          onClick={onOpen}
          aria-label="Open menu"
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Current page label */}
        <div className="text-sm font-semibold">{getPageLabel()}</div>

        {/* User icon */}
        <div className="p-1 rounded-md hover:bg-gray-100">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zM6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
          </svg>
        </div>
      </div>
    </header>
  );
}
