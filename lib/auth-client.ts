'use client';

import { DecodedToken } from '@/types/auth';
import { RoleEnum } from '@/types/role';
import { jwtDecode } from 'jwt-decode';



export async function getTokenFromCookies(): Promise<string | null> {
  // Retry up to 3 times with 100ms delay to handle timing issues
  for (let i = 0; i < 3; i++) {
    const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    if (token && token.includes('.')) {
      return token;
    }
    if (!token) {
      console.error('No token cookie found');
    } else {
      console.error('Invalid token format: token is malformed');
    }
    // Wait 100ms before retrying
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
  const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));
  const refreshToken = refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
  if (!refreshToken) {
    console.error('No refresh token cookie found');
    return null;
  }
  return refreshToken;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    if (!token || !token.includes('.')) {
      console.error('Invalid token format: token is empty or malformed');
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
  if (!token) {
    return false;
  }
  const decoded = decodeToken(token);
  return !!decoded;
}