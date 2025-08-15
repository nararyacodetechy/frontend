// lib/auth-client.ts

'use client';

import { DecodedToken } from '@/types/auth';
import { RoleEnum } from '@/types/role';
import { jwtDecode } from 'jwt-decode';

// auth-client.ts
export function setTokens(accessToken: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? 'Secure; SameSite=Strict' : 'SameSite=Lax';
  document.cookie = `token=${accessToken}; path=/; max-age=${15*60}; ${secureFlag}`;
}

export function clearTokens() {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? 'Secure; SameSite=Strict' : 'SameSite=Lax';
  document.cookie = `token=; path=/; max-age=0; ${secureFlag}`;
}

// Ambil token dari cookies (client side)
export async function getTokenFromCookies(): Promise<string | null> {
  for (let i = 0; i < 3; i++) {
    const cookies = document.cookie.split(';').map((c) => c.trim());
    const token = cookies.find((c) => c.startsWith('token='))?.split('=')[1] || null;
    if (token && token.includes('.')) return token;
    console.warn('No valid token found, user not logged in');
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

// Ambil refresh token dari cookies (client side)
export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookies = document.cookie.split(';').map((c) => c.trim());
  const refreshToken = cookies.find((c) => c.startsWith('refreshToken='))?.split('=')[1] || null;
  if (!refreshToken) {
    console.error('No refresh token cookie found');
    return null;
  }
  return refreshToken;
}

// Decode token JWT
export function decodeToken(token: string): DecodedToken | null {
  try {
    if (!token || !token.includes('.')) return null;
    const decoded = jwtDecode<DecodedToken>(token);
    if (!Object.values(RoleEnum).includes(decoded.activeRole)) {
      // console.error(`Invalid role: ${decoded.activeRole}`);
      return null;
    }
    return decoded;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

// Cek apakah user sudah login
export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookies();
  return !!(token && decodeToken(token));
}
