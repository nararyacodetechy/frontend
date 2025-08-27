// context/AuthContext.ts
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AuthContextType } from '@/types/auth';
import type { Users } from '@/types/user';
import { PUBLIC_ROUTES } from '@/lib/public-routes';
import { getAuthUser, clearClientAuthState } from '@/lib/auth-client';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback(async (payload: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Login failed');
    }
    const data = await res.json();
    const returnedUser = data?.data?.user ?? null;
    setUser(returnedUser);
    return returnedUser;
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const profile = await getAuthUser();
      setUser(profile);
    } catch (err) {
      console.log('AuthProvider: Failed to load user profile', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearClientAuthState();
    } catch (err) {
      console.log('AuthProvider: logout failed', err);
    }
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname) && pathname !== '/auth/login/success') {
      setLoading(false);
      return;
    }
    loadUser();
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