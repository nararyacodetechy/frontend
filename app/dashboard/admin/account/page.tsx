'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { Profile } from '@/types/user';
import { fetchMyProfile } from '@/services/accountService';
import Link from 'next/link';
import LoadingRing from '@/components/general/LoadingRing';

export default function AdminAccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user || user.activeRole !== RoleEnum.ADMIN) {
      router.push('/auth/login');
      return;
    }

    const getProfile = async () => {
      try {
        const data = await fetchMyProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    getProfile();
  }, [user, loading, router]);

  if (loading || !profile) {
    return <LoadingRing />;
  }

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Settings</h1>
      <nav className="flex gap-4 border-b border-gray-300 mb-6 text-sm">
        {[
          { label: 'My Profile', href: '/dashboard/admin/account' },
          { label: 'Change Password', href: '/dashboard/admin/account/password' },
          { label: 'Preferences', href: '/dashboard/admin/account/preferences' },
          { label: 'Security', href: '/dashboard/admin/account/security' },
          { label: 'Activity', href: '/dashboard/admin/account/activity' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`pb-2 border-b-2 ${
              pathname === item.href
                ? 'border-red-600 text-red-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-red-600'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Dummy content: this would change based on route */}
      <section className="space-y-4">
        <div className="bg-white text-sm">
          <h2 className="font-semibold mb-2">Welcome back, {profile.fullName}</h2>
          <p>This is your account overview. You can navigate using the tabs above.</p>
        </div>
        <div className="bg-white text-sm">
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                disabled
                className="w-full border-b border-gray-200 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border-b border-gray-200 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Roles</label>
              <input
                type="text"
                value={profile.roles.join(', ')}
                disabled
                className="w-full border-b border-gray-200 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Active Role</label>
              <input
                type="text"
                value={profile.activeRole}
                disabled
                className="w-full border-b border-gray-200 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Admin Privileges</label>
              <textarea
                value={profile.adminPrivileges?.join(', ') || 'No privileges assigned.'}
                disabled
                rows={3}
                className="w-full border-b border-gray-200 py-2 text-gray-700 resize-none"
              />
            </div>

            {/* Tempat untuk icon edit nanti */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled
                className="text-sm text-red-600 border border-red-600 px-4 py-1 rounded hover:bg-red-50 cursor-not-allowed"
              >
                <span className="opacity-50">✏️ Edit Profile</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
