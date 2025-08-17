// app/auth/register/success/page.tsx or page.jsx

'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const RegisterSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('access_token');
    if (token) {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  return <div className='min-h-screen w-full flex items-center justify-center'>Register Successfully, redirecting to login...</div>;
};

export default RegisterSuccess;
