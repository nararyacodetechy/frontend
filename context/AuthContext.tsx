'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AuthContextType } from '@/types/auth';
import type { Users } from '@/types/user';
import { PUBLIC_ROUTES } from '@/lib/public-routes';
import { fetchMyProfile } from '@/services/accountService';
import { getTokenFromCookies, decodeToken, getRefreshTokenFromCookies } from '@/lib/auth-client';
import { login as loginApi, logout as logoutApi } from '@/services/authService';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback(async (payload: any) => {
    const { user } = await loginApi(payload);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = await getRefreshTokenFromCookies(); // ← tambahkan await
    if (refreshToken) await logoutApi(refreshToken);
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  const loadUser = useCallback(async () => {
    const token = await getTokenFromCookies(); // ← tambahkan await
    if (!token) return;
  
    const decoded = decodeToken(token);
    if (!decoded) {
      logout();
      return;
    }
  
    try {
      const profile = await fetchMyProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      const refreshToken = await getRefreshTokenFromCookies(); // ← tambahkan await
      if (!refreshToken) logout();
      // TODO: refresh logic here
    }
  }, [logout]);

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
