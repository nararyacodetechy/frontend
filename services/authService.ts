// services/authService.tsx
import { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';
import { Users } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function login(payload: { email: string; password: string }): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return await res.json();
  } catch (err) {
    console.log('login error:', err);
    throw err;
  }
}

export async function logout(): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Logout failed');
    }
  } catch (err) {
    console.log('logout error:', err);
    throw err;
  }
}

export async function refreshTokenApi(userId?: string): Promise<{ accessToken: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Failed to refresh token');
    }
    const data = await res.json();
    return { accessToken: data.accessToken ?? null };
  } catch (err) {
    console.log('refreshTokenApi error:', err);
    return { accessToken: null };
  }
}

export async function getAuthUserApi(userId?: string): Promise<Users | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me${userId ? `?userId=${userId}` : ''}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      console.log('getAuthUserApi: Failed response', await res.text());
      return null;
    }
    const json = await res.json();
    console.log('getAuthUserApi: Response JSON', json);
    return json?.data?.user ?? null;
  } catch (err) {
    console.log('getAuthUserApi error:', err);
    return null;
  }
}

// export async function getAuthUserApi(userId?: string): Promise<any | null> {
//   try {
//     const res = await fetch(`${API_BASE_URL}/auth/me?userId=${userId || ''}`, {
//       method: 'GET',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       cache: 'no-store',
//     });
//     if (!res.ok) return null;
//     const json = await res.json();
//     return json?.data?.user ?? null;
//   } catch (err) {
//     console.error('getAuthUserApi error:', err);
//     return null;
//   }
// }

export const register = async (data: RegisterPayload): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// export const login = async (data: LoginPayload): Promise<any> => {
//   const res = await fetch(`${API_BASE_URL}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//     credentials: 'include',
//   });

//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// };

export const verifyEmail = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    credentials: 'include',
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const resendVerification = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to resend verification email');
  }

  return await response.json();
};

export function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/auth/google?prompt=select_account`;
}

// export const refreshTokenApi = async (userId?: string): Promise<any> => {
//   const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     cache: 'no-store',
//     body: JSON.stringify({ userId }),
//   });

//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// };

// export async function logout(): Promise<void> {
//   const res = await fetch(`${API_BASE_URL}/auth/logout`, {
//     method: 'POST',
//     credentials: 'include',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({}),
//   });

//   if (!res.ok) {
//     try {
//       const err = await res.json();
//       console.warn('Logout failed:', err);
//     } catch {
//       console.warn('Logout failed with non-json response');
//     }
//   }
// };