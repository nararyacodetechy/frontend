// components/landing/Header.tsx
import Link from 'next/link'
import { getTokenFromCookies, getRefreshTokenFromCookies, decodeToken, refreshTokenLib } from '@/lib/auth-server'
import { RoleEnum } from '@/types/role'

export default async function Header() {
  let token = await getTokenFromCookies()
  let decoded = token ? decodeToken(token) : null

  // Jika token invalid / expired, pakai refresh token
  if (!decoded) {
    const refreshToken = await getRefreshTokenFromCookies()
    if (refreshToken) {
      const result = await refreshTokenLib()
      token = result.accessToken
      decoded = token ? decodeToken(token) : null
    }
  }

  const role = decoded?.activeRole || null
  const showMyPage = role === RoleEnum.USER
  const myPagePath = '/my-page/user'

  return (
    <header className="fixed top-0 z-40 bg-white dark:bg-[#121212] text-black dark:text-white border-b border-gray-200 py-4 px-12 w-full">
      <div className="flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Mokami</Link>
        <nav>
          {showMyPage ? (
            <Link href={myPagePath}>My Page</Link>
          ) : (
            <Link href="/auth/login">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

