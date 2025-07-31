'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getTokenFromCookies } from '@/lib/auth-client';
import { refreshToken } from '@/services/authService';

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      const token = searchParams.get('token');
  
      if (token) {
        const isSecure = location.protocol === 'https:';
        document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}; ${isSecure ? 'secure;' : ''} samesite=lax`; // 1 day
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; ${isSecure ? 'secure;' : ''} samesite=lax`; // 2 weeks
  
        // Hapus token dari URL agar useEffect tidak trigger terus
        window.history.replaceState({}, '', window.location.pathname);
  
        try {
          // Ambil dari hasil login, bukan fungsi
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Misalnya dari query param? (kalau belum ada, backend perlu tambahkan token refresh ke URL)
          const refreshTokenValue = searchParams.get('refreshToken');
          if (refreshTokenValue) {
            document.cookie = `refreshToken=${refreshTokenValue}; path=/; max-age=${7 * 24 * 60 * 60}; ${isSecure ? 'secure;' : ''} samesite=lax`;
          }

          if (!res.ok) throw new Error('Failed to fetch user');
          const userData = await res.json();
  
          console.log('Calling login...');
          await login(userData);
          console.log('Login finished');
  
          const waitForAuthContext = () =>
            new Promise((resolve) => {
              const interval = setInterval(() => {
                if (!loading) {
                  clearInterval(interval);
                  resolve(true);
                }
              }, 100);
            });
  
          await waitForAuthContext();
  
          console.log('AuthContext ready');
          console.log('User Data:', userData);
  
          let layoutPath = `/dashboard/${userData.activeRole}`;
          if (userData.activeRole === 'user' || userData.activeRole === 'customer') {
            layoutPath = `/my-page/${userData.activeRole}`;
          }

          console.log('dashboard path', layoutPath);
          router.push(layoutPath);
        } catch (err) {
          console.error('Failed to fetch user', err);
          router.push('/auth/login');
        }
      } else {
        router.push('/auth/login');
      }
    };
  
    initialize();
  }, [router, searchParams, login, loading]);  

  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}