'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Define nav link type with dynamic href
type NavLink = {
  label: string;
  getHref: (role: RoleEnum) => string;
};

// Config per role
const NAV_CONFIG: Partial<Record<RoleEnum, NavLink[]>> = {
  [RoleEnum.ADMIN]: [
    { label: 'Dashboard', getHref: () => '/dashboard/admin' },
  ],
  [RoleEnum.SALES]: [
    { label: 'Dashboard', getHref: () => '/dashboard/sales' },
    { label: 'Projects', getHref: () => '/dashboard/sales/Projects' },
    { label: 'Task Management', getHref: () => '/dashboard/sales/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/sales/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/sales/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/sales/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/sales/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/sales/notification' },
    { label: 'Profile', getHref: () => '/dashboard/sales/profile' },
  ],
  [RoleEnum.MARKETING]: [
    { label: 'Dashboard', getHref: () => '/dashboard/marketing' },
    { label: 'Dashboard', getHref: () => '/dashboard/marketing/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/marketing/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/marketing/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/marketing/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/marketing/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/marketing/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/marketing/notification' },
    { label: 'Profile', getHref: () => '/dashboard/marketing/profile' },
  ],
  [RoleEnum.PRODUCT_MANAGER]: [
    { label: 'Dashboard', getHref: () => '/dashboard/product-manager' },
    { label: 'Projects', getHref: () => '/dashboard/product-manager/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/product-manager/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/product-manager/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/product-manager/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/product-manager/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/product-manager/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/product-manager/notification' },
    { label: 'Profile', getHref: () => '/dashboard/product-manager/profile' },
  ],
  [RoleEnum.DEVELOPER]: [
    { label: 'Dashboard', getHref: () => '/dashboard/developer' },
    { label: 'Projects', getHref: () => '/dashboard/developer/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/developer/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/developer/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/developer/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/developer/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/developer/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/developer/notification' },
    { label: 'Profile', getHref: () => '/dashboard/developer/profile' },
  ],
  [RoleEnum.DEVOPS]: [
    { label: 'Dashboard', getHref: () => '/dashboard/devops' },
    { label: 'Projects', getHref: () => '/dashboard/devops/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/devops/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/devops/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/devops/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/devops/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/devops/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/devops/notification' },
    { label: 'Profile', getHref: () => '/dashboard/devops/profile' },
  ],
  [RoleEnum.DESIGNER]: [
    { label: 'Dashboard', getHref: () => '/dashboard/designer' },
    { label: 'Projects', getHref: () => '/dashboard/designer/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/designer/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/designer/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/designer/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/designer/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/designer/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/designer/notification' },
    { label: 'Profile', getHref: () => '/dashboard/designer/profile' },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading, switchRole } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Pindahkan semua logic ke dalam useEffect, jangan return di luar hook
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

  const navLinks = (NAV_CONFIG[currentRole] ?? []).map((link) => ({
    label: link.label,
    href: link.getHref(user.activeRole),
  }));

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as RoleEnum;
    if (user.roles.includes(newRole)) {
      switchRole(newRole);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block p-2 rounded hover:bg-gray-700 ${
                    pathname === link.href ? 'bg-gray-700 font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4">
          <label htmlFor="role" className="block text-sm mb-1">Switch Role</label>
          <select
            id="role"
            value={user.activeRole}
            onChange={handleRoleChange}
            className="w-full text-black rounded p-2"
          >
            {user.roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

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
