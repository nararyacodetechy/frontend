'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getTokenFromCookies, decodeToken } from '@/lib/auth-client'
import { RoleEnum } from '@/types/role'

export default function Header() {
  const [showMyPage, setShowMyPage] = useState(false)
  const [myPagePath, setMyPagePath] = useState('/my-page')

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getTokenFromCookies()
      const decoded = token ? decodeToken(token) : null
      if (decoded) {
        const role = decoded.activeRole

        // Only allow USER and CUSTOMER to access "My Page"
        if (role === RoleEnum.USER) {
          setShowMyPage(true)
          setMyPagePath('/my-page/user')
        } else if (role === RoleEnum.CUSTOMER) {
          setShowMyPage(true)
          setMyPagePath('/my-page/customer')
        } else {
          setShowMyPage(false)
        }
      }
    }
    checkAuth()
  }, [])

  return (
    <header className="fixed top-0 z-40 bg-white dark:bg-[#121212] text-black dark:text-white shadow-md py-4 px-12 w-full">
      <div className="flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Mokami</Link>
        <nav>
          {showMyPage ? (
            <Link href={myPagePath} className="hover:underline">My Page</Link>
          ) : (
            <Link href="/auth/login" className="hover:underline">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
