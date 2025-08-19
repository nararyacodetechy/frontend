'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

type Props = {
  onClose?: () => void;
};

const TOP_LINKS = [
  { label: 'Dashboard', path: '/my-page/user' },
  { 
    label: 'Account', 
    path: '/my-page/user/account/profile',
    sublinks: [
      { label: 'Overview', path: '/my-page/user/account/profile' },
      { label: 'Security', path: '/my-page/user/account/security' },
    ]
  },
  { label: 'Orders', path: '/my-page/user/order' },
  { label: 'Projects', path: '/my-page/user/projects' },
  { label: 'Settings', path: '/my-page/user/settings' },
];

export default function UserSidebar({ onClose }: Props) {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);

  // open dropdown otomatis saat berada di account
  useEffect(() => {
    if (pathname?.startsWith('/my-page/user/account')) {
      setAccountOpen(true);
    } else {
      setAccountOpen(false);
    }
  }, [pathname]);

  return (
    <div className="p-4 md:px-12 md:py-8 h-full flex flex-col min-h-screen">
      {/* Header */}
      <Link href="/my-page/user" className="block mb-6" onClick={onClose}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center font-semibold">
            U
          </div>
          <div>
            <div className="text-sm font-semibold">Your workspace</div>
            <div className="text-xs text-gray-500">Personal</div>
          </div>
        </div>
      </Link>

      {/* Top-level links */}
      <nav className="flex flex-col gap-1">
        {TOP_LINKS.map((link) => {
          const hasSublinks = !!link.sublinks;
          // top-level active: if account group -> check startsWith account base path
          const isTopActive = hasSublinks
            ? pathname?.startsWith('/my-page/user/account')
            : pathname === link.path;

          if (hasSublinks) {
            // render button that toggles dropdown
            return (
              <div key={link.path}>
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-sm font-medium transition ${
                    isTopActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`ml-2 transform transition-transform duration-150 ${accountOpen ? 'rotate-90' : ''}`}
                    aria-hidden
                  >
                    &gt;
                  </span>
                </button>

                {/* Sublinks dropdown */}
                {accountOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {link.sublinks!.map((s) => {
                      const active = pathname === s.path;
                      return (
                        <Link
                          key={s.path}
                          href={s.path}
                          onClick={onClose}
                          className={`block rounded-md px-3 py-2 text-sm transition ${
                            active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {s.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // no sublinks -> render Link (navigable)
          return (
            <Link
              key={link.path}
              href={link.path}
              onClick={onClose}
              className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-sm font-medium transition ${
                isTopActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
