'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
