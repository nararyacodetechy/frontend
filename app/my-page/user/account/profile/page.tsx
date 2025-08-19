// app/my-page/user/account/profile/page.tsx
import { headers } from 'next/headers';
import { fetchMyProfile } from '@/services/accountService';
import { ProfileCard } from '@/components/my-page/account/ProfileCard';

export default async function ProfilePage() {
  const cookie = (await headers()).get('cookie') || '';
  const user = await fetchMyProfile({ cookie });

  return (
    <div className="space-y-4">
      <ProfileCard user={user} />
    </div>
  );
}
