// app/my-page/customer/profile/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { useRouter } from 'next/navigation';

export default function CustomerProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || ![RoleEnum.CUSTOMER].includes(user.activeRole)) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Customer Profile</h2>
      <p>Name: {user.fullName}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.activeRole}</p>
      {/* Add more profile details or edit form here */}
    </div>
  );
}