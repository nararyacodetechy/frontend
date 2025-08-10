'use server';

import { cookies } from 'next/headers';
import { RoleEnum } from '@/types/role';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types/auth';

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token || !token.includes('.')) {
    console.error('No token Valid, User not login');
    return null;
  }
  return token;
}

export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    console.error('No refresh token found in cookies');
    return null;
  }
  return refreshToken;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    if (!token || !token.includes('.')) {
      console.error('No token Valid, User not login');
      return null;
    }
    const decoded = jwtDecode<DecodedToken>(token);
    if (!Object.values(RoleEnum).includes(decoded.activeRole)) {
      console.error(`Invalid role: ${decoded.activeRole}`);
      return null;
    }
    return decoded;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookies();
  if (!token) return false;
  const decoded = decodeToken(token);
  return !!decoded;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshTokenFromCookies();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Refresh token request failed: ${errorText}`);
      throw new Error(errorText);
    }
    const response = await res.json();
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    cookieStore.set('token', accessToken, {
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });
    if (newRefreshToken) {
      cookieStore.set('refreshToken', newRefreshToken, {
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    }
    return accessToken;
  } catch (err) {
    console.error('Failed to refresh token:', err);
    return null;
  }
}

export async function hasRole(requiredRole: RoleEnum): Promise<boolean> {
  const token = await getTokenFromCookies();
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  return decoded.activeRole === requiredRole;
}