// services/profileService.ts
import { getTokenFromCookies } from '@/lib/auth-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const fetchMyProfile = async () => {
  const token = await getTokenFromCookies();

  if (!token) {
    console.warn('No token found!');
    return null;
  }

  const res = await fetch(`${API_BASE_URL}/profile/me`, {
    credentials: 'include', // ⬅ penting agar browser kirim cookie
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });  

  if (!res.ok) {
    const text = await res.text();
    console.error('Fetch profile failed:', res.status, text);
    throw new Error('Failed to fetch profile');
  }

  return res.json();
};

