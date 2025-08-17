'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'My Profile', path: 'profile' },
  { label: 'Security', path: 'security' },
  { label: 'Preferences', path: 'preferences' },
  { label: 'Activity', path: 'activity' },
];

export default function AccountTabs({ role }: { role: string }) {
  const pathname = usePathname();
  const base = `/dashboard/${role}/account`;

  return (
    <nav className="flex gap-4 border-b border-gray-300 mb-6 text-sm overflow-x-auto">
      {tabs.map((t) => {
        const href = t.path ? `${base}/${t.path}` : base;
        const isActive = pathname === href || pathname === href + '/';
        return (
          <Link
            key={href}
            href={href}
            className={`pb-2 border-b-2 whitespace-nowrap ${
              isActive
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