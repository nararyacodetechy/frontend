'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchMyProfile } from '@/services/accountService';
import { setTokens } from '@/lib/auth-client';
import { RoleEnum } from '@/types/role';

const roleBasedRoutes: { [key in RoleEnum]: string } = {
  [RoleEnum.USER]: '/my-page/user',
  [RoleEnum.CUSTOMER]: '/my-page/customer',
  [RoleEnum.PRODUCT_MANAGER]: '/dashboard/product-manager',
  [RoleEnum.DESIGNER]: '/dashboard/designer',
  [RoleEnum.DEVELOPER]: '/dashboard/developer',
  [RoleEnum.DEVOPS]: '/dashboard/devops',
  [RoleEnum.SALES]: '/dashboard/sales',
  [RoleEnum.MARKETING]: '/dashboard/marketing',
  [RoleEnum.ADMIN]: '/dashboard/admin',
};

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleLoginSuccess = async () => {
      const accessToken = searchParams.get('token');       // ambil dari URL
      if (!accessToken) {
        router.push('/auth/login?error=missing-tokens');
        return;
      }

      // 1️⃣ Simpan access token di cookie
      setTokens(accessToken);

      // 2️⃣ Fetch profile pakai token langsung
      try {
        const response = await fetchMyProfile(accessToken); 
        if (!response?.data?.user) throw new Error('No profile data');

        const user = response.data.user;
        setUser({
          id: user.id,
          email: user.email,
          roles: user.roles?.map((role: string) => role as RoleEnum) || [],
          activeRole: (user.activeRole as RoleEnum) || RoleEnum.USER,
          isEmailVerified: user.isEmailVerified ?? false,
          profile: user.profile
            ? {
                id: user.profile.id,
                userId: user.profile.userId,
                fullName: user.profile.fullName,
                username: user.profile.username || null,
                nik: user.profile.nik || null,
                address: user.profile.address || null,
                phone: user.profile.phone || null,
                company: user.profile.company || null,
                imageProfile: user.profile.imageProfile || null,
              }
            : undefined,
        });

        const redirectTo = roleBasedRoutes[user.activeRole as RoleEnum] || '/my-page/user';
        router.push(redirectTo);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        router.push('/auth/login?error=profile-fetch-failed');
      }
    };

    handleLoginSuccess();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to Your Page, Please Wait...</p>
    </div>
  );
}
