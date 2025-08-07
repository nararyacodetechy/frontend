'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, createContext, useContext } from 'react';
import {
  getTokenFromCookies,
  decodeToken,
  getRefreshTokenFromCookies,
} from '@/lib/auth-client';
import type { AuthContextType, Users } from '@/types/auth';
import { PUBLIC_ROUTES } from '@/lib/public-routes';
import { RoleEnum } from '@/types/role';
import { fetchMyProfile } from '@/services/accountService';

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  // login and logout functions
  const login = async (userData: Users) => {
    setUser(userData);
    // optionally set cookies here if needed
  };

  const logout = async () => {
    // clear server session if needed, then clear client state
    setUser(null);
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/auth/login');
  };

  useEffect(() => {
    if (
      PUBLIC_ROUTES.some((route) =>
        route === '/' ? pathname === '/' : pathname.startsWith(route)
      )
    ) {
      setLoading(false);
      return;
    }
  
    (async () => {
      const token = await getTokenFromCookies();

      if (!token) {
        setLoading(false);
        return;
      }
  
      const decoded = decodeToken(token);

      if (!decoded) {
        router.push('/auth/login');
        return;
      }
  
      try {
        const userData = await fetchMyProfile();
        
        if (!userData) throw new Error('No profile data');
  
        setUser({
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          roles: userData.roles || [],
          activeRole: userData.activeRole,
          isEmailVerified: userData.isEmailVerified ?? false,
        });
      } catch (err) {
        console.error('Failed to load user profile', err);
        const refreshToken = await getRefreshTokenFromCookies();

        if (!refreshToken) {
          router.push('/auth/login');
          return;
        }
        // TODO: implement refresh logic here
      } finally {
        setLoading(false);
      }
    })();
  }, [pathname, router]);  

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
