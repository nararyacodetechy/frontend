// services/accountService.ts
import type { Users } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

type FetchOpts = { cookie?: string };

// services/accountService.ts
export const fetchMyProfile = async (opts?: FetchOpts): Promise<Users | null> => {
  try {
    const headersObj: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (opts?.cookie) {
      headersObj['cookie'] = opts.cookie;
    }

    const res = await fetch(`${API_BASE_URL}/profile/me`, {
      method: 'GET',
      credentials: opts?.cookie ? 'omit' : 'include',
      headers: headersObj,
      cache: 'no-store',
    });

    if (res.status === 401 || res.status === 403) {
      // 🔑 user belum login → dianggap guest
      return null;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error('Failed to fetch profile: ' + text);
    }

    const json = await res.json();
    return json?.data?.user ?? null;
  } catch (err) {
    console.error('fetchMyProfile error:', err);
    return null;
  }
};

