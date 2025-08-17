'use client';

import { Users } from '@/types/user';
import { RoleEnum } from '@/types/role';

export default function AccountForm({ profile }: { profile: Users }) {
  const userProfile = profile.profile;

  return (
    <form className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={userProfile?.fullName ?? ''}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Username</label>
        <input
          type="text"
          value={userProfile?.username ?? ''}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Phone</label>
        <input
          type="text"
          value={userProfile?.phone ?? ''}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Address</label>
        <textarea
          value={userProfile?.address ?? ''}
          disabled
          rows={2}
          className="w-full border-b border-gray-200 py-2 text-gray-700 resize-none"
        />
      </div>

      {/* Company */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Company</label>
        <input
          type="text"
          value={userProfile?.company ?? ''}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      {/* NIK */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">NIK</label>
        <input
          type="text"
          value={userProfile?.nik ?? ''}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      {/* Roles */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Roles</label>
        <input
          type="text"
          value={profile.roles.join(', ')}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700"
        />
      </div>

      {/* Active Role */}
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

      {/* Tombol Edit (disabled dulu) */}
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
