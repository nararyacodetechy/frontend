'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || ![RoleEnum.SALES, RoleEnum.MARKETING, RoleEnum.PRODUCT_MANAGER, RoleEnum.DESIGNER, RoleEnum.DEVELOPER, RoleEnum.DEVOPS, RoleEnum.ADMIN].includes(user.activeRole))) {
      console.log('Redirecting from dashboard due to invalid role:', user?.activeRole); // Debug
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Middleware or useEffect will handle redirection
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <p>Welcome to the {user.activeRole} dashboard. Select a specific dashboard from the sidebar to view role-specific information.</p>
    </div>
  );
}