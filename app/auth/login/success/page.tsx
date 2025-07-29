'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getTokenFromCookies } from '@/lib/auth-client';

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      const token = searchParams.get('token');
      if (token) {
        // Store token in cookies
        document.cookie = `token=${token}; path=/; max-age=${15 * 60}`; // 15 minutes
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch user');
          const userData = await res.json();
          await login(userData);
          router.push('/dashboard');
        } catch (err) {
          console.error('Failed to fetch user', err);
          router.push('/auth/login');
        }
      } else {
        router.push('/auth/login');
      }
    };
    initialize();
  }, [router, searchParams, login]);

  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}