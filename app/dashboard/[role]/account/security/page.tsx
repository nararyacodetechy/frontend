import { headers } from 'next/headers';
import { fetchMyProfile } from '@/services/accountService';
import AccountSecurity from '@/components/account/AccountSecurity';
import { Users } from '@/types/user';

export default async function SecurityPage() {
  const cookie = (await headers()).get('cookie') || '';
  const profile = await fetchMyProfile({ cookie });

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Failed to load profile.</p>
      </div>
    );
  }

  const adaptedProfile: Users = {
    ...profile,
    profile: {
      ...profile.profile,
      passwordSet: true,
    },
  };

  return (
    <div className="bg-white">
      <AccountSecurity profile={adaptedProfile} />
    </div>
  );
}