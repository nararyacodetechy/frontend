'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AuthContextType } from '@/types/auth';
import type { Users } from '@/types/user';
import { PUBLIC_ROUTES } from '@/lib/public-routes';
import { fetchMyProfile } from '@/services/accountService';
import { login as loginApi, logout as logoutApi } from '@/services/authService';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback(async (payload: any) => {
    const res = await loginApi(payload);
    // backend should return { status, message, data: { user } }
    const returnedUser = res?.data?.user ?? null;
    setUser(returnedUser);
    return returnedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi(); // backend should accept no-arg and clear cookie/session
    } catch (err) {
      console.warn('logoutApi failed:', err);
    }
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  const loadUser = useCallback(async () => {
    try {
      const profile = await fetchMyProfile(); // will use credentials: 'include'
      if (!profile) {
        setUser(null);
        return;
      }
      setUser(profile);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setUser(null);
      // optional: try refresh flow here by calling refreshTokenApi from authService
    }
  }, []);

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      setLoading(false);
      return;
    }
    loadUser().finally(() => setLoading(false));
  }, [pathname, loadUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
