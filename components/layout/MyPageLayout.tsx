// components/layout/MyPageLayout.tsx
import React, { ReactNode } from 'react';

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="px-8 py-8">
        {children}
      </div>
    </div>
  );
}
