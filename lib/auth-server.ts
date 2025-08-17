import { cookies } from 'next/headers'
import { RoleEnum } from '@/types/role'
import { jwtDecode } from 'jwt-decode'
import { DecodedToken } from '@/types/auth'
import { refreshTokenApi } from '@/services/authService'

// Ambil token dari cookies (server side)
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value || null
  if (!token || !token.includes('.')) return null
  return token
}

// Decode token JWT (server-side). Hanya untuk keperluan server-side rendering.
// NOTE: jika token expired / invalid, fungsi ini kembalikan null.
export function decodeToken(token: string): DecodedToken | null {
  try {
    if (!token || !token.includes('.')) return null
    const decoded = jwtDecode<DecodedToken>(token)
    if (!Object.values(RoleEnum).includes(decoded.activeRole)) return null
    return decoded
  } catch {
    return null
  }
}

// Cek apakah user sudah login (server-side)
export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookies()
  return !!(token && decodeToken(token))
}

// Minta backend refresh-token (tidak mengirim refresh token karena backend punya state)
// Backend endpoint /auth/refresh-token harus menerima request dengan credentials: include
export async function refreshTokenLib() {
  try {
    const data = await refreshTokenApi() // updated to no-arg
    if (!data) return { accessToken: null }

    // backend akan update cookie access_token otomatis
    return { accessToken: data.accessToken ?? null }
  } catch (err) {
    console.warn('refreshTokenLib error:', err)
    return { accessToken: null }
  }
}

// Cek role (server-side)
export async function hasRole(requiredRole: RoleEnum): Promise<boolean> {
  const token = await getTokenFromCookies()
  const decoded = token ? decodeToken(token) : null
  return decoded?.activeRole === requiredRole
}
