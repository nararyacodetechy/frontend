// lib/auth-server.ts
import { cookies } from 'next/headers'
import { RoleEnum } from '@/types/role'
import { jwtDecode } from 'jwt-decode'
import { DecodedToken } from '@/types/auth'
import { refreshTokenApi } from '@/services/authService'

// Ambil token dari cookies (server side)
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || null
  if (!token || !token.includes('.')) return null
  return token
}

// Ambil refresh token dari cookies (server side)
export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('refreshToken')?.value || null
}

// Decode token JWT
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

// Cek apakah user sudah login
export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookies()
  return !!(token && decodeToken(token))
}

// Refresh access token pakai refresh token
export async function refreshTokenLib() {
  const refreshToken = await getRefreshTokenFromCookies()
  if (!refreshToken) return { accessToken: null }

  const data = await refreshTokenApi(refreshToken)
  if (!data) return { accessToken: null }

  const { accessToken, refreshToken: newRefreshToken } = data.data
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieStore = await cookies()

  cookieStore.set('token', accessToken, {
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  if (newRefreshToken) {
    cookieStore.set('refreshToken', newRefreshToken, {
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })
  }

  return { accessToken }
}

// Cek role
export async function hasRole(requiredRole: RoleEnum): Promise<boolean> {
  const token = await getTokenFromCookies()
  const decoded = token ? decodeToken(token) : null
  return decoded?.activeRole === requiredRole
}
