'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getTokenFromCookies } from '@/lib/auth-client';
import { fetchMyProfile } from '@/services/profileService';

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      const token = searchParams.get('token');
      const refreshTokenFromQuery = searchParams.get('refreshToken');

      if (token) {
        const isSecure = location.protocol === 'https:';
        // Set token & refreshToken to cookie
        document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}; ${isSecure ? 'secure;' : ''} samesite=lax`;
        if (refreshTokenFromQuery) {
          document.cookie = `refreshToken=${refreshTokenFromQuery}; path=/; max-age=${7 * 24 * 60 * 60}; ${isSecure ? 'secure;' : ''} samesite=lax`;
        }

        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);

        try {
          // Ambil profile dari service
          const userData = await fetchMyProfile();

          await login(userData);

          // Tunggu AuthContext ready
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

          // Redirect sesuai role
          let layoutPath = `/dashboard/${userData.activeRole}`;
          if (userData.activeRole === 'user' || userData.activeRole === 'customer') {
            layoutPath = `/my-page/${userData.activeRole}`;
          }

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
