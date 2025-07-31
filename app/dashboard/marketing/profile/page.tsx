'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { getTokenFromCookies } from '@/lib/auth-client';
import { fetchMyProfile } from '@/services/profileService';

interface Profile {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  activeRole: string;
}

export default function MarketingProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
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
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Marketing Profile</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="space-y-2">
        <p><strong>Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Roles:</strong> {profile.roles.join(', ')}</p>
        <p><strong>Active Role:</strong> {profile.activeRole}</p>
        <p className="text-gray-600">Manage your campaigns and promotions here.</p>
      </div>
    </div>
  );
}