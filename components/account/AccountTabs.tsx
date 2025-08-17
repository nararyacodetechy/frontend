'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'My Profile', path: 'account' },
  { label: 'Change Password', path: 'account/password' },
  { label: 'Preferences', path: 'account/preferences' },
  { label: 'Security', path: 'account/security' },
  { label: 'Activity', path: 'account/activity' },
];

export default function AccountTabs({ role }: { role: string }) {
  const pathname = usePathname();
  const base = `/dashboard/${role}`;

  return (
    <nav className="flex gap-4 border-b border-gray-300 mb-6 text-sm">
      {tabs.map((t) => {
        const href = `${base}/${t.path}`;
        return (
          <Link
            key={href}
            href={href}
            className={`pb-2 border-b-2 ${
              pathname === href
                ? 'border-red-600 text-red-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-red-600'
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
