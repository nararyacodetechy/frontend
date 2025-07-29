'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { useRouter } from 'next/navigation';

export default function DevOpsDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || ![RoleEnum.DEVOPS, RoleEnum.ADMIN].includes(user.activeRole)) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">DevOps Dashboard</h2>
      <p>This is the dashboard for DevOps. Manage deployment and infrastructure here.</p>
    </div>
  );
}