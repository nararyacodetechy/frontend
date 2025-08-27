// lib/auth-server.ts
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types/auth';
import { refreshTokenApi } from '@/services/authService';
import { RoleEnum } from '@/types/role';

export async function getTokenFromCookies(userId?: string): Promise<string | null> {
  const cookieStore = await cookies();
  if (userId) {
    const token = cookieStore.get(`access_token_${userId}`)?.value || null;
    console.log('getTokenFromCookies: Token for userId', userId, token ? 'found' : 'not found');
    if (!token || !token.includes('.')) return null;
    return token;
  }

  // Fallback to any access_token_<userId> cookie
  const tokenCookie = cookieStore.getAll().find((c) => c.name.startsWith('access_token_'));
  const token = tokenCookie?.value || null;
  console.log('getTokenFromCookies: Token from any cookie', token ? 'found' : 'not found');
  if (!token || !token.includes('.')) return null;
  return token;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    if (!token || !token.includes('.')) return null;
    const decoded = jwtDecode<DecodedToken>(token);
    if (!Object.values(RoleEnum).includes(decoded.activeRole)) return null;
    console.log('decodeToken: Decoded token', decoded);
    return decoded;
  } catch (err) {
    console.log('decodeToken: Error decoding token', err);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookies();
  return !!(token && decodeToken(token));
}

export async function refreshTokenLib(userId?: string) {
  try {
    const data = await refreshTokenApi(userId);
    if (!data) return { accessToken: null };
    console.log('refreshTokenLib: Token refreshed', !!data.accessToken);
    return { accessToken: data.accessToken ?? null };
  } catch (err) {
    console.log('refreshTokenLib: Error refreshing token', err);
    return { accessToken: null };
  }
}

export async function hasRole(requiredRole: RoleEnum): Promise<boolean> {
  const token = await getTokenFromCookies();
  const decoded = token ? decodeToken(token) : null;
  return decoded?.activeRole === requiredRole;
}