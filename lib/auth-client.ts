'use client';

import { RoleEnum } from '@/types/role';
import { getAuthUserApi, logout } from '@/services/authService';

/** Ambil profile/user */
export async function getAuthUser(): Promise<any | null> {
  try {
    return await getAuthUserApi();
  } catch (err) {
    console.error('getAuthUser error:', err);
    return null;
  }
}

/** Cek apakah user sudah login */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser();
  return !!user;
}

/** Ambil role user */
export async function getUserRole(): Promise<RoleEnum | null> {
  const user = await getAuthUser();
  if (!user) return null;
  return (user.activeRole as RoleEnum) || null;
}

/** Clear client-side auth state dengan panggil service */
export async function clearClientAuthState(): Promise<void> {
  try {
    await logout();
  } catch (err) {
    console.warn('clearClientAuthState failed:', err);
  }
}
