'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { useRouter } from 'next/navigation';

export default function SalesDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || ![RoleEnum.SALES, RoleEnum.ADMIN].includes(user.activeRole)) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sales Dashboard</h2>
      <p>This is the dashboard for Sales. View client relations and sales metrics here.</p>
    </div>
  );
}