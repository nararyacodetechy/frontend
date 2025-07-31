'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken, getTokenFromCookies } from '@/lib/auth-client';
import { RoleEnum } from '@/types/role';

const redirectRoles = [
  RoleEnum.ADMIN,
  RoleEnum.DEVELOPER,
  RoleEnum.DESIGNER,
  RoleEnum.DEVOPS,
  RoleEnum.PRODUCT_MANAGER,
  RoleEnum.SALES,
  RoleEnum.MARKETING,
];

export default function RedirectIfAuthenticated() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getTokenFromCookies();
      if (!token) return;

      try {
        const payload = decodeToken(token);
        const role = payload?.activeRole;

        if (role && redirectRoles.includes(role)) {
          router.replace(`/dashboard/${role.toLowerCase()}`);
        }
      } catch (err) {
        console.error('Invalid token', err);
      }
    };

    checkAuth();
  }, [router]);

  return null;
}
