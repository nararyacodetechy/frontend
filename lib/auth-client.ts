// lib/auth-client.ts
'use client';

import { RoleEnum } from '@/types/role';
import { getAuthUserApi, logout } from '@/services/authService';

/** Fetch user profile client-side */
export async function getAuthUser(): Promise<any | null> {
  try {
    const profile = await getAuthUserApi();
    console.log('getAuthUser: Fetched profile', profile);
    return profile;
  } catch (err) {
    console.log('getAuthUser error:', err);
    return null;
  }
}

/** Check if user is authenticated client-side */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser();
  return !!user;
}

/** Get user role client-side */
export async function getUserRole(): Promise<RoleEnum | null> {
  const user = await getAuthUser();
  if (!user) return null;
  return (user.activeRole as RoleEnum) || null;
}

/** Clear client-side auth state by calling logout service */
export async function clearClientAuthState(): Promise<void> {
  try {
    await logout();
    console.log('clearClientAuthState: Logged out successfully');
  } catch (err) {
    console.log('clearClientAuthState failed:', err);
  }
}