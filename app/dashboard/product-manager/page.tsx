'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductManagerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || ![RoleEnum.PRODUCT_MANAGER, RoleEnum.ADMIN].includes(user.activeRole))) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || ![RoleEnum.PRODUCT_MANAGER, RoleEnum.ADMIN].includes(user.activeRole)) {
    return null; // sementara kosong, user akan diarahkan di useEffect
  }

  return (
    <div className="bg-white">
      <h2 className="text-2xl font-bold mb-4">Product Manager Dashboard</h2>
      <p>This is the dashboard for Product Managers. Oversee product development and strategy here.</p>
    </div>
  );
}
