// components/RedirectIfAuthenticated.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoleEnum } from '@/types/role';
import { decodeToken } from '@/lib/jwt-client'; // kamu butuh versi client-side dari verifyToken

export default function RedirectIfAuthenticated({ token }: { token: string | undefined }) {
    const router = useRouter();

    useEffect(() => {
      if (!token) return;
      try {
        const payload = decodeToken(token); // decode, bukan verify
        const role = payload?.activeRole || RoleEnum.USER;
        router.replace(`/dashboard/${role.toLowerCase()}`);
      } catch (err) {
        console.error('Invalid token');
      }
    }, [token]);
  
    return null;

}
