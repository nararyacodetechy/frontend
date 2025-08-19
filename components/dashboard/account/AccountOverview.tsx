// components/account/AccountOverview.tsx
'use client';

import { Users } from '@/types/user';

export default function AccountOverview({ profile }: { profile: Users }) {
  return (
    <div className="bg-white text-sm">
      <h2 className="font-semibold mb-2">
        Welcome back, {profile.profile?.fullName ?? profile.email}
      </h2>
      <p>This is your account overview. You can navigate using the tabs above.</p>
    </div>
  );
}
