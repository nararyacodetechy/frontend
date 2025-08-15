// services/accountService.ts
import { getTokenFromCookies } from '@/lib/auth-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const fetchMyProfile = async (overrideToken?: string) => {
  const token = overrideToken || (await getTokenFromCookies());
  if (!token) {
    console.warn('No token found!');
    return null;
  }

  const res = await fetch(`${API_BASE_URL}/profile/me`, {
    credentials: 'include', // pastikan cookie (refresh token) ikut dikirim
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Failed to fetch profile: ' + text);
  }

  return res.json();
};


