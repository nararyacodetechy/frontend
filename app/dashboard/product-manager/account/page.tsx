'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { Users } from '@/types/user';
import { fetchMyProfile } from '@/services/accountService';
import LoadingRing from '@/components/general/LoadingRing';
import AccountTabs from '@/components/account/AccountTabs';
import AccountOverview from '@/components/account/AccountOverview';
import AccountForm from '@/components/account/AccountForm';

export default function ProductManagerAccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Users | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.activeRole !== RoleEnum.PRODUCT_MANAGER) {
      router.push('/auth/login');
      return;
    }

    const getProfile = async () => {
      try {
        const data = await fetchMyProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile (product-manager page):', err);
      }
    };

    getProfile();
  }, [user, loading, router]);

  if (loading || !profile) return <LoadingRing />;

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Settings</h1>

      <section className="space-y-4">
        <AccountOverview profile={profile} />
        <div className="bg-white text-sm">
          <AccountForm profile={profile} />
        </div>
      </section>
    </div>
  );
}
