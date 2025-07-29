'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || ![RoleEnum.USER, RoleEnum.CUSTOMER, RoleEnum.ADMIN].includes(user.activeRole))) {
      console.log('Redirecting from my-page due to invalid role:', user?.activeRole); // Debug
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
      <h2 className="text-2xl font-bold mb-4">My Page Overview</h2>
      <p>Welcome to your personal page, {user.fullName || 'User'}. Use the sidebar to navigate to your profile or other features.</p>
    </div>
  );
}