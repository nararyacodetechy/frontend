'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { getTokenFromCookies } from '@/lib/auth-client';

interface Profile {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  activeRole: string;
}

export default function ProductManagerProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user || ![RoleEnum.PRODUCT_MANAGER, RoleEnum.ADMIN].includes(user.activeRole)) {
      router.push('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = await getTokenFromCookies();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, [user, loading, router]);

  if (loading || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-teal-600 mb-4">Product Manager Profile</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="space-y-2">
        <p><strong>Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Roles:</strong> {profile.roles.join(', ')}</p>
        <p><strong>Active Role:</strong> {profile.activeRole}</p>
        <p className="text-gray-600">Oversee product development and strategy here.</p>
      </div>
    </div>
  );
}