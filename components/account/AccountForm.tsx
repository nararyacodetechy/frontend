// components/account/AccountForm.tsx
'use client';

import { Users } from '@/types/user';
import { RoleEnum } from '@/types/role';

export default function AccountForm({ profile }: { profile: Users }) {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={profile.profile?.fullName ?? ''}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Roles</label>
        <input
          type="text"
          value={profile.roles.join(', ')}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Active Role</label>
        <input
          type="text"
          value={profile.activeRole}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      {profile.activeRole === RoleEnum.ADMIN && (
        <div>
            <label className="block text-gray-700 font-medium mb-1">Admin Privileges</label>
            <textarea
            value={(profile as any).adminPrivileges?.join(', ') || 'No privileges assigned.'}
            disabled
            rows={3}
            className="w-full border-b border-gray-200 py-2 text-gray-700 resize-none"
            />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          disabled
          className="text-sm text-red-600 border border-red-600 px-4 py-1 rounded hover:bg-red-50 cursor-not-allowed"
        >
          <span className="opacity-50">✏️ Edit Profile</span>
        </button>
      </div>
    </form>
  );
}
