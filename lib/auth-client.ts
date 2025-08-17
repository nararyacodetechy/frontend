'use client';

import { DecodedToken } from '@/types/auth';
import { RoleEnum } from '@/types/role';

/**
 * NOTE:
 * Karena access_token di-set sebagai HttpOnly cookie oleh backend,
 * frontend TIDAK BISA membaca cookie tersebut via JS.
 * Jadi fungsi-fungsi di sini rely ke endpoint /auth/me untuk mendapatkan
 * informasi user (profil / role).
 */

/** Ambil profile/user dari backend (mengandalkan HttpOnly cookie) */
export async function getUserProfile(): Promise<any | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // penting supaya browser kirim cookie HttpOnly
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const json = await res.json();
    // expected: { status: 'success', data: { user: { ... } } }
    return json?.data?.user ?? null;
  } catch (err) {
    console.error('getUserProfile error:', err);
    return null;
  }
}

/** Cek apakah user sudah terautentikasi (dengan memanggil /auth/me) */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUserProfile();
  return !!user;
}

/** Ambil role user (jika butuh cepat) */
export async function getUserRole(): Promise<RoleEnum | null> {
  const user = await getUserProfile();
  if (!user) return null;
  return (user.activeRole as RoleEnum) || null;
}

/** Clear client-side auth state:
 * - karena cookie httpOnly tidak dapat dihapus dari client,
 *   panggil endpoint logout di backend untuk clear cookie dan session.
 */
export async function clearClientAuthState(): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}), // backend sebaiknya support body kosong
    });
  } catch (err) {
    console.warn('clearClientAuthState failed:', err);
  }
}
