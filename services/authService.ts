import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function getAuthUserApi(): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include", // kirim cookie HttpOnly
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.user ?? null;
  } catch (err) {
    console.error("getAuthUser error:", err);
    return null;
  }
}

export const register = async (data: RegisterPayload): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const login = async (data: LoginPayload): Promise<any> => {
  // Backend akan set HttpOnly cookie (access_token) pada response
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include', // penting supaya browser menerima Set-Cookie
  });

  if (!res.ok) throw new Error(await res.text());
  // backend returns { status, message, data: { user } }
  return res.json();
};

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
    headers: {
      'Content-Type': 'application/json',
    },
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

/**
 * Refresh token API.
 * NOTE: backend should read refresh token from DB/session and issue new access_token cookie.
 * We do not send refreshToken from client.
 */
export const refreshTokenApi = async (): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({}), // body empty - backend shouldn't require client-sent refreshToken
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export async function logout(): Promise<void> {
  // Backend should invalidate session for req.user.userId or for the session related to cookie
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}), // send empty body; backend should accept and delete session(s)
  });

  if (!res.ok) {
    try {
      const err = await res.json();
      console.warn('Logout failed:', err);
    } catch {
      console.warn('Logout failed with non-json response');
    }
  }
  // Do not attempt to clear HttpOnly cookie from client — backend must clear it using res.clearCookie
}
