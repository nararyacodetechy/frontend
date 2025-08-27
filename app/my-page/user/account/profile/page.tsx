// app/my-page/user/account/profile/page.tsx
import { headers } from 'next/headers';
import { fetchMyProfile } from '@/services/accountService';
import { ProfileCard } from '@/components/my-page/account/ProfileCard';
import { getTokenFromCookies, decodeToken } from '@/lib/auth-server';

export default async function ProfilePage() {
  const cookie = (await headers()).get('cookie') || '';
  const token = await getTokenFromCookies();
  const decoded = token ? decodeToken(token) : null;
  const userId = decoded?.sub || '';
  const user = await fetchMyProfile({ cookie, userId });

  console.log('user profile:', user);

  return (
    <div className="space-y-4">
      <ProfileCard user={user} />
    </div>
  );
}