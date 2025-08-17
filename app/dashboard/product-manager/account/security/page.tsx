import AccountSecurity from '@/components/account/AccountSecurity';
import { fetchMyProfile } from '@/services/accountService';
import { headers } from 'next/headers';

export default async function SecurityPage() {
  const cookie = (await headers()).get('cookie') || '';
  const profile = await fetchMyProfile({ cookie });

  // sementara, anggap semua punya password
  const adaptedProfile = {
    ...profile,
    profile: {
      ...profile?.profile,
      passwordSet: true,
    },
  };

  return (
    <div className="bg-white">
      <AccountSecurity profile={adaptedProfile} />
    </div>
  );
}
