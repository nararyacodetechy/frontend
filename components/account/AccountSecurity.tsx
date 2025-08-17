'use client';

import { useState } from 'react';
import { Users } from '@/types/user';

interface Props {
  profile: Users;
}

export default function AccountSecurity({ profile }: Props) {
  const [hasPassword, setHasPassword] = useState(
    !!profile?.profile?.passwordSet
  );

  if (!profile || !profile.profile) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Profile data is unavailable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email (tidak bisa diubah) */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          value={profile.email || ''}
          disabled
          className="w-full border-b border-gray-200 py-2 text-gray-700 bg-gray-50 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          Email tidak dapat diubah untuk alasan keamanan.
        </p>
      </div>

      {/* Password Section */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Password</label>
        {!hasPassword ? (
          <button className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
            Set Password
          </button>
        ) : (
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            Change Password
          </button>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {hasPassword
            ? 'Gunakan tombol di atas untuk mengganti password Anda.'
            : 'Anda login menggunakan Google, silakan atur password agar bisa login dengan email & password juga.'}
        </p>
      </div>

      {/* Two Factor Authentication */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Two-Factor Authentication (2FA)
        </label>
        <button className="px-4 py-2 bg-gray-100 border text-sm rounded hover:bg-gray-200">
          Enable 2FA
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Tambahkan lapisan keamanan ekstra dengan autentikasi dua faktor.
        </p>
      </div>

      {/* Sessions / Devices */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Active Sessions</label>
        <ul className="text-sm text-gray-600 list-disc pl-6">
          <li>Chrome - Windows 10 (aktif sekarang)</li>
          <li>Safari - iPhone 13 (2 hari lalu)</li>
        </ul>
        <button className="mt-2 text-sm text-red-600 hover:underline">
          Logout dari semua perangkat
        </button>
      </div>

      {/* Account deletion */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Account</label>
        <button className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50">
          Deactivate / Delete Account
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Menonaktifkan akun akan menghentikan akses, Anda bisa mengaktifkannya kembali dengan login.
        </p>
      </div>
    </div>
  );
}