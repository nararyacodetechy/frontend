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

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  const switchRole = (role: RoleEnum) => {
    if (user?.roles.includes(role)) {
      setUser((prev) => prev ? { ...prev, activeRole: role } : null);
    }
  };  

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
    // 1) If we're on a public page, skip all checks
    if (
      PUBLIC_ROUTES.some((route) =>
        route === '/' ? pathname === '/' : pathname.startsWith(route)
      )
    ) {
      setLoading(false);
      return;
    }

    // 2) Otherwise, see if there's a token at all
    (async () => {
      const token = await getTokenFromCookies();
      if (!token) {
        // No token? Let middleware handle redirect; we're done here.
        setLoading(false);
        return;
      }

      // 3) We *do* have a token, so try decode + fetch profile
      const decoded = decodeToken(token);
      if (!decoded) {
        // Bad token: must force login
        router.push('/auth/login');
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Profile fetch failed');

        const userData = await res.json();
        setUser({
          id: userData.id,
          fullName: userData.fullName || 'Unknown',
          email: userData.email,
          roles: userData.roles || [],
          activeRole: userData.activeRole,
        });
      } catch (err) {
        // Token might be expired → try refresh
        const refreshToken = await getRefreshTokenFromCookies();
        if (!refreshToken) {
          router.push('/auth/login');
          return;
        }
        // implement refresh logic as needed
      } finally {
        setLoading(false);
      }
    })();
  }, [pathname, router]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loading, switchRole }}
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
