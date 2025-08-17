'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchMyProfile } from '@/services/accountService';
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const profile = await fetchMyProfile();
        const role = profile?.role || profile?.activeRole;

        if (role && redirectRoles.includes(role)) {
          setIsRedirecting(true);
          setTimeout(() => {
            router.replace(`/dashboard/${role.toLowerCase()}`);
          }, 1500);
        }
      } catch (err) {
        // Tidak login atau fetch gagal, biarkan user tetap di halaman login
        console.warn('User not authenticated or failed to fetch profile:', err);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <>
      {isRedirecting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 text-center p-6 rounded-md shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              You logged in before
            </h2>
            <div className="text-gray-500">Preparing your dashboard...</div>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait, redirecting to your dashboard.
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
