// services/accountService.ts
import type { Users } from '@/types/user';
import { decodeToken } from '@/lib/auth-server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

type FetchOpts = {
  cookie?: string;
  userId?: string;
};

export const fetchMyProfile = async (opts: FetchOpts = {}): Promise<Users | null> => {
  try {
    const headersObj: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    let token: string | null = null;
    let userId = opts.userId;

    if (opts.cookie && !userId) {
      const cookieString = opts.cookie;
      console.log('fetchMyProfile: Cookie string', cookieString);
      const cookies = cookieString.split(';').map((c) => c.trim());
      const accessTokenCookie = cookies.find((c) => c.startsWith('access_token_'));
      if (accessTokenCookie) {
        token = accessTokenCookie.split('=')[1];
        const cookieName = accessTokenCookie.split('=')[0];
        userId = cookieName.replace('access_token_', '');
        console.log('fetchMyProfile: Extracted userId from cookie', userId);
      }
    } else if (opts.cookie && opts.userId) {
      const cookieString = opts.cookie;
      console.log('fetchMyProfile: Cookie string', cookieString);
      const cookies = cookieString.split(';').map((c) => c.trim());
      const accessTokenCookie = cookies.find((c) => c.startsWith(`access_token_${opts.userId}=`));
      token = accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
    }

    console.log('fetchMyProfile: Extracted token', token);

    if (!token || !userId) {
      console.log('fetchMyProfile: No token or userId, returning null');
      return null; // Gracefully return null for unauthenticated users
    }

    headersObj['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/profile/me?userId=${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: headersObj,
      cache: 'no-store',
    });

    console.log('fetchMyProfile: Response', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
    });

    if (res.status === 401 || res.status === 403) {
      console.error('fetchMyProfile: Unauthorized or Forbidden response');
      return null;
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('fetchMyProfile: Failed response', text);
      throw new Error(`Failed to fetch profile: ${text}`);
    }

    const json = await res.json();
    console.log('fetchMyProfile: Response JSON', json);
    return json?.data?.user ?? null;
  } catch (err) {
    console.error('fetchMyProfile error:', err);
    return null; // Return null instead of throwing for unauthenticated users
  }
};