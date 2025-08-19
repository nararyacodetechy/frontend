// components/account/my-page/SecuritySettings.tsx
'use client';

import { useState } from 'react';

export function SecuritySettings() {
  const [is2FA, setIs2FA] = useState(false);

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Change Password</label>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
          Update Password
        </button>
      </div>

      {/* 2FA Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Two-Factor Authentication</span>
        <button
          onClick={() => setIs2FA(!is2FA)}
          className={`px-3 py-1 rounded-md text-sm ${
            is2FA ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {is2FA ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-sm font-medium mb-2">Active Sessions</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Chrome - Jakarta - Active now</li>
          <li>Safari - iPhone - 2 hours ago</li>
        </ul>
      </div>
    </div>
  );
}
