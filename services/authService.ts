import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

// lib/authService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  const response = await res.json();
  const { accessToken, refreshToken, user } = response.data;
  const isProduction = process.env.NODE_ENV === 'production';
  document.cookie = `token=${accessToken}; path=/; max-age=${15 * 60}; secure=${isProduction}; sameSite=${
    isProduction ? 'strict' : 'lax'
  }`;
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure=${isProduction}; sameSite=${
    isProduction ? 'strict' : 'lax'
  }`;
  return { accessToken, refreshToken, user };
};

export const verifyEmail = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const resendVerification = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
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

export const refreshTokenApi = async (refreshToken: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export async function logout(refreshToken: string): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  document.cookie = 'token=; path=/; max-age=0';
  document.cookie = 'refreshToken=; path=/; max-age=0';
}

  
