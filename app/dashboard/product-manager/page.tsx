// app/dashboard/product-manager/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductManagerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !isRedirecting && (!user || ![RoleEnum.PRODUCT_MANAGER, RoleEnum.ADMIN].includes(user.activeRole))) {
      setIsRedirecting(true);
      router.push('/auth/login');
    }
  }, [user, loading, router, isRedirecting]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || ![RoleEnum.PRODUCT_MANAGER, RoleEnum.ADMIN].includes(user.activeRole)) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="bg-white">
      <h2 className="text-2xl font-bold mb-4">Product Manager Dashboard</h2>
      <p>This is the dashboard for Product Managers. Oversee product development and strategy here.</p>
    </div>
  );
}