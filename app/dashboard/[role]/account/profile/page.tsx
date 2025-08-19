// app/dashboard/[role]/account/profile/page.tsx
import { headers } from 'next/headers';
import { fetchMyProfile } from '@/services/accountService';
import AccountOverview from '@/components/dashboard/account/AccountOverview';
import AccountForm from '@/components/dashboard/account/AccountForm';

export default async function ProfilePage() {
  const cookie = (await headers()).get('cookie') || '';
  const profile = await fetchMyProfile({ cookie });

  console.log('profile:', profile);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Failed to load profile.</p>
      </div>
    );
  }

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
