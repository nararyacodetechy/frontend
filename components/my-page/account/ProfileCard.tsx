// components/account/my-page/ProfileCard.tsx
import type { Users } from '@/types/user';

export function ProfileCard({ user }: { user: Users | null }) {
  if (!user) {
    return (
      <div className="text-center text-gray-500 py-10">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          {user.profile?.fullName?.[0] ?? 'U'}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user.profile?.fullName ?? 'Unnamed User'}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-blue-600">{user.activeRole}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 block">Phone</span>
          <span>{user.profile?.phone ?? '-'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Address</span>
          <span>{user.profile?.address ?? '-'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Company</span>
          <span>{user.profile?.company ?? '-'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">NIK</span>
          <span>{user.profile?.nik ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}
