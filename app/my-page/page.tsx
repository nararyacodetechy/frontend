'use client';

import { useAuth } from '@/context/AuthContext';
import { RoleEnum } from '@/types/role';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import SectionHero from '@/components/landing/SectionHero';
import SectionWhyWebApp from '@/components/landing/SectionWhyWebApp';

export default function MyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || ![RoleEnum.USER, RoleEnum.CUSTOMER].includes(user.activeRole))) {
      console.log('Redirecting from my-page due to invalid role:', user?.activeRole);
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Redirection handled
  }

  return (
    <>
      <p className="text-center">Welcome to the {user.activeRole} </p>
    </>
  );
}
